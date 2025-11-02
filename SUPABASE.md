# Supabase Integration Guide

This document explains how to connect to and use Supabase in the MS-Portfolio project.

## Table of Contents

- [Overview](#overview)
- [Database Schema Strategy](#database-schema-strategy)
- [Setup & Configuration](#setup--configuration)
- [Database Schema](#database-schema)
- [Usage in Code](#usage-in-code)
- [Migrations](#migrations)
- [Data Population & Verification](#data-population--verification)
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

Contains tables specific to MS-Portfolio (created via migrations in this repo):

- `profile` (singleton)
- `contact` (singleton)
- `technologies`
- `projects`, `project_stack`
- `artworks`, `artwork_media`, `artwork_materials`
- `series`, `series_works`
- `thoughts`, `thought_tags`
- `experience`, `experience_highlights`, `skills`

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

Migrations are applied automatically with the CLI. To run locally:

```bash
# Start local stack and apply migrations
npx supabase start
```

To apply to a cloud project:

```bash
# Login and link to your Supabase project (one-time)
supabase login
supabase link --project-ref <your-project-ref>

# Push all local migrations to the linked project
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

The `portfolio` schema contains project-specific tables for MS-Portfolio content. All tables have RLS enabled with public read access.

#### Tables Overview

- **`profile`** - Portfolio owner profile (singleton)
- **`contact`** - Contact page configuration (singleton)
- **`technologies`** - Normalized technology names
- **`projects`** - Portfolio projects
- **`project_stack`** - Many-to-many: projects ↔ technologies
- **`artworks`** - Digital artworks and 3D experiences
- **`artwork_media`** - Media URLs for artworks (ordered)
- **`artwork_materials`** - Materials/techniques (ordered)
- **`series`** - Collections grouping related works
- **`series_works`** - Works in series (references slugs)
- **`thoughts`** - Blog posts/reflections
- **`thought_tags`** - Tags for thoughts
- **`experience`** - Work history
- **`experience_highlights`** - Key achievements (ordered)
- **`skills`** - Skills inventory

#### Schema Details

<details>
<summary><b>profile</b> (singleton)</summary>

```sql
CREATE TABLE portfolio.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  headline TEXT NOT NULL,
  location TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar TEXT,
  lang_default TEXT DEFAULT 'pt',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Usage:**

```sql
-- Insert or update profile (singleton pattern)
INSERT INTO portfolio.profile (name, headline, location, bio, avatar)
VALUES ('Marcelo Santos', 'Software Engineer & Founder', 'Portugal', 'Bio text...', '/avatar.jpg')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  headline = EXCLUDED.headline,
  updated_at = NOW();

-- Retrieve profile
SELECT * FROM portfolio.profile LIMIT 1;
```

</details>

<details>
<summary><b>projects</b> + <b>project_stack</b> + <b>technologies</b></summary>

```sql
CREATE TABLE portfolio.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_description TEXT NOT NULL,
  url TEXT,
  domain TEXT,
  repo_url TEXT,
  thumbnail TEXT,
  category TEXT NOT NULL,
  status TEXT,
  visibility TEXT,
  year INTEGER NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio.technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio.project_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES portfolio.projects(id) ON DELETE CASCADE,
  technology_id UUID NOT NULL REFERENCES portfolio.technologies(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, technology_id)
);
```

**Indexes:**

- `idx_projects_slug` (unique)
- `idx_projects_category`
- `idx_projects_year`
- `idx_projects_display_order`

**Usage:**

```sql
-- Get project with tech stack
SELECT 
  p.slug, p.name, p.category, p.year,
  json_agg(
    json_build_object('name', t.name, 'category', t.category)
    ORDER BY ps.display_order
  ) as stack
FROM portfolio.projects p
LEFT JOIN portfolio.project_stack ps ON p.id = ps.project_id
LEFT JOIN portfolio.technologies t ON ps.technology_id = t.id
WHERE p.slug = 'boteco-pro'
GROUP BY p.id;

-- List all projects
SELECT slug, name, category, year, status 
FROM portfolio.projects 
ORDER BY display_order, year DESC;
```

</details>

<details>
<summary><b>artworks</b> + <b>artwork_media</b> + <b>artwork_materials</b></summary>

```sql
CREATE TABLE portfolio.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  description TEXT NOT NULL,
  url_3d TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio.artwork_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID NOT NULL REFERENCES portfolio.artworks(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio.artwork_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID NOT NULL REFERENCES portfolio.artworks(id) ON DELETE CASCADE,
  material TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Usage:**

```sql
-- Get artwork with media and materials
SELECT 
  a.slug, a.title, a.year, a.url_3d,
  (SELECT json_agg(media_url ORDER BY display_order) 
   FROM portfolio.artwork_media WHERE artwork_id = a.id) as media,
  (SELECT json_agg(material ORDER BY display_order) 
   FROM portfolio.artwork_materials WHERE artwork_id = a.id) as materials
FROM portfolio.artworks a
WHERE a.slug = 'artleo';
```

</details>

<details>
<summary><b>series</b> + <b>series_works</b></summary>

```sql
CREATE TABLE portfolio.series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio.series_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES portfolio.series(id) ON DELETE CASCADE,
  work_slug TEXT NOT NULL,
  work_type TEXT NOT NULL CHECK (work_type IN ('project', 'artwork')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(series_id, work_slug)
);
```

**Usage:**

```sql
-- Get series with works (resolve slugs in application)
SELECT 
  s.slug, s.title, s.year,
  json_agg(
    json_build_object('slug', sw.work_slug, 'type', sw.work_type)
    ORDER BY sw.display_order
  ) as works
FROM portfolio.series s
LEFT JOIN portfolio.series_works sw ON s.id = sw.series_id
WHERE s.slug = 'creative-systems'
GROUP BY s.id;
```

</details>

<details>
<summary><b>thoughts</b> + <b>thought_tags</b></summary>

```sql
CREATE TABLE portfolio.thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  date DATE NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio.thought_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thought_id UUID NOT NULL REFERENCES portfolio.thoughts(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(thought_id, tag)
);
```

**Usage:**

```sql
-- Get thought with tags
SELECT 
  t.slug, t.title, t.excerpt, t.date,
  json_agg(tt.tag ORDER BY tt.tag) as tags
FROM portfolio.thoughts t
LEFT JOIN portfolio.thought_tags tt ON t.id = tt.thought_id
WHERE t.slug = 'design-patterns-react-2024'
GROUP BY t.id;

-- List recent thoughts
SELECT slug, title, excerpt, date
FROM portfolio.thoughts
ORDER BY date DESC
LIMIT 10;
```

</details>

<details>
<summary><b>experience</b> + <b>experience_highlights</b></summary>

```sql
CREATE TABLE portfolio.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  org TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  location TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio.experience_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES portfolio.experience(id) ON DELETE CASCADE,
  highlight TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Usage:**

```sql
-- Get experience with highlights
SELECT 
  e.role, e.org, e.start_date, e.end_date, e.location,
  json_agg(eh.highlight ORDER BY eh.display_order) as highlights
FROM portfolio.experience e
LEFT JOIN portfolio.experience_highlights eh ON e.id = eh.experience_id
GROUP BY e.id
ORDER BY e.display_order;
```

</details>

<details>
<summary><b>skills</b></summary>

```sql
CREATE TABLE portfolio.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Usage:**

```sql
-- Get skills by category
SELECT category, json_agg(json_build_object('name', name, 'level', level) ORDER BY display_order) as skills
FROM portfolio.skills
GROUP BY category
ORDER BY category;
```

</details>
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

This repository tracks the `portfolio` schema migrations used by the app. Shared resources like `public.leads` may be created and managed centrally outside this repo.

0. **`20251023000000_create_portfolio_schema.sql`**
  - Creates the `portfolio` schema
  - Grants base usage/select defaults to `anon`/`authenticated`

1. **`20251023000001_create_core_tables.sql`**
   - Creates `profile` table (singleton)
   - Creates `contact` table (singleton)
   - Creates `technologies` table (normalized)
   - Creates `update_updated_at_column()` trigger function
   - Sets up RLS policies and indexes

2. **`20251023000002_create_projects.sql`**
   - Creates `projects` table
   - Creates `project_stack` junction table
   - Links projects to technologies (many-to-many)
   - Indexes on slug, category, year, display_order

3. **`20251023000003_create_artworks.sql`**
   - Creates `artworks` table
   - Creates `artwork_media` table (ordered media URLs)
   - Creates `artwork_materials` table (ordered materials list)
   - Cascade deletes on artwork removal

4. **`20251023000004_create_series.sql`**
   - Creates `series` table (collections)
   - Creates `series_works` table (references work slugs)
   - Supports project + artwork references

5. **`20251023000005_create_thoughts.sql`**
   - Creates `thoughts` table (blog posts)
   - Creates `thought_tags` table (many-to-many)
   - Index on date for chronological queries

6. **`20251023000006_create_experience_skills.sql`**
   - Creates `experience` table (work history)
   - Creates `experience_highlights` table (ordered list)
   - Creates `skills` table with level constraints

7. **`20251102000007_seed_profile_experience_skills.sql`**
   - Seeds initial profile, experience, and skills

8. **`20251102000008_fix_url_references.sql`**
   - Fixes URL/domain reference fields

9. **`20251102000009_seed_technologies.sql`**
   - Seeds 26 normalized technologies

10. **`20251102000010_seed_projects.sql`**
  - Seeds 12 projects and ~40 `project_stack` rows

11. **`20251102000011_seed_contact.sql`**
  - Seeds contact singleton row

12. **`20251102000012_seed_series_artworks.sql`**
  - Placeholder for series/artworks seed (currently empty)

13. **`20251102000013_seed_thoughts.sql`**
  - Placeholder for thoughts seed (currently empty)

### Migration Files Location

All migrations are stored in:

```text
supabase/migrations/
├── 20251023000000_create_portfolio_schema.sql
├── 20251023000001_create_core_tables.sql
├── 20251023000002_create_projects.sql
├── 20251023000003_create_artworks.sql
├── 20251023000004_create_series.sql
├── 20251023000005_create_thoughts.sql
├── 20251023000006_create_experience_skills.sql
├── 20251102000007_seed_profile_experience_skills.sql
├── 20251102000008_fix_url_references.sql
├── 20251102000009_seed_technologies.sql
├── 20251102000010_seed_projects.sql
├── 20251102000011_seed_contact.sql
├── 20251102000012_seed_series_artworks.sql
└── 20251102000013_seed_thoughts.sql
```

### Creating New Migrations

If using Supabase CLI:

```bash
# Create a new migration
supabase migration new add_project_analytics

# Edit the generated file in supabase/migrations/
# Then push to remote
supabase db push
```

If using Supabase Dashboard:

1. Go to **SQL Editor**
2. Write your migration SQL
3. Run it
4. Export the migration (Settings → Database → Migrations)

### Data Migration Strategy

**Current State:** Portfolio data lives in `public/data/cv.json` (static JSON file)

**Future State:** Data will be migrated to portfolio schema tables

**Migration Plan:**

1. ✅ **Phase 1 (Complete)**: Create database schema
2. **Phase 2**: Create migration scripts to populate DB from cv.json
3. **Phase 3**: Create API layer (Supabase client hooks)
4. **Phase 4**: Refactor pages to fetch from DB instead of cv.json
5. **Phase 5**: Add CMS/admin interface for content management

**Benefits of Migration:**

- Real-time updates without redeployment
- Add analytics (views, likes, shares)
- Search and filtering on server side
- Content management without code changes
- Multi-language support via DB

## Testing

## Data Population & Verification

Seed migrations are included for initial data:

- Technologies: 26 rows
- Projects: 12 rows + ~40 project_stack links
- Contact: 1 singleton row
- Series/Artworks/Thoughts: placeholders exist (to be populated)

### Verify via SQL (Dashboard → SQL Editor)

```sql
-- Basic counts
SELECT
  (SELECT count(*) FROM portfolio.technologies)      AS technologies,
  (SELECT count(*) FROM portfolio.projects)          AS projects,
  (SELECT count(*) FROM portfolio.project_stack)     AS project_stack,
  (SELECT count(*) FROM portfolio.contact)           AS contact;

-- Spot-check a project with its stack
SELECT p.slug, p.name,
  json_agg(t.name ORDER BY ps.display_order) AS stack
FROM portfolio.projects p
LEFT JOIN portfolio.project_stack ps ON ps.project_id = p.id
LEFT JOIN portfolio.technologies t ON t.id = ps.technology_id
WHERE p.slug = 'boteco-pro'
GROUP BY p.id;
```

### Verify via REST (local dev)

When using the local REST API for the `portfolio` schema, include the `Accept-Profile: portfolio` header.

Example fetch headers:

```ts
const headers = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  'Accept-Profile': 'portfolio',
  Prefer: 'count=exact',
};
```

Then call `GET http://127.0.0.1:54321/rest/v1/technologies?select=id` and count the array length.

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
