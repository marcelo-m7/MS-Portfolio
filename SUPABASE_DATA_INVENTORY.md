# Supabase Data Inventory - MS-Portfolio

**Date**: November 2, 2025  
**Source**: `public/data/cv.json` analysis  
**Purpose**: Exact counts for seed migration planning

---

## Data Summary

### Projects
- **Count**: 11 projects
- **Categories**: 
  - Soluções Empresariais (1)
  - Institucional (2)
  - Educação (1)
  - Documentação (2)
  - Arte Digital (1)
  - IA Conversacional (1)
  - IA (2)
  - Portfólio (1)
  - Infraestrutura (1)

### Technologies (Unique)
Extracted from all project `stack` arrays:

**Total Unique**: 26 technologies

1. Supabase (Backend)
2. Flutter (Mobile)
3. React (Frontend)
4. TypeScript (Language)
5. Vite (Build Tool)
6. Tailwind CSS (Styling)
7. i18next (Internationalization)
8. Playwright (Testing)
9. Next.js (Framework)
10. Payload CMS (CMS)
11. shadcn/ui (UI Library)
12. Internacionalização (i18n)
13. React Three Fiber (3D)
14. LLMs (AI)
15. WhatsApp API (Integration)
16. Dashboards (Visualization)
17. Static Site (Architecture)
18. Markdown (Content)
19. Design System (UI)
20. Coolify (DevOps)
21. Containers (Docker)
22. Observability (Monitoring)
23. Open WebUI (AI Tool)
24. Docker (DevOps)
25. Python (Language)
26. LangChain (AI Framework)
27. OpenAI (AI Service)

### Project-Technology Relationships
- **Total Relationships**: 40 (avg 3.6 techs per project)

Project breakdown:
- BotecoPro: 3 techs
- Boteco.pt: 6 techs
- FACODI: 3 techs
- MonynhaTech: 3 techs
- Art Leo: 3 techs
- AssisTina: 3 techs
- MonaDocs: 3 techs
- Monynha.com: 3 techs
- Monynha Online: 3 techs
- Open WebUI: 3 techs
- Marcelo Portfolio: 3 techs
- MonAgent: 3 techs

### Experience
- **Count**: 6 experience records (already seeded ✅)
- Organizations: Monynha Softwares, Kobu Agency, Outlier.ai, Worten, Bar do Jonas, Universidade do Algarve

### Skills
- **Count**: 17 skills (already seeded ✅)
- Categories: Backend/IA, Frontend, DevOps, Mobile, CMS, Animações/UI, 3D/WebGL

### Series
- **Count**: 1 series
- Title: "Creative Systems"
- Works: 2 (artleo, monagent)

### Artworks
- **Count**: 1 artwork
- Title: "Art Leo Creative Spaces"
- Media: 2 images
- Materials: 3 (WebGL, 3D Animation, Digital Sculpture)

### Thoughts (from cv.json)
- **Count**: 2 thoughts in JSON
- Slugs:
  1. "design-tecnologia-inclusiva" (2025-01-17)
  2. "por-tras-da-monynha" (2025-02-02)

### Thoughts (from markdown files)
- **Count**: 3 markdown files in `public/content/blog/`
  1. `automacao-ia-acessibilidade.md`
  2. `design-tecnologia-inclusiva.md` (duplicate - exists in JSON)
  3. `pensamento-open-source.md`

**Note**: "design-tecnologia-inclusiva" exists in both JSON and markdown. Need to reconcile.

### Contact (Singleton)
- **Count**: 1 contact record (NOT seeded yet ❌)
- Fields: email, availability, note, successMessage, errorMessage

---

## Seed Migration Priorities

### CRITICAL (Must seed immediately):
1. **Technologies** (26 items) - Required for project FK
2. **Projects** (11 items) - Main portfolio content
3. **Project_Stack** (40 relationships) - Links projects to technologies
4. **Contact** (1 singleton) - Contact page configuration

### HIGH (Seed soon):
1. **Series** (1 item) - Art collections
2. **Series_Works** (2 relationships) - Links to artleo/monagent
3. **Artworks** (1 item) - Art Leo piece
4. **Artwork_Media** (2 items) - Art Leo images
5. **Artwork_Materials** (3 items) - WebGL, 3D Animation, Digital Sculpture

### MEDIUM (Can wait):
1. **Thoughts** (2-3 items) - Blog posts
   - Decision needed: Use JSON data or parse markdown?
   - Reconcile duplicate "design-tecnologia-inclusiva"
2. **Thought_Tags** (10-15 relationships) - Tags for thoughts

---

## Migration File Plan

### 1. `20251102000009_seed_technologies.sql`
- Insert 26 unique technologies
- Use `ON CONFLICT (name) DO NOTHING` for idempotency

### 2. `20251102000010_seed_projects.sql`
- Insert 11 projects
- Link to technologies via project_stack (40 relationships)
- Use `WHERE NOT EXISTS` for idempotency

### 3. `20251102000011_seed_contact.sql`
- Insert 1 contact singleton
- Use values from cv.json contact object

### 4. `20251102000012_seed_series_artworks.sql` (Optional)
- Insert 1 series
- Insert 2 series_works
- Insert 1 artwork
- Insert 2 artwork_media
- Insert 3 artwork_materials

### 5. `20251102000013_seed_thoughts.sql` (Optional)
- Decision: JSON vs Markdown source?
- Insert 2-3 thoughts
- Insert tags (thought_tags)

---

## Technology Category Mapping

Suggested categories for `technologies` table:

| Technology | Category |
|------------|----------|
| Supabase | Backend |
| Flutter | Mobile |
| React | Frontend |
| TypeScript | Language |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| i18next | i18n |
| Playwright | Testing |
| Next.js | Framework |
| Payload CMS | CMS |
| shadcn/ui | UI Library |
| React Three Fiber | 3D/WebGL |
| LLMs | AI/ML |
| WhatsApp API | Integration |
| Dashboards | Visualization |
| Markdown | Content |
| Design System | Design |
| Coolify | DevOps |
| Docker | DevOps |
| Observability | Monitoring |
| Open WebUI | AI Tool |
| Python | Language |
| LangChain | AI Framework |
| OpenAI | AI Service |
| Containers | DevOps |
| Static Site | Architecture |
| Internacionalização | i18n |

---

## Data Validation Checklist

After seeding, verify:

- [ ] `technologies` table has 26 rows
- [ ] `projects` table has 11 rows
- [ ] `project_stack` table has 40 rows
- [ ] `contact` table has 1 row
- [ ] `series` table has 1 row
- [ ] `series_works` table has 2 rows
- [ ] `artworks` table has 1 row
- [ ] `artwork_media` table has 2 rows
- [ ] `artwork_materials` table has 3 rows
- [ ] All projects link to correct technologies
- [ ] All FKs resolve correctly
- [ ] No orphaned relationships

---

## Expected Row Counts After Seeding

```sql
SELECT 
  'profile' as table, COUNT(*) as count FROM portfolio.profile
UNION ALL
  SELECT 'contact', COUNT(*) FROM portfolio.contact
UNION ALL
  SELECT 'technologies', COUNT(*) FROM portfolio.technologies
UNION ALL
  SELECT 'projects', COUNT(*) FROM portfolio.projects
UNION ALL
  SELECT 'project_stack', COUNT(*) FROM portfolio.project_stack
UNION ALL
  SELECT 'artworks', COUNT(*) FROM portfolio.artworks
UNION ALL
  SELECT 'artwork_media', COUNT(*) FROM portfolio.artwork_media
UNION ALL
  SELECT 'artwork_materials', COUNT(*) FROM portfolio.artwork_materials
UNION ALL
  SELECT 'series', COUNT(*) FROM portfolio.series
UNION ALL
  SELECT 'series_works', COUNT(*) FROM portfolio.series_works
UNION ALL
  SELECT 'thoughts', COUNT(*) FROM portfolio.thoughts
UNION ALL
  SELECT 'thought_tags', COUNT(*) FROM portfolio.thought_tags
UNION ALL
  SELECT 'experience', COUNT(*) FROM portfolio.experience
UNION ALL
  SELECT 'experience_highlights', COUNT(*) FROM portfolio.experience_highlights
UNION ALL
  SELECT 'skills', COUNT(*) FROM portfolio.skills;
```

Expected results:
| Table | Count |
|-------|-------|
| profile | 1 |
| contact | 1 |
| technologies | 26 |
| projects | 11 |
| project_stack | 40 |
| artworks | 1 |
| artwork_media | 2 |
| artwork_materials | 3 |
| series | 1 |
| series_works | 2 |
| thoughts | 2-3 |
| thought_tags | 10-15 |
| experience | 6 |
| experience_highlights | ~15 |
| skills | 17 |

---

## Next Action

**Create seed migration files in this order:**

1. ✅ Audit complete (this document)
2. 🔲 Create `20251102000009_seed_technologies.sql`
3. 🔲 Create `20251102000010_seed_projects.sql`
4. 🔲 Create `20251102000011_seed_contact.sql`
5. 🔲 Apply migrations to Supabase
6. 🔲 Test frontend loads DB data
7. 🔲 (Optional) Seed series/artworks/thoughts

**Ready to proceed with migration creation?**
