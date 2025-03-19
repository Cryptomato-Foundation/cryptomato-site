-- Create users table for storing user data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  particle_uuid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read users data
CREATE POLICY "Allow public read access" ON public.users
  FOR SELECT USING (true);

-- Create policy to allow users to update their own data (based on wallet address)
CREATE POLICY "Allow wallet owners to update their data" ON public.users
  FOR UPDATE USING (auth.uid()::text = wallet_address);

-- Create policy to enable admins to insert data
CREATE POLICY "Allow service role to insert data" ON public.users
  FOR INSERT WITH CHECK (true);

-- Add function for setting update_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to set updated_at timestamp on row update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index on wallet_address for faster lookups
CREATE INDEX idx_users_wallet_address ON public.users(wallet_address); 