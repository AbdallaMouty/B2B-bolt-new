/*
# B2B Manufacturing Marketplace — Core Schema

## Overview
Creates the foundational database schema for a B2B manufacturing marketplace focused on Iraq.
Supports product discovery, company discovery, quote requests, and messaging between buyers and suppliers.

## New Tables

### categories
- Product and company categories (e.g., Industrial Machinery, Packaging Machinery)
- Self-referencing parent_id for subcategories
- slug for SEO-friendly URLs

### companies
- Supplier company profiles
- name, slug, description, logo_url, location fields
- verification_status (pending/verified)
- year_established, company_size, website
- user_id link to auth.users (owner)

### products
- Products listed by supplier companies
- name, slug, description, image_url
- category_id, company_id
- min_order_quantity, availability, tags
- view_count for analytics
- featured flag for homepage display

### product_specifications
- Technical specs for products (key-value pairs)
- spec_name, spec_value, display_order

### inquiries (quote requests)
- Buyer quote requests for products
- product_id, company_id
- buyer name, company, phone, email, message
- quantity requested
- status (pending/responded/closed)

### conversations
- Buyer-supplier conversation threads
- buyer_id (auth user), company_id
- product_id (optional context)

### messages
- Individual messages in a conversation
- conversation_id, sender_id, body
- is_read flag

## Security
- RLS enabled on all tables
- Public read access for products, companies, categories (anon + authenticated)
- Write access restricted to authenticated owners
- Inquiries and messages scoped to owner
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  logo_url text,
  country text DEFAULT 'Iraq',
  city text,
  address text,
  phone text,
  email text,
  website text,
  business_category text,
  year_established int,
  company_size text,
  verification_status text NOT NULL DEFAULT 'pending',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_companies" ON companies;
CREATE POLICY "public_read_companies" ON companies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_company" ON companies;
CREATE POLICY "owner_insert_company" ON companies FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "owner_update_company" ON companies;
CREATE POLICY "owner_update_company" ON companies FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "owner_delete_company" ON companies;
CREATE POLICY "owner_delete_company" ON companies FOR DELETE
  TO authenticated USING (auth.uid() = owner_id);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  image_url text,
  min_order_quantity text,
  availability text DEFAULT 'In Stock',
  tags text[] DEFAULT '{}',
  view_count int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, slug)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_product" ON products;
CREATE POLICY "owner_insert_product" ON products FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = products.company_id AND companies.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "owner_update_product" ON products;
CREATE POLICY "owner_update_product" ON products FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = products.company_id AND companies.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = products.company_id AND companies.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "owner_delete_product" ON products;
CREATE POLICY "owner_delete_product" ON products FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = products.company_id AND companies.owner_id = auth.uid())
  );

-- Product specifications
CREATE TABLE IF NOT EXISTS product_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_name text NOT NULL,
  spec_value text NOT NULL,
  display_order int NOT NULL DEFAULT 0
);

ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_specs" ON product_specifications;
CREATE POLICY "public_read_specs" ON product_specifications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_spec" ON product_specifications;
CREATE POLICY "owner_insert_spec" ON product_specifications FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      JOIN companies ON companies.id = products.company_id
      WHERE products.id = product_specifications.product_id
      AND companies.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "owner_delete_spec" ON product_specifications;
CREATE POLICY "owner_delete_spec" ON product_specifications FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN companies ON companies.id = products.company_id
      WHERE products.id = product_specifications.product_id
      AND companies.owner_id = auth.uid()
    )
  );

-- Inquiries (quote requests)
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_name text NOT NULL,
  buyer_company text,
  buyer_phone text NOT NULL,
  buyer_email text NOT NULL,
  quantity text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_inquiry" ON inquiries;
CREATE POLICY "public_insert_inquiry" ON inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "owner_read_inquiries" ON inquiries;
CREATE POLICY "owner_read_inquiries" ON inquiries FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = inquiries.company_id AND companies.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "owner_update_inquiry_status" ON inquiries;
CREATE POLICY "owner_update_inquiry_status" ON inquiries FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = inquiries.company_id AND companies.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = inquiries.company_id AND companies.owner_id = auth.uid())
  );

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "participant_read_conversation" ON conversations;
CREATE POLICY "participant_read_conversation" ON conversations FOR SELECT
  TO authenticated USING (
    conversations.buyer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM companies WHERE companies.id = conversations.company_id AND companies.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "buyer_insert_conversation" ON conversations;
CREATE POLICY "buyer_insert_conversation" ON conversations FOR INSERT
  TO authenticated WITH CHECK (conversations.buyer_id = auth.uid());

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "participant_read_messages" ON messages;
CREATE POLICY "participant_read_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (
        conversations.buyer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM companies WHERE companies.id = conversations.company_id AND companies.owner_id = auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "participant_insert_message" ON messages;
CREATE POLICY "participant_insert_message" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (
        conversations.buyer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM companies WHERE companies.id = conversations.company_id AND companies.owner_id = auth.uid())
      )
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_inquiries_company_id ON inquiries(company_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id ON inquiries(product_id);
CREATE INDEX IF NOT EXISTS idx_conversations_company_id ON conversations(company_id);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
