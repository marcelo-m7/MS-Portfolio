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
- Framer Motion
- React Three Fiber
- Google Translate (widget invisível)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6628e239-c846-4fe2-be14-67c58256d6a7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Internationalização automática

A interface é traduzida usando o widget oficial do Google Translate, carregado de forma invisível. Para alterar o idioma da interface:

1. O componente `LanguageSwitcher` oferece botões PT/EN/ES/FR que chamam o utilitário `setLanguage`.
2. O arquivo [`src/lib/translate.ts`](src/lib/translate.ts) encapsula toda a lógica:
   - `setLanguage(lang)` simula a seleção do widget e sincroniza `localStorage`.
   - `getInitialLanguage()` detecta o idioma salvo ou o `navigator.language`.
   - `useGoogleTranslateGuard()` mantém o widget totalmente oculto através de `MutationObserver`.
3. `App.tsx` chama `registerGlobalLanguageSetter()` e aplica automaticamente o idioma detectado na primeira montagem.

Ao adicionar novas linguagens, atualize o array `SUPPORTED_LANGUAGES` em `translate.ts` e replique o botão no `LanguageSwitcher`.

## Adicionando novos projetos ao portfólio

1. Edite [`public/data/cv.json`](public/data/cv.json) e inclua um objeto na chave `projects` com os campos:
   - `slug`: identificador único em minúsculas (usado para relacionar séries e artes).
   - `name`, `summary`, `stack`, `url`, `thumbnail` (use apenas SVGs em `public/images`).
   - `category` e `year` para organizar filtros e metadados.
2. Crie um SVG 16:9 em `public/images` com gradiente e `<title>` descritivo.
3. Atualize `series` ou `artworks` para referenciar o novo `slug`, quando necessário.
4. O layout do portfólio e o grid da Home leem automaticamente os dados do JSON – não é preciso ajustar componentes.
