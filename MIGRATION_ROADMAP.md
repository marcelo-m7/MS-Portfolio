# Database Migration Roadmap

**Project:** MS-Portfolio → Supabase Database Migration  
**Current Phase:** Phase 2 Complete ✅  
**Next Phase:** Phase 3 - API Layer

---

## Phase Overview

### ✅ Phase 1: Schema Creation (COMPLETE)
**Duration:** Completed October 23, 2025  
**Status:** 100% Complete

- [x] Audit cv.json data structure (342 lines, 8 data types)
- [x] Design normalized database schema (15 tables)
- [x] Create 6 migration files in `supabase/migrations/`
- [x] Apply migrations to Supabase database
- [x] Test with sample data (project, artwork, thought, series)
- [x] Document schema in SUPABASE.md
- [x] Update copilot instructions

**Output:**
- ✅ 15 tables created in `portfolio` schema
- ✅ All RLS policies enabled
- ✅ 25+ indexes created
- ✅ Foreign key constraints established
- ✅ Sample data validated

---

### ✅ Phase 2: Data Population (COMPLETE)
**Duration:** Completed October 23, 2025  
**Status:** 100% Complete

- [x] Generate TypeScript types from database schema
- [x] Update supabaseClient.ts with type-safe client
- [x] Parse cv.json data (8 data types)
- [x] Create 7 seed migration files
- [x] Apply all seed migrations to database
- [x] Verify data integrity (all counts match)
- [x] Clean up Phase 1 test data

**Output:**
- ✅ 7 seed migrations created (`20251023100001-7`)
- ✅ 1 profile, 1 contact inserted
- ✅ 22 technologies, 10 projects, 30 project-tech links
- ✅ 1 artwork, 2 media files, 3 materials
- ✅ 1 series, 2 series works
- ✅ 2 thoughts, 6 thought tags
- ✅ 2 experience entries, 7 highlights
- ✅ 8 skills inserted
- ✅ All foreign key relationships validated
- ✅ Type-safe Database interface (723 lines)

---

## 📋 Phase 3: API Layer & Query Helpers

**Goal:** Create automated script to migrate all data from cv.json to Supabase database

**Estimated Duration:** 2-3 hours

### Tasks Breakdown

#### 2.1 Create Migration Script Structure
**Priority:** High  
**File:** `scripts/populate-database.ts`

```typescript
// Structure:
// 1. Parse cv.json
// 2. Connect to Supabase
// 3. Insert data in correct order (respecting foreign keys)
// 4. Verify insertions
// 5. Generate migration report
```

**Dependencies to install:**
```bash
npm install --save-dev tsx
```

**Order of insertion (important for foreign keys):**
1. profile (singleton)
2. contact (singleton)
3. technologies (referenced by project_stack)
4. projects (referenced by project_stack, series_works)
5. project_stack (links projects ↔ technologies)
6. artworks (referenced by series_works, artwork_media, artwork_materials)
7. artwork_media
8. artwork_materials
9. series
10. series_works
11. thoughts (referenced by thought_tags)
12. thought_tags
13. experience (referenced by experience_highlights)
14. experience_highlights
15. skills

#### 2.2 Handle Data Transformations
**Priority:** High

Transformations needed:
- ✅ Arrays → separate table rows (stack[], media[], materials[], tags[], highlights[])
- ✅ Date strings → PostgreSQL DATE format
- ✅ Slug generation/validation
- ✅ Display order assignment (for ordered lists)

#### 2.3 Dry Run & Validation
**Priority:** Medium

- [ ] Create `--dry-run` flag to test without inserting
- [ ] Validate all slugs are unique
- [ ] Check for missing required fields
- [ ] Verify foreign key references exist

#### 2.4 Error Handling
**Priority:** High

- [ ] Transaction support (rollback on error)
- [ ] Detailed error logging
- [ ] Skip already-inserted records (idempotency)
- [ ] Generate success/failure report

#### 2.5 Execute Migration
**Priority:** High

```bash
npm run populate-db
# or with dry run:
npm run populate-db -- --dry-run
```

**Expected Output:**
```
✅ Inserted 1 profile
✅ Inserted 1 contact
✅ Inserted 12 technologies
✅ Inserted 8 projects
✅ Linked 35 project-technology relationships
✅ Inserted 1 artwork with 2 media and 3 materials
✅ Inserted 1 series with 2 works
✅ Inserted 2 thoughts with 7 tags
✅ Inserted 2 experience entries with 8 highlights
✅ Inserted 8 skills

Database population complete! ✅
```

---

## 📋 Phase 3: API Layer & Type Definitions

**Goal:** Create React hooks and type-safe API layer for database queries

**Estimated Duration:** 3-4 hours

### Tasks Breakdown

#### 3.1 Generate TypeScript Types
**Priority:** High  
**File:** `src/types/database.types.ts`

Options:
1. **Manual typing** (based on schema)
2. **Supabase CLI auto-generation:**
   ```bash
   npx supabase gen types typescript --project-id pkjigvacvddcnlxhvvba > src/types/database.types.ts
   ```

#### 3.2 Create Supabase Hooks
**Priority:** High  
**Location:** `src/hooks/useDatabase.ts`

Hooks to create:
- `useProjects()` - Fetch all projects with stack
- `useProjectBySlug(slug)` - Fetch single project
- `useArtworks()` - Fetch all artworks with media/materials
- `useArtworkBySlug(slug)` - Fetch single artwork
- `useSeries()` - Fetch all series
- `useSeriesBySlug(slug)` - Fetch series with works
- `useThoughts()` - Fetch all thoughts with tags
- `useThoughtBySlug(slug)` - Fetch single thought
- `useExperience()` - Fetch work history with highlights
- `useSkills()` - Fetch skills by category
- `useProfile()` - Fetch profile (singleton)

#### 3.3 React Query Integration
**Priority:** Medium  
**Dependencies:**
```bash
npm install @tanstack/react-query
```

Features:
- Caching with stale-while-revalidate
- Automatic refetching
- Loading states
- Error handling
- Optimistic updates (for future CMS)

#### 3.4 Fallback Strategy
**Priority:** High

Graceful degradation if Supabase unavailable:
```typescript
// Try database first, fall back to cv.json
const { data: projects, isLoading, error } = useProjects();

if (error) {
  // Fall back to cv.json
  const fallbackProjects = cvData.projects;
}
```

---

## 📋 Phase 4: Frontend Refactoring

**Goal:** Update all pages to fetch from database instead of cv.json

**Estimated Duration:** 4-5 hours

### Priority Order

#### 4.1 Refactor Project Pages (HIGH)
**Files:**
- `src/pages/Portfolio.tsx` - List all projects
- `src/pages/ProjectDetail.tsx` - Single project view
- `src/pages/Home.tsx` - Featured projects section

**Changes:**
```typescript
// Before:
import cvData from '../../public/data/cv.json';
const projects = cvData.projects;

// After:
import { useProjects } from '@/hooks/useDatabase';
const { data: projects, isLoading, error } = useProjects();
```

#### 4.2 Refactor Thoughts Pages (HIGH)
**Files:**
- `src/pages/Thoughts.tsx` - List all thoughts
- `src/pages/ThoughtDetail.tsx` - Single thought view

#### 4.3 Refactor About Page (MEDIUM)
**Files:**
- `src/pages/About.tsx` - Experience & skills

#### 4.4 Refactor Art Pages (MEDIUM)
**Files:**
- `src/pages/Portfolio.tsx` - Artworks section
- `src/pages/ArtDetail.tsx` - Single artwork view
- `src/pages/SeriesDetail.tsx` - Series with works

#### 4.5 Update Components (LOW)
**Files:**
- `src/components/ProjectCard.tsx`
- `src/components/ArtworkCard.tsx`
- `src/components/SeriesCard.tsx`

#### 4.6 Keep cv.json as Fallback
**Priority:** HIGH

⚠️ **Important:** Do NOT delete cv.json! Keep it as backup and fallback.

```typescript
// Fallback pattern:
const { data, isLoading, error } = useProjects();
const projects = data || cvData.projects; // Fallback
```

---

## 📋 Phase 5: CMS & Analytics (Future)

**Goal:** Enable content management and analytics tracking

**Estimated Duration:** 1-2 weeks

### Features to Add

#### 5.1 Authentication
- [ ] Supabase Auth integration
- [ ] Admin role management
- [ ] Protected routes for admin panel

#### 5.2 Admin Panel
- [ ] CRUD operations for all content types
- [ ] Image upload (Supabase Storage)
- [ ] Rich text editor for descriptions
- [ ] Preview before publish
- [ ] Slug auto-generation

#### 5.3 Analytics
- [ ] Page views counter (per project/artwork/thought)
- [ ] Likes/favorites system
- [ ] Popular content sorting
- [ ] Analytics dashboard

#### 5.4 Advanced Features
- [ ] Multi-language content management
- [ ] Content versioning/history
- [ ] Draft/published status
- [ ] Scheduled publishing
- [ ] Content search (PostgreSQL full-text)
- [ ] Real-time updates (Supabase Realtime)

---

## Recommended Next Actions

### Immediate (This Week)

1. **Create data population script** (Phase 2)
   ```bash
   # Create script file
   mkdir -p scripts
   touch scripts/populate-database.ts
   ```

2. **Test with staging data first**
   - Use sample data in test migration
   - Verify all relationships work
   - Check for data integrity issues

3. **Generate TypeScript types** (Phase 3.1)
   ```bash
   npx supabase gen types typescript --project-id pkjigvacvddcnlxhvvba > src/types/database.types.ts
   ```

### Short Term (Next 2 Weeks)

4. **Create API hooks** (Phase 3.2-3.3)
   - Start with most-used queries (projects, thoughts)
   - Add React Query for caching
   - Test loading states and errors

5. **Refactor one page at a time** (Phase 4)
   - Start with Portfolio page (high traffic)
   - Keep cv.json fallback enabled
   - Monitor for issues in production

### Long Term (Next Month+)

6. **Build admin panel** (Phase 5)
   - Authentication first
   - CRUD for projects/artworks
   - Extend to other content types

---

## Risk Mitigation

### Risks & Solutions

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Data loss during migration** | HIGH | Keep cv.json as backup, test on staging first |
| **Database queries too slow** | MEDIUM | Indexes already created, use React Query caching |
| **Supabase downtime** | MEDIUM | Fallback to cv.json, show cached data |
| **Breaking changes in frontend** | HIGH | Refactor one page at a time, keep fallback |
| **Missing data in database** | MEDIUM | Validation script before population |

### Rollback Plan

If issues occur after deployment:
1. Revert frontend to cv.json
2. Investigate database issues
3. Fix data/queries
4. Re-deploy when stable

---

## Success Metrics

### Phase 2 Success Criteria
- ✅ All cv.json data inserted into database
- ✅ No foreign key constraint errors
- ✅ All queries return expected data structure
- ✅ Migration report shows 100% success rate

### Phase 3 Success Criteria
- ✅ All hooks return properly typed data
- ✅ Loading states work correctly
- ✅ Error handling graceful
- ✅ Fallback to cv.json works

### Phase 4 Success Criteria
- ✅ All pages render correctly with database data
- ✅ No broken links or 404s
- ✅ Performance same or better than cv.json
- ✅ SEO not negatively affected

### Phase 5 Success Criteria
- ✅ Admin can manage content without code changes
- ✅ Analytics tracking working
- ✅ Real-time updates functional
- ✅ Content versioning enabled

---

## Timeline Estimate

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Phase 1: Schema | ✅ Complete | Oct 23 | Oct 23 |
| Phase 2: Population | 2-3 hours | TBD | TBD |
| Phase 3: API Layer | 3-4 hours | TBD | TBD |
| Phase 4: Frontend | 4-5 hours | TBD | TBD |
| Phase 5: CMS | 1-2 weeks | TBD | TBD |

**Total estimated time to production:** 2-3 days (Phases 2-4)  
**Total estimated time with CMS:** 2-3 weeks (Phases 2-5)

---

## Questions to Decide

Before proceeding to Phase 2, decide:

1. **Data population approach:**
   - [ ] One-time migration script?
   - [ ] Incremental migration (manual entry)?
   - [ ] Keep both cv.json and DB in sync initially?

2. **Deployment strategy:**
   - [ ] Deploy all phases at once?
   - [ ] Deploy phase by phase?
   - [ ] Feature flag for database vs cv.json?

3. **Content management:**
   - [ ] Start CMS immediately after migration?
   - [ ] Continue using cv.json + manual sync?
   - [ ] Wait for Phase 5?

4. **Analytics requirements:**
   - [ ] Track immediately (Phase 2)?
   - [ ] Add later (Phase 5)?
   - [ ] Third-party analytics only?

---

**Next Step:** Create `scripts/populate-database.ts` for Phase 2 🚀

**Would you like me to:**
- A) Create the data population script (Phase 2)?
- B) Generate TypeScript types first (Phase 3.1)?
- C) Create a simple example hook to test the pattern?
- D) Something else?
