# Supabase Integration Guide

This document explains how to connect to and use Supabase in the MS-Portfolio project.

## Table of Contents
- [Overview](#overview)
- [Database Schema Strategy](#database-schema-strategy)
- [Setup & Configuration](#setup--configuration)
- [Database Schema](#database-schema)
- [Usage in Code](#usage-in-code)
- [Migrations](#migrations)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Overview

MS-Portfolio uses Supabase for backend persistence, primarily for storing contact form submissions. The integration is **optional** — the application gracefully handles missing credentials and falls back to alternative methods when Supabase is unavailable.

### Key Features
- ✅ Optional persistence (app works without Supabase)
- ✅ Multi-project database with schema isolation
- ✅ Row Level Security (RLS) enabled
- ✅ Graceful fallback behavior
- ✅ Type-safe client integration

## Database Schema Strategy

The database uses a **multi-project architecture** with two types of schemas:

### 1. `public` Schema (Shared)
Contains tables shared across all Monynha projects:
- `leads` - Contact form submissions from all projects
- Future shared tables (users, analytics, etc.)

### 2. `portfolio` Schema (Project-Specific)
Contains tables specific to MS-Portfolio:
- Currently empty
- Future tables: project metadata, artwork data, series info

### Why This Approach?
- **Resource Efficiency**: Single database for multiple projects
- **Data Isolation**: Project-specific data in dedicated schemas
- **Shared Resources**: Common tables (like leads) in `public` schema
- **Scalability**: Easy to add new projects with their own schemas

## Setup & Configuration

### 1. Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
VITE_SUPABASE_SCHEMA=portfolio
```

**How to get these values:**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings → API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_KEY`
   - **Schema** → `VITE_SUPABASE_SCHEMA` (use `portfolio` for project-specific tables, `public` for shared tables)

### 2. Install Dependencies

Dependencies are already in `package.json`:

```bash
npm install
```

The key package is `@supabase/supabase-js` (v2.58.0+).

### 3. Run Migrations

Migrations are applied automatically when you use the Supabase dashboard or CLI. Current migrations:

1. `create_leads_table` - Creates the shared leads table
2. `create_portfolio_schema` - Creates the portfolio schema
3. `document_schema_strategy` - Adds `project_source` column

**To apply migrations manually** (if needed):

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Database Schema

### `public.leads` Table

Stores contact form submissions from all Monynha projects.

```sql
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  project TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  project_source TEXT NOT NULL DEFAULT 'portfolio',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX leads_email_idx ON public.leads(email);
CREATE INDEX leads_created_at_idx ON public.leads(created_at DESC);
CREATE INDEX leads_project_source_idx ON public.leads(project_source);

-- RLS Policies
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON public.leads
  FOR SELECT TO authenticated USING (true);
```

**Field Descriptions:**
- `id` - Unique identifier (auto-generated UUID)
- `name` - Contact's full name
- `email` - Contact's email address
- `company` - Company name (optional, defaults to empty string)
- `project` - Project interest (optional, defaults to empty string)
- `message` - Contact message
- `project_source` - Identifies which Monynha project submitted the lead (e.g., 'portfolio')
- `created_at` - Timestamp of submission

### `portfolio` Schema

Currently empty. Future tables will be added here for:
- Project metadata (views, likes, etc.)
- Artwork data
- Series information
- User preferences specific to portfolio

## Usage in Code

### Client Initialization

The Supabase client is initialized in `src/lib/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseSchema = import.meta.env.VITE_SUPABASE_SCHEMA;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: supabaseSchema || 'public',
      },
    })
  : undefined;

// Export the schema for use in queries
export const SUPABASE_SCHEMA = supabaseSchema || 'public';
```

**Important**: The client can be `undefined` if credentials are missing!

### Submitting Contact Leads

Use the `submitContactLead` function from `src/lib/contactLead.ts`:

```typescript
import { submitContactLead } from '@/lib/contactLead';
import { supabase } from '@/lib/supabaseClient';

const result = await submitContactLead(
  supabase,
  {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    project: 'Website Redesign',
    message: 'Interested in working together'
  },
  async (payload, reason) => {
    // Fallback function called if Supabase fails
    // Send email, log to console, etc.
  }
);

// result is either 'saved' or 'emailed'
```

**How it works:**
1. Tries to save to Supabase (`public.leads` table)
2. Automatically adds `project_source: 'portfolio'`
3. If Supabase fails, calls the fallback function
4. Returns `'saved'` if persisted, `'emailed'` if fallback used

### Querying Data

```typescript
// Get all portfolio leads
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('project_source', 'portfolio')
  .order('created_at', { ascending: false });

// Get leads from last 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('project_source', 'portfolio')
  .gte('created_at', sevenDaysAgo.toISOString());

// Count total leads
const { count, error } = await supabase
  .from('leads')
  .select('*', { count: 'exact', head: true })
  .eq('project_source', 'portfolio');
```

### Using Project-Specific Tables (Future)

When you add tables to the `portfolio` schema:

```typescript
// Query portfolio-specific table
const { data, error } = await supabase
  .from('portfolio.project_metadata')
  .select('*')
  .eq('slug', 'my-project');
```

## Migrations

### Current Migrations

1. **`20251023095136_create_leads_table.sql`**
   - Creates `public.leads` table
   - Sets up indexes and RLS policies

2. **`20251023095521_create_portfolio_schema.sql`**
   - Creates `portfolio` schema
   - Grants permissions

3. **`20251023095745_document_schema_strategy.sql`**
   - Adds `project_source` column
   - Documents schema usage

### Creating New Migrations

If using Supabase CLI:

```bash
# Create a new migration
supabase migration new add_project_metadata_table

# Edit the generated file in supabase/migrations/
# Then push to remote
supabase db push
```

If using Supabase Dashboard:
1. Go to **SQL Editor**
2. Write your migration SQL
3. Run it
4. Export the migration (Settings → Database → Migrations)

## Testing

### Unit Tests

Tests are in `src/lib/contactLead.test.ts` using Vitest:

```bash
npm run test
```

**Key test scenarios:**
- ✅ Normalizes and trims input data
- ✅ Saves successfully when Supabase is available
- ✅ Calls fallback when Supabase fails
- ✅ Handles missing Supabase client gracefully
- ✅ Includes `project_source` in all submissions

### Manual Testing

Test the contact form locally:

```bash
# Start dev server
npm run dev

# Navigate to http://localhost:8080/contact
# Fill out and submit the form
# Check Supabase dashboard for the new lead
```

Verify in Supabase Dashboard:
1. Go to **Table Editor**
2. Select `public.leads`
3. Filter by `project_source = 'portfolio'`

## Troubleshooting

### "Supabase credentials are not defined"

**Symptom**: Console warning in development mode

**Solution**:
1. Check `.env` file exists in project root
2. Verify environment variable names:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
   - `VITE_SUPABASE_SCHEMA`
3. Restart dev server after adding `.env`

### "Failed to save lead"

**Symptom**: Contact form shows error after submission

**Possible causes:**
1. **RLS Policy Issue**: Ensure anonymous inserts are allowed
2. **Network Issue**: Check Supabase project status
3. **Invalid Data**: Check browser console for validation errors

**Debug steps:**
```typescript
// Add logging in src/pages/Contact.tsx
console.log('Supabase client:', supabase);
console.log('Form data:', formData);
```

### "Cannot read properties of undefined"

**Symptom**: TypeScript error when using `supabase`

**Solution**: Always check if client exists before using:

```typescript
if (!supabase) {
  console.error('Supabase client not initialized');
  return;
}

const { data, error } = await supabase.from('leads').select('*');
```

### RLS Policy Testing

Test policies using SQL in Supabase Dashboard:

```sql
-- Test as anonymous user (should work)
SET ROLE anon;
INSERT INTO public.leads (name, email, message, project_source)
VALUES ('Test', 'test@example.com', 'Test message', 'portfolio');

-- Test as authenticated user (should work)
SET ROLE authenticated;
SELECT * FROM public.leads WHERE project_source = 'portfolio';

-- Reset role
RESET ROLE;
```

## Best Practices

### 1. Always Handle Missing Client

```typescript
import { supabase } from '@/lib/supabaseClient';

if (!supabase) {
  // Fallback behavior
  return;
}

// Use supabase
```

### 2. Use Type-Safe Interfaces

```typescript
import type { Database } from '@/types/supabase'; // Generate with CLI

const { data } = await supabase
  .from('leads')
  .select('*')
  .returns<Database['public']['Tables']['leads']['Row'][]>();
```

### 3. Include project_source

When inserting into shared tables:

```typescript
const { error } = await supabase
  .from('leads')
  .insert({
    ...leadData,
    project_source: 'portfolio' // Always include!
  });
```

### 4. Filter by project_source

When querying shared tables:

```typescript
const { data } = await supabase
  .from('leads')
  .select('*')
  .eq('project_source', 'portfolio'); // Filter to this project only
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Questions?

If you encounter issues not covered here:
1. Check the [Supabase Discord](https://discord.supabase.com)
2. Review `src/lib/contactLead.ts` for implementation details
3. Check `src/lib/contactLead.test.ts` for usage examples
