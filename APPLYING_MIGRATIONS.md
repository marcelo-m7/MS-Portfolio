# Applying Seed Migrations - Quick Guide

**Date**: November 2, 2025  
**Purpose**: Populate Supabase database with portfolio content

---

## Migration Files Created

✅ **20251102000009_seed_technologies.sql** - 26 technologies  
✅ **20251102000010_seed_projects.sql** - 12 projects + 40 relationships  
✅ **20251102000011_seed_contact.sql** - 1 contact singleton

---

## Method 1: Supabase Dashboard (Easiest)

### Step-by-Step:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your MS-Portfolio project

2. **Navigate to SQL Editor**
   - Left sidebar → SQL Editor
   - Click "New Query"

3. **Apply Migrations in Order**

   **Migration 1: Technologies**
   ```sql
   -- Copy entire content from:
   -- supabase/migrations/20251102000009_seed_technologies.sql
   -- Paste and click "Run"
   ```

   **Migration 2: Projects**
   ```sql
   -- Copy entire content from:
   -- supabase/migrations/20251102000010_seed_projects.sql
   -- Paste and click "Run"
   ```

   **Migration 3: Contact**
   ```sql
   -- Copy entire content from:
   -- supabase/migrations/20251102000011_seed_contact.sql
   -- Paste and click "Run"
   ```

4. **Verify Data**
   ```sql
   -- Run verification query:
   SELECT 
     'technologies' as table, COUNT(*) as count FROM portfolio.technologies
   UNION ALL
     SELECT 'projects', COUNT(*) FROM portfolio.projects
   UNION ALL
     SELECT 'project_stack', COUNT(*) FROM portfolio.project_stack
   UNION ALL
     SELECT 'contact', COUNT(*) FROM portfolio.contact;
   ```

   **Expected Results:**
   | table | count |
   |-------|-------|
   | technologies | 26 |
   | projects | 12 |
   | project_stack | 40 |
   | contact | 1 |

---

## Method 2: Supabase CLI (Advanced)

### Prerequisites:
```powershell
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref
```

### Apply Migrations:
```powershell
# From project root
cd "C:\Users\marce\Desktop\Monynha Sotwares\Codebase\Projects\monynha-portfolio-3d"

# Apply all migrations
supabase db push

# Or apply specific migrations
supabase migration up
```

---

## Method 3: Direct PostgreSQL Connection

### Using psql or any PostgreSQL client:

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Execute each migration file
\i supabase/migrations/20251102000009_seed_technologies.sql
\i supabase/migrations/20251102000010_seed_projects.sql
\i supabase/migrations/20251102000011_seed_contact.sql
```

---

## Verification Steps

### 1. Check Row Counts
```sql
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables 
WHERE schemaname = 'portfolio'
  AND tablename IN ('technologies', 'projects', 'project_stack', 'contact')
ORDER BY tablename;
```

### 2. Verify Project-Technology Relationships
```sql
SELECT 
  p.name as project,
  array_agg(t.name ORDER BY ps.display_order) as technologies
FROM portfolio.projects p
LEFT JOIN portfolio.project_stack ps ON p.id = ps.project_id
LEFT JOIN portfolio.technologies t ON ps.technology_id = t.id
GROUP BY p.name, p.display_order
ORDER BY p.display_order;
```

Expected: Each project should have 3-6 technologies listed.

### 3. Check Contact Singleton
```sql
SELECT * FROM portfolio.contact;
```

Expected: 1 row with email "marcelo@monynha.com"

---

## Testing Frontend Integration

### After applying migrations:

1. **Clear Browser Cache** (important for localStorage translation cache)
   ```
   Ctrl + Shift + Delete → Clear all browsing data
   ```

2. **Start Dev Server**
   ```powershell
   npm run dev
   ```

3. **Test Pages**
   - http://localhost:8080/portfolio → Should load 12 projects
   - http://localhost:8080/portfolio/botecopro → Project detail
   - http://localhost:8080/about → Experience & skills
   - http://localhost:8080/contact → Contact page

4. **Verify Database Usage**
   - Open DevTools → Network tab
   - Look for Supabase REST API calls (should see `/rest/v1/projects`)
   - No errors in Console

5. **Check cv.json Fallback**
   - Temporarily rename `.env` → `.env.backup` (disable Supabase)
   - Refresh page → Should still load from cv.json
   - Restore `.env` file

---

## Troubleshooting

### Issue: "relation does not exist"
**Cause**: Schema not set correctly  
**Solution**: Ensure `VITE_SUPABASE_SCHEMA=portfolio` in `.env`

### Issue: "violates foreign key constraint"
**Cause**: Technologies not seeded before projects  
**Solution**: Apply migrations in order (technologies first)

### Issue: "duplicate key value violates unique constraint"
**Cause**: Migration already applied  
**Solution**: This is expected! Migrations use `WHERE NOT EXISTS` for idempotency

### Issue: Frontend still shows cv.json data
**Cause**: React Query cache or localStorage  
**Solution**: 
```javascript
// Clear React Query cache
localStorage.clear();
// Hard refresh
Ctrl + Shift + R
```

---

## Rollback (if needed)

### To remove seeded data:

```sql
-- Delete in reverse order (respect FK constraints)
DELETE FROM portfolio.project_stack;
DELETE FROM portfolio.projects;
DELETE FROM portfolio.technologies;
DELETE FROM portfolio.contact;

-- Verify empty tables
SELECT COUNT(*) FROM portfolio.projects; -- Should be 0
```

---

## Next Steps After Seeding

1. ✅ Verify all counts match expectations
2. ✅ Test frontend loads DB data
3. ✅ Test language switching (translation system)
4. ✅ Test contact form submission
5. 🔲 (Optional) Seed series/artworks/thoughts
6. 🔲 (Optional) Update SUPABASE.md with seed info
7. 🔲 Deploy to production

---

## Success Criteria

✅ **Complete** when:
- Technologies table: 26 rows
- Projects table: 12 rows
- Project_stack table: 40 rows
- Contact table: 1 row
- Frontend loads projects from database
- No fallback to cv.json (except when Supabase unavailable)
- All tests passing: `npm run test`
- Build successful: `npm run build`

---

## Support

**Questions?** Check the audit docs:
- `SUPABASE_AUDIT_PLAN.md` - Full audit and analysis
- `SUPABASE_DATA_INVENTORY.md` - Exact data counts
- `SUPABASE.md` - General Supabase documentation

**Need Help?** 
- Supabase Dashboard: https://supabase.com/dashboard
- Supabase Logs: Dashboard → Logs → Select service
- Frontend DevTools Console: Check for API errors
