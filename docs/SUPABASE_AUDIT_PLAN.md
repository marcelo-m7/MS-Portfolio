# Supabase Setup Audit & Action Plan

**Date**: November 2, 2025  
**Project**: MS-Portfolio  
**Database**: Supabase PostgreSQL with `portfolio` schema  
**Status**: 🟡 Partially Complete - Requires Seeding

---

## Executive Summary

The Supabase infrastructure is **structurally complete** with all 15 tables created and properly configured. However, **data seeding is incomplete** — only profile, experience, and skills have been populated. The frontend currently falls back to `cv.json` for all content because the database tables are empty.

### Current State
- ✅ **Schema**: `portfolio` schema created with 15 tables
- ✅ **Migrations**: 8 migration files applied
- ✅ **RLS Policies**: Enabled with public read access
- ✅ **Client Configuration**: Properly configured with schema option
- ✅ **Type Safety**: Database types generated
- 🟡 **Seeding**: Only 3 of 15 tables have data (profile, experience, skills)
- ❌ **Data Migration**: No data seeded for projects, artworks, series, thoughts, etc.

---

## Database Schema Overview

### Architecture
- **Primary Schema**: `portfolio` (project-specific data)
- **Shared Schema**: `public` (cross-project data like leads)
- **Total Tables**: 15 in `portfolio` schema + 1 in `public` schema

### Table Inventory

| Table | Purpose | Seeded? | Priority |
|-------|---------|---------|----------|
| `profile` | User profile (singleton) | ✅ Yes | Critical |
| `contact` | Contact page config (singleton) | ❌ No | High |
| `technologies` | Normalized tech stack | ❌ No | High |
| `projects` | Portfolio projects | ❌ No | **Critical** |
| `project_stack` | Projects ↔ Technologies (M2M) | ❌ No | **Critical** |
| `artworks` | Digital art pieces | ❌ No | High |
| `artwork_media` | Artwork media files | ❌ No | High |
| `artwork_materials` | Artwork materials | ❌ No | Medium |
| `series` | Art/project series | ❌ No | High |
| `series_works` | Series member items | ❌ No | High |
| `thoughts` | Blog posts/thoughts | ❌ No | High |
| `thought_tags` | Thought tags | ❌ No | Medium |
| `experience` | Work experience | ✅ Yes | Critical |
| `experience_highlights` | Experience highlights | ✅ Yes | Critical |
| `skills` | Technical skills | ✅ Yes | High |
| **`public.leads`** | Contact form submissions | N/A | Critical |

---

## Migration Files Status

### Applied Migrations ✅

1. **20251023000001_create_core_tables.sql**
   - Tables: `profile`, `contact`, `technologies`
   - Status: ✅ Applied
   - RLS: ✅ Enabled

2. **20251023000002_create_projects.sql**
   - Tables: `projects`, `project_stack`
   - Status: ✅ Applied
   - RLS: ✅ Enabled

3. **20251023000003_create_artworks.sql**
   - Tables: `artworks`, `artwork_media`, `artwork_materials`
   - Status: ✅ Applied
   - RLS: ✅ Enabled

4. **20251023000004_create_series.sql**
   - Tables: `series`, `series_works`
   - Status: ✅ Applied
   - RLS: ✅ Enabled

5. **20251023000005_create_thoughts.sql**
   - Tables: `thoughts`, `thought_tags`
   - Status: ✅ Applied
   - RLS: ✅ Enabled

6. **20251023000006_create_experience_skills.sql**
   - Tables: `experience`, `experience_highlights`, `skills`
   - Status: ✅ Applied
   - RLS: ✅ Enabled

7. **20251102000007_seed_profile_experience_skills.sql**
   - Seeded: Profile, 5 Experience records with highlights, Skills
   - Status: ✅ Applied
   - Data: ✅ Populated

8. **20251102000008_fix_url_references.sql**
   - Updates: BotecoPro URLs, Infra Hub rename
   - Status: ✅ Applied
   - **Issue**: No data to update (projects table empty!)

---

## Critical Issues

### 🔴 Issue 1: Empty Database Tables

**Problem**: Migration 20251102000008 tries to UPDATE projects but the table is empty.

**Impact**: 
- Frontend falls back to `cv.json` for ALL content
- Supabase integration not being tested in production
- Translation system working with static JSON instead of dynamic DB queries

**Root Cause**: No seed migration created for:
- Projects (11 items in cv.json)
- Artworks (data exists in cv.json)
- Series (data exists in cv.json)
- Thoughts (markdown files in `public/content/blog/`)
- Technologies (extracted from project stack arrays)
- Contact singleton

---

### 🟡 Issue 2: Data Source Mismatch

**Current Behavior**:
```typescript
// useProjects hook
const dbData = await fetchProjects();
if (dbData) return dbData;  // Returns null/[] when empty

// Fallback to cv.json
const cv = await loadCvData();
return cv.projects || [];  // Always used because DB is empty
```

**Expected Behavior**: Database should be primary source, cv.json as emergency fallback only.

---

### 🟡 Issue 3: Markdown Thoughts Not Migrated

**Location**: `public/content/blog/*.md` (3 markdown files)

Files:
- `automacao-ia-acessibilidade.md`
- `design-tecnologia-inclusiva.md`
- `pensamento-open-source.md`

**Issue**: Blog posts exist as markdown but not in `thoughts` table. Frontend uses `markdownLoader.ts` instead of Supabase queries.

---

## Action Plan

### Phase 1: Data Audit & Extraction (30 min)

**Goal**: Extract all content from `cv.json` and markdown files into structured format.

**Tasks**:
1. ✅ Count items in cv.json:
   - Projects: 11 items
   - Artworks: TBD (check cv.json)
   - Series: TBD (check cv.json)
   - Contact singleton: 1 item

2. ✅ List markdown thoughts:
   - 3 blog posts with frontmatter metadata

3. ✅ Extract unique technologies from project stack arrays:
   - Create normalized list for `technologies` table

**Deliverable**: Data inventory spreadsheet

---

### Phase 2: Create Seed Migrations (1-2 hours)

**Goal**: Write SQL migrations to populate all tables with cv.json data.

#### Migration 1: `20251102000009_seed_technologies.sql` ⭐ HIGH PRIORITY

```sql
-- Extract unique technologies from cv.json project stacks
INSERT INTO portfolio.technologies (name, category) VALUES
  ('Supabase', 'Backend'),
  ('Flutter', 'Mobile'),
  ('React', 'Frontend'),
  -- ... (extract all unique from cv.json)
ON CONFLICT (name) DO NOTHING;
```

**Why First**: Projects depend on technologies via FK relationship.

---

#### Migration 2: `20251102000010_seed_projects.sql` ⭐ CRITICAL

```sql
-- Insert all 11 projects from cv.json
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 'botecopro', 'BotecoPro', '...', '...', 'https://app.boteco.pro', 'app.boteco.pro', '...', '/images/botecopro.svg', 'Soluções Empresariais', 'Desenvolvimento', 'Interna', 2025, 10
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'botecopro');

-- Insert project_stack relationships
WITH tech_ids AS (
  SELECT id, name FROM portfolio.technologies WHERE name IN ('Supabase', 'Flutter', 'React')
),
proj AS (
  SELECT id FROM portfolio.projects WHERE slug = 'botecopro'
)
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, tech_ids.id, ROW_NUMBER() OVER () 
FROM proj, tech_ids
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps WHERE ps.project_id = proj.id AND ps.technology_id = tech_ids.id
);
```

**Data Source**: `public/data/cv.json` projects array (11 items)

**Complexity**: Requires JOIN with technologies table for M2M relationship

---

#### Migration 3: `20251102000011_seed_contact.sql` ⭐ HIGH PRIORITY

```sql
-- Singleton contact configuration
INSERT INTO portfolio.contact (email, availability, note, success_message, error_message)
SELECT 'marcelo@monynha.com',
       'Disponível para projetos e colaborações.',
       'Entre em contato e vamos criar algo incrível juntos.',
       'Mensagem enviada com sucesso!',
       'Não foi possível enviar sua mensagem. Tente novamente.'
WHERE NOT EXISTS (SELECT 1 FROM portfolio.contact);
```

**Data Source**: Hardcoded in Contact.tsx (Portuguese defaults)

---

#### Migration 4: `20251102000012_seed_artworks.sql` (if cv.json has artworks)

```sql
-- Insert artworks from cv.json
-- Insert artwork_media
-- Insert artwork_materials
```

**Conditional**: Only if cv.json contains artworks array

---

#### Migration 5: `20251102000013_seed_series.sql` (if cv.json has series)

```sql
-- Insert series from cv.json
-- Insert series_works
```

**Conditional**: Only if cv.json contains series array

---

#### Migration 6: `20251102000014_seed_thoughts.sql` ⭐ MEDIUM PRIORITY

```sql
-- Migrate markdown blog posts to database
INSERT INTO portfolio.thoughts (slug, title, excerpt, body, author, published_date, reading_time_minutes)
VALUES 
  ('design-tecnologia-inclusiva', 
   'Design e Tecnologia Inclusiva',
   'A tecnologia é mais humana quando é feita para todas as pessoas...',
   '<full markdown content>',
   'Marcelo Santos',
   '2025-01-17',
   5);

-- Insert tags
INSERT INTO portfolio.thought_tags (thought_id, tag)
SELECT id, unnest(ARRAY['Acessibilidade', 'Design', 'UX/UI'])
FROM portfolio.thoughts
WHERE slug = 'design-tecnologia-inclusiva';
```

**Data Source**: `public/content/blog/*.md` files (3 posts)

**Challenge**: Must parse markdown frontmatter and body

---

### Phase 3: Validation & Testing (30 min)

**Goal**: Verify data integrity and frontend integration.

**Tasks**:

1. **Query Validation**:
```sql
-- Check row counts
SELECT 
  (SELECT COUNT(*) FROM portfolio.projects) as projects,
  (SELECT COUNT(*) FROM portfolio.technologies) as technologies,
  (SELECT COUNT(*) FROM portfolio.project_stack) as project_stack,
  (SELECT COUNT(*) FROM portfolio.contact) as contact,
  (SELECT COUNT(*) FROM portfolio.thoughts) as thoughts;

-- Expected: projects=11, technologies=~20, project_stack=~40, contact=1, thoughts=3
```

2. **Frontend Testing**:
   - Visit `/portfolio` → Should load projects from DB
   - Visit `/portfolio/botecopro` → Should load project detail from DB
   - Visit `/thoughts` → Should load blog posts from DB
   - Visit `/about` → Should load experience/skills from DB

3. **Fallback Testing**:
   - Temporarily disable Supabase (remove env vars)
   - Verify cv.json fallback still works
   - Re-enable Supabase

---

### Phase 4: Documentation Update (15 min)

**Goal**: Update SUPABASE.md with seeding information.

**Updates**:
1. Document seed migration files
2. Add "Data Population" section
3. Update "Database Schema" with row counts
4. Add "Verifying Setup" queries

---

## Migration Execution Order

```bash
# 1. Technologies (no dependencies)
20251102000009_seed_technologies.sql

# 2. Projects (depends on technologies)
20251102000010_seed_projects.sql

# 3. Contact (singleton, no dependencies)
20251102000011_seed_contact.sql

# 4. Artworks (if exists, no dependencies)
20251102000012_seed_artworks.sql

# 5. Series (if exists, may depend on projects/artworks)
20251102000013_seed_series.sql

# 6. Thoughts (no dependencies, but references markdown files)
20251102000014_seed_thoughts.sql
```

---

## Data Extraction Checklist

### From cv.json:
- [ ] Count projects → Expected: 11
- [ ] Extract unique technologies → Expected: ~20 unique names
- [ ] Check for artworks array → Expected: Yes/No
- [ ] Check for series array → Expected: Yes/No
- [ ] Extract contact info → Expected: 1 singleton

### From Markdown:
- [ ] Count thought posts → Expected: 3
- [ ] Parse frontmatter (title, date, tags, excerpt)
- [ ] Calculate reading time → Expected: 3-5 min each

### Generated Data:
- [ ] project_stack relationships → Expected: ~40 rows (avg 3-4 techs per project)
- [ ] thought_tags relationships → Expected: ~15 tags across 3 posts

---

## Verification Queries

After seeding, run these queries to validate:

```sql
-- 1. Check all table row counts
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables 
WHERE schemaname = 'portfolio'
ORDER BY tablename;

-- 2. Verify project-technology relationships
SELECT 
  p.name as project,
  array_agg(t.name ORDER BY ps.display_order) as technologies
FROM portfolio.projects p
LEFT JOIN portfolio.project_stack ps ON p.id = ps.project_id
LEFT JOIN portfolio.technologies t ON ps.technology_id = t.id
GROUP BY p.name
ORDER BY p.display_order;

-- 3. Check thought tags
SELECT 
  t.title,
  array_agg(tt.tag) as tags
FROM portfolio.thoughts t
LEFT JOIN portfolio.thought_tags tt ON t.id = tt.thought_id
GROUP BY t.title;

-- 4. Verify singletons
SELECT COUNT(*) as count, 'profile' as table FROM portfolio.profile
UNION ALL
SELECT COUNT(*), 'contact' FROM portfolio.contact;
-- Expected: 1 row each
```

---

## Estimated Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Data Audit | 30 min | 🔴 Critical |
| Seed Technologies | 20 min | ⭐ High |
| Seed Projects | 45 min | ⭐ High |
| Seed Contact | 10 min | ⭐ High |
| Seed Artworks/Series | 30 min | 🟡 Medium |
| Seed Thoughts | 30 min | 🟡 Medium |
| Validation & Testing | 30 min | 🔴 Critical |
| Documentation | 15 min | 🟢 Low |
| **Total** | **3-4 hours** | - |

---

## Success Criteria

✅ **Phase 1 Complete** when:
- All cv.json content counted and documented
- Unique technologies list extracted
- Markdown thoughts inventoried

✅ **Phase 2 Complete** when:
- All seed migrations created and formatted
- SQL tested locally (syntax check)
- Migration files committed to repo

✅ **Phase 3 Complete** when:
- All tables have expected row counts
- Frontend loads DB data (not cv.json fallback)
- Supabase dashboard shows populated tables

✅ **Phase 4 Complete** when:
- SUPABASE.md updated with seed info
- Verification queries documented
- README references updated docs

---

## Risks & Mitigation

### Risk 1: Data Type Mismatches
**Mitigation**: Use `CAST()` and type-safe inserts, validate with TypeScript types

### Risk 2: Duplicate Inserts
**Mitigation**: Use `WHERE NOT EXISTS` pattern for idempotency

### Risk 3: Missing FK References
**Mitigation**: Seed technologies BEFORE projects, verify with FK constraint tests

### Risk 4: Markdown Parsing Complexity
**Mitigation**: Start with simple frontmatter, iterate if needed

---

## Next Steps

### Immediate Actions (TODAY):
1. ✅ Read cv.json and count all data sections
2. ✅ Extract unique technology list
3. 🔲 Create migration 20251102000009_seed_technologies.sql
4. 🔲 Create migration 20251102000010_seed_projects.sql
5. 🔲 Apply migrations to Supabase
6. 🔲 Test frontend with populated DB

### Follow-up Actions (NEXT SESSION):
1. 🔲 Seed artworks/series if data exists
2. 🔲 Migrate markdown thoughts to DB
3. 🔲 Update documentation
4. 🔲 Deploy to production

---

## Questions to Answer

1. **Does cv.json contain artworks array?** → Check file
2. **Does cv.json contain series array?** → Check file
3. **Should we keep markdown files or migrate entirely to DB?** → Decision needed
4. **What's the priority: Projects or Thoughts?** → Projects (higher visibility)

---

## Contact for Issues

- **GitHub Issues**: [MS-Portfolio Repository](https://github.com/marcelo-m7/MS-Portfolio)
- **Supabase Dashboard**: Check table schema in Settings → Database
- **Migration Logs**: Check Supabase logs for migration errors

---

**Status Legend**:
- 🔴 Critical - Blocks core functionality
- ⭐ High - Important for user experience
- 🟡 Medium - Nice to have
- 🟢 Low - Documentation/polish
- ✅ Complete - Task finished
- 🔲 Pending - Not started
