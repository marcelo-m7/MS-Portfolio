# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/6628e239-c846-4fe2-be14-67c58256d6a7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6628e239-c846-4fe2-be14-67c58256d6a7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6628e239-c846-4fe2-be14-67c58256d6a7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Internationalization & Google Translate

The multi-idioma experience is powered by the official Google Translate widget, fully hidden and configured at runtime.

- The script is injected in `index.html` and initialised with `window.googleTranslateElementInit`.
- `src/lib/googleTranslate.ts` exposes helpers:
  - `initializeGoogleTranslate()` sets up MutationObservers that hide Google artefacts and ensures the `<body>` spacing stays untouched.
  - `detectInitialLanguage()` checks `localStorage` (`monynha-lang`) and `navigator.language` to determine the preferred locale.
  - `setLanguage(lang)` simulates the widget `<select>` (PT, EN, ES, FR) and dispatches the `monynha:languagechange` custom event.
- `LanguageSwitcher` listens to that event and renders accessible pill buttons with focus-visible outlines.

To change the language programmatically you can simply call:

```ts
import { setLanguage } from '@/lib/googleTranslate';

setLanguage('es');
```

The helpers automatically hide Google’s toolbar, banners and iframes so no additional CSS tweaks are required.

## Adding new projects to `cv.json`

Project cards, portfolio thumbnails and extra pages consume the single source of truth located at `public/data/cv.json`.

1. Duplicate an existing entry inside the `projects` array and adjust the fields (`name`, `summary`, `stack`, `url`, `category`, `year`).
2. Create a **vector** thumbnail (SVG only) under `public/images/`. Make sure to include a descriptive `<title>` element for accessibility and keep the canvas 16:9 (640x360 works well).
3. Reference the SVG through the `thumbnail` property (e.g. `"thumbnail": "/images/novo-projeto.svg"`).
4. Run `npm run build` to ensure the bundle stays under budget.

Thoughts, artworks or series follow the same approach: update the JSON and link SVG assets—no raster formats should be added to the repository.
