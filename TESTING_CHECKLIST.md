# Database Connectivity & Contact Form Testing Checklist

## Overview
This checklist ensures the MS-Portfolio application correctly integrates with Supabase database and handles the contact form submissions properly.

---

## Pre-Test Setup

### ✅ Environment Variables
- [ ] `.env` file exists in project root
- [ ] `VITE_SUPABASE_URL` is set (e.g., `https://pkjigvacvddcnlxhvvba.supabase.co`)
- [ ] `VITE_SUPABASE_KEY` is set (anon/public key)
- [ ] `VITE_SUPABASE_SCHEMA` is set to `portfolio`

### ✅ Database Schema
- [ ] `public` schema exists with `leads` table
- [ ] `portfolio` schema exists with 15 tables
- [ ] All RLS policies are enabled
- [ ] Public read access configured for portfolio tables

---

## Test 1: Database Connection

### Manual Test
1. Open browser DevTools → Console
2. Run in console:
   ```javascript
   const url = import.meta.env.VITE_SUPABASE_URL;
   const key = import.meta.env.VITE_SUPABASE_KEY;
   console.log('URL:', url);
   console.log('Key exists:', !!key);
   ```

### Expected Result
- ✅ URL should print correctly
- ✅ Key exists should be `true`

---

## Test 2: Data Fetching (Portfolio Schema)

### Pages to Test

#### Home Page (`/`)
- [ ] Profile name and headline display
- [ ] Featured projects load (3 cards)
- [ ] Recent thoughts load (2 cards)
- [ ] **Loading state**: Skeletons show while fetching
- [ ] **No errors** in console

#### Portfolio Page (`/portfolio`)
- [ ] Projects tab shows all projects
- [ ] Artworks tab shows all artworks
- [ ] Series tab shows all series
- [ ] Filters work correctly
- [ ] **Loading state**: 6 skeleton cards show while fetching
- [ ] **No errors** in console

#### ProjectDetail Page (`/projects/:slug`)
- [ ] Project details load correctly
- [ ] Technologies list displays
- [ ] Thumbnail renders
- [ ] Full description shows
- [ ] Repository/Live links work
- [ ] **Loading state**: Comprehensive skeleton shows
- [ ] **404 handling**: Invalid slug shows error
- [ ] **No errors** in console

#### Thoughts Page (`/thoughts`)
- [ ] All thoughts list displays
- [ ] Tags show correctly
- [ ] Dates format properly (pt-PT locale)
- [ ] Reading time calculates
- [ ] **Loading state**: 4 skeleton cards show
- [ ] **No errors** in console

#### ThoughtDetail Page (`/thoughts/:slug`)
- [ ] Thought content loads
- [ ] Tags display
- [ ] Author profile shows in footer
- [ ] Markdown renders correctly
- [ ] **Loading state**: Comprehensive skeleton shows
- [ ] **404 handling**: Invalid slug shows error
- [ ] **No errors** in console

#### About Page (`/about`)
- [ ] Profile section loads (avatar, bio)
- [ ] Experience section shows (with highlights)
- [ ] Skills section displays (with levels)
- [ ] **Loading states**: Each section has skeleton
- [ ] **No errors** in console

#### ArtDetail Page (`/art/:slug`)
- [ ] Artwork details load
- [ ] Media gallery displays
- [ ] Materials list shows
- [ ] 3D link works (if available)
- [ ] **Loading state**: Comprehensive skeleton shows
- [ ] **404 handling**: Invalid slug shows error
- [ ] **No errors** in console

#### SeriesDetail Page (`/series/:slug`)
- [ ] Series information loads
- [ ] Works list displays correctly
- [ ] Cards link to correct pages
- [ ] **Loading state**: Skeleton shows
- [ ] **404 handling**: Invalid slug shows error
- [ ] **No errors** in console

---

## Test 3: Contact Form Submission (Public Schema)

### Test Case 1: Successful Submission (Database Available)

1. Navigate to `/contact` page
2. Fill out the form:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Company**: Test Company (optional)
   - **Project**: Test Project (optional)
   - **Message**: This is a test submission.
3. Click "Enviar Mensagem"

#### Expected Results
- [ ] Form submits without errors
- [ ] Success toast appears with message from `cv.json`
- [ ] Form resets to empty state
- [ ] **Console log**: No errors
- [ ] **Database**: New lead appears in `public.leads` table with `project_source='portfolio'`

#### Verification in Supabase Dashboard
```sql
SELECT * FROM public.leads 
WHERE project_source = 'portfolio' 
ORDER BY created_at DESC 
LIMIT 5;
```

### Test Case 2: Fallback Behavior (Database Unavailable)

1. **Simulate unavailable database**: Temporarily set invalid `VITE_SUPABASE_URL` in `.env`
2. Restart dev server
3. Fill out contact form
4. Submit

#### Expected Results
- [ ] Form submission triggers fallback mechanism
- [ ] **Console log**: "Supabase client unavailable, attempting fallback..."
- [ ] Email fallback attempted (Edge Function)
- [ ] User sees appropriate message
- [ ] **No crash** or unhandled errors

### Test Case 3: Validation Errors

1. Try submitting form with:
   - Empty name → Should show validation error
   - Invalid email → Should show validation error
   - Empty message → Should show validation error

#### Expected Results
- [ ] Form prevents submission
- [ ] Error messages display
- [ ] No network requests made

---

## Test 4: Fallback to cv.json

### Test Case 1: Simulate Database Unavailable

1. **Disable Supabase**: Comment out credentials in `.env`:
   ```bash
   # VITE_SUPABASE_URL=...
   # VITE_SUPABASE_KEY=...
   ```
2. Restart dev server
3. Navigate through all pages

#### Expected Results
- [ ] **All pages load successfully**
- [ ] Data displays from `public/data/cv.json`
- [ ] **Console logs**: Multiple fallback messages like:
  ```
  ℹ️ Supabase unavailable, falling back to cv.json
  ```
- [ ] **No errors** in console
- [ ] Contact form shows appropriate message

---

## Test 5: React Query Caching

### Test Case 1: Verify Caching Works

1. Navigate to Home page
2. Wait for data to load
3. Navigate to Portfolio page
4. Navigate back to Home page

#### Expected Results
- [ ] Second visit to Home is **instant** (no loading skeleton)
- [ ] **DevTools → Network**: No new API calls on second visit
- [ ] **React Query DevTools**: Shows cached data (if installed)

### Test Case 2: Verify Stale Time

1. Load any page with data
2. Wait 5 minutes (staleTime threshold)
3. Navigate away and back

#### Expected Results
- [ ] Data refetches in background
- [ ] Page shows cached data immediately
- [ ] Fresh data replaces cached data when ready

---

## Test 6: Error Handling

### Test Case 1: Network Error During Fetch

1. Open DevTools → Network tab
2. Enable "Offline" mode
3. Navigate to any data page
4. Disable "Offline" mode

#### Expected Results
- [ ] Graceful degradation (fallback to cv.json)
- [ ] **Console log**: Fallback message
- [ ] No blank page or crash
- [ ] When back online, data refreshes

---

## Test 7: TypeScript Type Safety

### Manual Code Review

- [ ] No `any` types used in hooks
- [ ] Database types properly imported from `database.types.ts`
- [ ] Query functions return correct types
- [ ] Components use proper types for props

### Build Test
```bash
npm run build
```

#### Expected Results
- [ ] Build completes successfully
- [ ] **No TypeScript errors**
- [ ] Bundle size reasonable

---

## Test 8: Performance

### Metrics to Check

1. Open DevTools → Lighthouse
2. Run audit on Home page

#### Target Scores
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 90
- [ ] SEO: > 90

### Bundle Analysis
```bash
npm run build
```

#### Expected Results
- [ ] `dist/` folder generated
- [ ] Main bundle < 500KB
- [ ] Code splitting working (multiple chunks)

---

## Test 9: Cross-Browser Testing

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, if available)
- [ ] Edge (latest)

### Features to Verify in Each
- [ ] Contact form submits correctly
- [ ] Data loads from database
- [ ] Animations work (respects reduced motion)
- [ ] No console errors

---

## Test 10: Mobile Responsiveness

### Devices to Test
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)

### Features to Verify
- [ ] Contact form usable on mobile
- [ ] All pages scroll correctly
- [ ] Touch interactions work
- [ ] No horizontal overflow

---

## Automated Test Script

Run the connectivity test script:

```bash
node test-connectivity.js
```

### Expected Output
```
📡 Test 1: Connection Test
  ✅ Connection successful
  📋 Profile found: Marcelo Pereira

📚 Test 2: Portfolio Schema Access
  ✅ Projects: 3 found
     - MS-Portfolio (ms-portfolio)
     - Project 2 (project-2)
     - Project 3 (project-3)
  ✅ Artworks: 3 found
     - Art Leo (art-leo)
     - Artwork 2 (artwork-2)
     - Artwork 3 (artwork-3)

📧 Test 3: Contact Form Submission
  ✅ Submission successful
  📋 Lead ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

🔗 Test 4: Technologies JOIN Query
  ✅ Projects with technologies: 2
     - MS-Portfolio: 15 technologies
     - Project 2: 8 technologies

📊 Test Results Summary
──────────────────────────────────────────────────
  Connection:         ✅ PASS
  Portfolio Schema:   ✅ PASS
  Contact Form:       ✅ PASS
  Technologies JOIN:  ✅ PASS
──────────────────────────────────────────────────

🎉 All critical tests passed!
```

---

## Common Issues & Solutions

### Issue 1: "Cannot read properties of undefined"
**Solution**: Check that database tables have data seeded. Run Phase 2 migrations if needed.

### Issue 2: "Permission denied for schema portfolio"
**Solution**: Verify RLS policies are enabled and configured correctly. Check Supabase dashboard → Authentication → Policies.

### Issue 3: Contact form fails silently
**Solution**: Check browser console for detailed error. Verify `public.leads` table exists and RLS allows inserts.

### Issue 4: Data not loading, no fallback
**Solution**: Check console for errors. Verify `usePortfolioData.ts` hooks have try-catch blocks and fallback logic.

### Issue 5: Infinite loading state
**Solution**: React Query might be stuck. Check `queryClient.tsx` configuration. Verify `enabled` prop in hooks.

---

## Final Verification

After completing all tests:

- [ ] All pages load without errors
- [ ] Contact form submits successfully
- [ ] Database queries work correctly
- [ ] Fallback to cv.json works when needed
- [ ] TypeScript build succeeds
- [ ] Performance metrics acceptable
- [ ] No console errors on any page
- [ ] Mobile experience is smooth

---

## Documentation Updated

- [ ] README.md includes database setup instructions
- [ ] SUPABASE.md documents schema and RLS policies
- [ ] Code comments explain hook usage
- [ ] `.env.example` has all required variables

---

## Sign-Off

**Tester Name**: _______________
**Date**: _______________
**Status**: [ ] ✅ PASS  [ ] ⚠️ PASS WITH ISSUES  [ ] ❌ FAIL

**Notes**:
_______________________________________________________
_______________________________________________________
_______________________________________________________
