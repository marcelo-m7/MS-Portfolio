# Monynha Portfolio 3D

Experiência interativa construída com React, Vite e Tailwind para apresentar o ecossistema criativo da Monynha Softwares. O conteúdo dinâmico é abastecido a partir de `public/data/cv.json`, garantindo que perfis, projetos, séries e pensamentos possam ser atualizados sem alterar o código-fonte.

## Tecnologias principais

- React + Vite + TypeScript
- Tailwind CSS e shadcn/ui para componentes acessíveis
- Framer Motion com respeito a `prefers-reduced-motion`
- React Three Fiber (carregado sob demanda) para a cena hero e visualizadores 3D
- Google Translate invisível para multilíngue instantâneo

## Desenvolvimento local

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Internacionalização com Google Translate

O widget do Google Translate é carregado e ocultado automaticamente em `index.html`. As funções utilitárias vivem em `src/lib/googleTranslate.ts` e expõem a API `setLanguage(lang)` usada pelo componente `LanguageSwitcher`.

### Fluxo de idioma

1. Durante o bootstrap (`src/main.tsx`), `detectInitialLanguage()` procura um idioma salvo em `localStorage` e, se não houver, usa `navigator.language`.
2. `setLanguage(lang)` seleciona o idioma no widget oculto, emite o evento `app:languagechange` e atualiza `document.documentElement.lang`.
3. `LanguageSwitcher` (`src/components/LanguageSwitcher.tsx`) responde ao evento para refletir o idioma atual.

#### Como adicionar um novo idioma

1. Inclua o código ISO (por exemplo, `it` para italiano) em `supportedLanguages` dentro de `src/lib/googleTranslate.ts`.
2. Atualize o script em `index.html` para incluir o idioma em `includedLanguages`.
3. Adicione o rótulo no `labels` e `languageNames` do `LanguageSwitcher`.
4. Opcionalmente, traduza trechos estáticos em `cv.json`.

> **Importante:** o widget padrão permanece totalmente oculto via CSS e `MutationObserver`, atendendo ao requisito de não exibir a barra do Google.

## Estrutura de conteúdo (`cv.json`)

Todo o conteúdo visível é centralizado em `public/data/cv.json`. Os campos principais são:

- `profile`: dados pessoais exibidos no hero.
- `projects`: cada projeto precisa de `slug`, `thumbnail` (arquivo `.svg`) e informações da stack.
- `series` e `artworks`: mapeiam séries criativas e artes individuais.
- `thoughts`: lista de artigos para a rota `/thoughts` e detalhes em `/thoughts/:slug`.

### Adicionando novos projetos

1. Gere um `slug` único (kebab-case) e defina `thumbnail` apontando para um SVG em `public/images`.
2. Crie o arquivo `.svg` com título acessível (`<title>`) e mantenha proporção 16:9.
3. Inclua `category`, `year`, `summary`, `stack` e `url`.
4. Para destacar em séries, adicione o `slug` na lista `series[].works`.

### Adicionando novos pensamentos

1. Informe `slug`, `title`, `excerpt`, `body` (Markdown suportado), `date` em ISO (`YYYY-MM-DD`) e `tags`.
2. O corpo é renderizado via `react-markdown` em `/thoughts/:slug`.

### Adicionando séries ou artes

- Cada série (`series`) aceita `slug`, `title`, `description`, `year` e lista de `works` (slugs de projetos ou artes).
- Artes (`artworks`) devem apontar para SVGs em `public/images`. Se incluir modelos 3D (`.glb`), eles são carregados sob demanda no modal da rota `/art/:slug`.

## Acessibilidade e UX

- Componentes interativos utilizam `focus-visible` com `ring` consistente.
- Todas as animações respeitam `prefers-reduced-motion`; o hero 3D é substituído por uma arte estática quando necessário.
- Navegação completa por teclado: `LanguageSwitcher`, filtros de portfolio e menus receberam melhorias de foco.

## Boas práticas de assets

- **Somente SVGs** são adicionados à pasta `public/images`.
- Para novos ícones ou miniaturas, prefira gradientes e tipografia vetorial.
- Backgrounds globais (cores, gradientes) não devem ser alterados conforme a diretriz do projeto.

## Testes

Execute o build para garantir que o bundler está saudável:

```bash
npm run build
```

Isso valida a integração do React, Tailwind e das dependências carregadas sob demanda.
