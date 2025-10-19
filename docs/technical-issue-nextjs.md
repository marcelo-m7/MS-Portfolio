# Issue: Stack incompatibility with Next.js

## Contexto
- **Ferramenta de build**: o `package.json` define scripts `vite`, apontando para um workflow baseado em Vite e não em Next.js.
- **Roteamento**: `src/App.tsx` instancia `BrowserRouter` e `Routes` de `react-router-dom`, consolidando a navegação client-side.

## Problema
O plano inicial considerava o uso de funcionalidades específicas do Next.js. Contudo, o projeto atual é construído sobre Vite e React Router. Não há infraestrutura, pastas ou dependências necessárias para Next.js, portanto qualquer funcionalidade que dependa do framework não pode ser atendida sem uma migração estrutural.

## Impacto
- Esforço adicional caso uma migração para Next.js seja exigida, pois implicaria reescrever o roteamento, a configuração de build e adaptação das páginas.
- Bloqueio para tarefas que pressupõem APIs nativas de Next.js (renderização no servidor, diretório `app`, etc.).

## Recomendações imediatas
1. Ajustar expectativas das partes interessadas para o stack vigente (Vite + React Router).
2. Direcionar soluções para bibliotecas compatíveis com o ecossistema atual.
3. Registrar esta limitação em documentos de planejamento e especificações.
