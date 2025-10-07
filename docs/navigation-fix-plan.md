# Navigation Stability Fix Plan

## Task 1 — Remove automatic Google Translate activation
- **Goal:** Prevent the Google Translate widget from auto-triggering and injecting blocking overlays for visitors whose browsers are not set to Portuguese.
- **Files/Components:** `index.html`, `src/components/LanguageSwitcher.tsx`.
- **Expected Result:** The site loads without Google Translate altering the layout until a visitor explicitly chooses a language.

## Task 2 — Manage Google Translate script inside React
- **Goal:** Lazily load and initialise Google Translate from a reusable helper so that React retains control over the DOM tree and can recover from translation state changes.
- **Files/Components:** `src/lib/googleTranslate.ts` (new), `src/components/LanguageSwitcher.tsx`.
- **Expected Result:** Google Translate is initialised only once, integrates with the custom language switcher, and no longer wipes the app when navigating.

## Task 3 — Guard against overlay interference
- **Goal:** Ensure any Google Translate frames or containers cannot intercept pointer events or blank the viewport after navigation.
- **Files/Components:** `src/lib/googleTranslate.ts`, `src/index.css`.
- **Expected Result:** Navigation links remain clickable and the viewport never turns black after switching pages, even after changing languages.
