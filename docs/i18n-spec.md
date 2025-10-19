# Especificação de Internacionalização Compatível com Vite

## Decisão de alinhamento
Após alinhamento com as partes interessadas, ficou decidido que **não haverá migração para Next.js neste momento**. Em vez disso, a estratégia de internacionalização será atendida com bibliotecas compatíveis com o ambiente Vite + React Router. A biblioteca selecionada é `react-i18next`, que oferece suporte a carregamento assíncrono de traduções e integração transparente com componentes React.

## Novas dependências
- `react-i18next`
- `i18next`
- `i18next-browser-languagedetector` (opcional, caso desejemos detectar idioma automaticamente)

Essas dependências devem ser adicionadas ao `package.json` em uma futura tarefa de implementação.

## Pontos de integração
1. **Bootstrap do app (`src/main.tsx` e `src/App.tsx`)**
   - Envolver a árvore de componentes com `I18nextProvider` para expor o contexto de traduções.
   - Manter `BrowserRouter` como roteador principal, garantindo compatibilidade com o fluxo atual de rotas aninhadas.
2. **Utilitário de idioma (`src/lib/language.ts`)**
   - Integrar o estado de idioma já existente com o `i18next.changeLanguage`, garantindo que o `localStorage` continue como fonte da verdade e dispare o evento `monynha:languagechange`.
3. **Páginas e componentes (`src/pages/*`, `src/components/*`)**
   - Substituir strings hardcoded por hooks como `useTranslation()`.
   - Definir namespaces de tradução alinhados aos domínios funcionais (ex.: `home`, `portfolio`, `contact`).
4. **Recursos estáticos (`public/locales`)**
   - Criar diretórios por idioma (`pt`, `en`, etc.) com arquivos JSON seguindo a convenção `<namespace>.json`.

## Impactos em rotas
- Nenhuma alteração estrutural nas rotas existentes em `src/App.tsx`. O `BrowserRouter` continua responsável pela navegação.
- Páginas individuais poderão carregar traduções sob demanda usando `Suspense`, mantendo a compatibilidade com os `lazy()` imports já configurados.
- Não há dependência de funcionalidades de roteamento específicas de Next.js; portanto, rotas dinâmicas continuarão sendo gerenciadas por `react-router-dom`.

## Próximos passos
1. Criar tarefa de implementação para adicionar as dependências acima e configurar o provedor i18n.
2. Definir convenções de nomenclatura para namespaces de tradução e estrutura de arquivos em `public/locales`.
3. Atualizar componentes prioritários para consumir traduções através de `useTranslation`.
