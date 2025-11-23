-- Create portfolio schema and base privileges
-- Created: 2025-10-23 (placed before other migrations by timestamp)

-- Ensure schema exists
CREATE SCHEMA IF NOT EXISTS portfolio;
COMMENT ON SCHEMA portfolio IS 'Application-specific schema for MS-Portfolio';

-- Grant basic usage to Supabase roles
GRANT USAGE ON SCHEMA portfolio TO postgres, anon, authenticated, service_role;

-- Set default privileges so future tables/sequences are readable by anon/authenticated (RLS still applies)
ALTER DEFAULT PRIVILEGES IN SCHEMA portfolio GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA portfolio GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;
