/*
# Make owner_id nullable for demo seed data

## Changes
- Alter companies.owner_id to be nullable so demo companies can exist without an auth user
- Demo companies seeded by the platform will have NULL owner_id
- Real suppliers who register will create companies with their own auth.uid() as owner_id
*/

ALTER TABLE companies ALTER COLUMN owner_id DROP NOT NULL;
