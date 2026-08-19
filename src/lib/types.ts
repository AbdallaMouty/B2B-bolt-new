export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parent_id: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  country: string;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  business_category: string | null;
  year_established: number | null;
  company_size: string | null;
  verification_status: string;
  is_featured: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  min_order_quantity: string | null;
  availability: string;
  tags: string[];
  view_count: number;
  is_featured: boolean;
  created_at: string;
}

export interface ProductSpecification {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  display_order: number;
}

export interface ProductWithCompany extends Product {
  company: Pick<Company, 'id' | 'name' | 'slug' | 'city' | 'verification_status' | 'logo_url'>;
  category: Pick<Category, 'id' | 'name' | 'slug'> | null;
}

export interface CompanyWithStats extends Company {
  product_count?: number;
}

export interface Inquiry {
  id: string;
  product_id: string;
  company_id: string;
  buyer_id: string | null;
  buyer_name: string;
  buyer_company: string | null;
  buyer_phone: string;
  buyer_email: string;
  quantity: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface InquiryWithDetails extends Inquiry {
  product: Pick<Product, 'id' | 'name' | 'slug' | 'image_url'>;
  company: Pick<Company, 'id' | 'name' | 'slug'>;
}

export interface Conversation {
  id: string;
  buyer_id: string;
  company_id: string;
  product_id: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationWithDetails extends Conversation {
  company: Pick<Company, 'id' | 'name' | 'slug' | 'logo_url'>;
  product: Pick<Product, 'id' | 'name' | 'slug'> | null;
  messages: Message[];
}
