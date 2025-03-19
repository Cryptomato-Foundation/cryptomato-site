This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Cryptomato - Crypto Review Platform

Cryptomato is a cryptocurrency project review platform, similar to Rotten Tomatoes but for crypto projects. Users can review, rate, and discover crypto projects.

## Authentication System

The authentication system uses Particle Network for creating account abstraction wallets and Supabase for storing user data.

Key features:
- Social login via Particle Network (Google, Twitter, Discord, etc.)
- Account abstraction wallet creation
- User data storage in Supabase
- User profile UI and wallet display

### Setup Authentication

1. Create a Particle Network account at [https://particle.network/](https://particle.network/)
2. Create a Supabase project at [https://supabase.com/](https://supabase.com/)
3. Set up the users table in Supabase using the SQL in `/scripts/user_table_creation.sql`
   * **Important**: The SQL script creates a standalone users table without foreign key dependencies on Supabase Auth
4. Copy `.env.local.template` to `.env.local` and fill in your credentials:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   SUPABASE_JWT_SECRET=your-supabase-jwt-secret
   
   # Particle Network Configuration
   NEXT_PUBLIC_PARTICLE_PROJECT_ID=your-particle-project-id
   NEXT_PUBLIC_PARTICLE_CLIENT_KEY=your-particle-client-key
   NEXT_PUBLIC_PARTICLE_APP_ID=your-particle-app-id
   ```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required to bypass Row Level Security policies when creating new users. You can find this key in your Supabase project settings under API settings.

#### Database Schema

The user table is designed to work independently of Supabase Auth:

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,                        -- Generated UUID, not linked to auth.users
  wallet_address TEXT NOT NULL UNIQUE,        -- User's wallet address from Particle Network
  email TEXT,                                 -- User's email (optional)
  name TEXT,                                  -- User's name (optional)
  avatar_url TEXT,                            -- User's avatar URL (optional)
  particle_uuid TEXT,                         -- Particle Network UUID (optional)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

This design allows us to use Particle Network for authentication while storing user data in Supabase.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

- `src/components/auth` - Authentication components
- `src/lib/auth` - Authentication services and utilities
- `src/lib/store` - Zustand stores for state management
- `src/lib/supabase` - Supabase client and database functions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
