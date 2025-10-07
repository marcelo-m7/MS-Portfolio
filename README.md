# Monynha Portfolio 3D

Portfolio imersivo do ecossistema Monynha, construído com React, Vite e Tailwind para apresentar projetos, séries criativas e pensamentos sobre tecnologia e arte digital. O site suporta tradução dinâmica via Google Translate e experiências 3D otimizadas para quem prefere animações suaves.

## Tecnologias principais

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) e tokens definidos em `src/index.css`
- [shadcn/ui](https://ui.shadcn.com/) para componentes acessíveis
- [Framer Motion](https://www.framer.com/motion/) para transições respeitando `prefers-reduced-motion`
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) e [`@react-three/drei`](https://github.com/pmndrs/drei) para as cenas 3D

## Estrutura de pastas

```
├── public/
│   └── data/cv.json        # Fonte única de conteúdo (perfil, projetos, séries, artes, pensamentos)
├── src/
│   ├── components/         # Componentes compartilhados (UI, 3D, navegação)
│   ├── hooks/              # Hooks personalizados (p.ex. preferências de movimento, cores do tema)
│   ├── lib/                # Utilidades (Google Translate, helpers de conteúdo)
│   ├── pages/              # Páginas roteadas (Home, Portfolio, About, etc.)
│   ├── index.css           # Design tokens (cores, fontes, gradientes e utilitários globais)
│   └── main.tsx            # Bootstrap da aplicação
```

## Pré-requisitos

- Node.js 18 ou superior (recomendado via [nvm](https://github.com/nvm-sh/nvm))
- npm 9+ ou [pnpm](https://pnpm.io/) 8+

Instale as dependências com o gerenciador de sua preferência:

```sh
npm install
# ou
pnpm install
```

## Comandos úteis

| Comando            | Descrição |
| ------------------ | --------- |
| `npm run dev`      | Inicia o servidor de desenvolvimento em `http://localhost:5173` com recarregamento instantâneo. |
| `npm run build`    | Gera o bundle otimizado para produção. Utiliza Vite + esbuild. |
| `npm run preview`  | Sobe um servidor local para inspecionar o build produzido. |
| `npm run lint`     | Executa o ESLint com as regras do projeto (alguns componentes shadcn exibem avisos conhecidos de Fast Refresh). |

> **Dica:** Utilize `npm run build` antes de publicar para garantir que o bundle inicial permaneça abaixo de 170 kB.

## Qualidade e boas práticas

- Todas as cores e gradientes devem ser declarados em `src/index.css` como custom properties HSL.
- Componentes 3D (`Hero3D`, `Art3DPreview`) são carregados sob demanda com `React.lazy` e respeitam `prefers-reduced-motion`.
- Imagens utilizam `loading="lazy"` e `decoding="async"` por padrão para otimizar o carregamento.
- Utilize `npm run lint` para identificar problemas antes de abrir um PR.
- Para auditoria de performance e acessibilidade, execute o projeto (`npm run dev`) e avalie com o [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) buscando notas ≥ 90 em Performance, Accessibility e Best Practices.

## Trabalhando com `cv.json`

O ficheiro `public/data/cv.json` centraliza todo o conteúdo exibido no site:

- `profile`: dados pessoais, avatar e bio.
- `projects`: lista de projetos com `name`, `summary`, `stack`, `url`, `category`, `year` e `thumbnail` (preferencialmente SVG 16:9).
- `series`: coleções criativas que agregam trabalhos (`works`) por slug.
- `artworks`: peças individuais com galerias (`media`), `url3d`, materiais e descrição.
- `thoughts`: posts curtos utilizados nas páginas de Pensamentos.

### Adicionando novos itens

1. Edite o array apropriado dentro de `cv.json` seguindo a estrutura existente.
2. Salve thumbnails ou artes em `public/images/` (SVG otimizado). Garanta que cada SVG possua `<title>` para acessibilidade.
3. Atualize os campos `slug` quando necessário — eles alimentam o roteamento dinâmico (`/thoughts/:slug`, `/series/:slug`, `/art/:slug`).
4. Execute `npm run lint` e `npm run build` para validar o conteúdo novo.

## Fluxo de contribuição

1. Crie um branch descritivo: `git checkout -b feat/nova-secao`.
2. Faça commits pequenos e claros.
3. Execute `npm run lint` (e testes adicionais, se aplicável) antes do push.
4. Abra um Pull Request descrevendo as mudanças, incluindo notas sobre acessibilidade, performance ou novos conteúdos no `cv.json`.

## Deploy

O projeto pode ser publicado via [Lovable](https://lovable.dev/) (Share → Publish) ou hospedado manualmente em qualquer ambiente estático (Netlify, Vercel, Cloudflare Pages). Para deploy manual, utilize o output da pasta `dist/` gerado por `npm run build`.

## Suporte a idiomas

A tradução automática utiliza o widget oficial do Google Translate, inicializado em `index.html` e controlado pelos helpers em `src/lib/googleTranslate.ts`. O evento customizado `monynha:languagechange` mantém o `LanguageSwitcher` sincronizado com a seleção armazenada em `localStorage` (`monynha-lang`).

Sinta-se à vontade para abrir issues ou PRs com melhorias de acessibilidade, performance ou novos conteúdos. 💜
