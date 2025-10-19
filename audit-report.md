# Auditoria Visual — Marcelo Portigolio

## Sumário

### Erros encontrados
- Modo claro inexistente: todos os layouts herdavam os tokens escuros, produzindo baixo contraste e falta de paridade cromática com a identidade oficial (Home, Portfolio, About, Contact).
- Componentes shadcn/ui sem padronização: botões, cards e campos de formulário estavam com `rounded-md`/`shadow-sm`, fugindo do guideline `rounded-2xl` + `shadow-md` e variando bordas e preenchimentos entre páginas.

### Correções aplicadas
- Recriado o sistema de tokens com paletas light/dark em HSL, incluindo tipografia, foco visível e utilitário `glass` com sombra consistente, além de prover `ThemeProvider` + `ThemeToggle` para alternância acessível.
- Normalizados Button, Card, Input e Textarea para `rounded-2xl` + `shadow-md`, assegurando alinhamento com o design system em formulários, cards do portfólio e CTA.

### Prints de antes/depois
- Home (desktop light/dark)
- Portfolio (desktop + mobile light/dark)
- About (desktop light/dark)
- Contact (desktop light/dark)

## Prints e Descrições

### Home — estado anterior
![Home antes (desktop light)](browser:/invocations/gyzzmyad/artifacts/artifacts/home-desktop-light.png)
![Home antes (desktop dark)](browser:/invocations/gyzzmyad/artifacts/artifacts/home-desktop-dark.png)
- **Problema:** o modo claro replicava o mesmo fundo escuro, removendo contraste e sinalizações de foco; botões apresentavam sombras discrepantes e não respeitavam a padronização de raio.
- **Correção sugerida:** definir paleta clara dedicada, ajustar foco, consolidar tokens globais e padronizar componentes.

### Home — após correções
![Home depois (desktop light)](browser:/invocations/ehitjnep/artifacts/artifacts/home-desktop-light-after.png)
![Home depois (desktop dark)](browser:/invocations/ehitjnep/artifacts/artifacts/home-desktop-dark-after.png)
- **Resultado:** modo claro com fundo #F5F8FF equivalente à identidade, contraste reforçado nas chamadas e foco azul consistente; toggle de tema visível no navbar com botões `rounded-2xl`.

### Portfolio — estado anterior
![Portfolio antes (desktop light)](browser:/invocations/fjjgshmh/artifacts/artifacts/portfolio-desktop-light.png)
![Portfolio antes (desktop dark)](browser:/invocations/fjjgshmh/artifacts/artifacts/portfolio-desktop-dark.png)
![Portfolio antes (mobile light)](browser:/invocations/fjjgshmh/artifacts/artifacts/portfolio-mobile-light.png)
![Portfolio antes (mobile dark)](browser:/invocations/fjjgshmh/artifacts/artifacts/portfolio-mobile-dark.png)
- **Problema:** cartões herdavam `rounded-[var(--radius)]` e sombras customizadas conflitantes com o guideline; chips de filtro no modo claro ficavam sem contraste perceptível.
- **Correção sugerida:** usar tokens globais para cards, ajustar sombras/bordas, garantir contraste nos filtros em ambos os temas.

### Portfolio — após correções
![Portfolio depois (desktop light)](browser:/invocations/ehitjnep/artifacts/artifacts/portfolio-desktop-light-after.png)
![Portfolio depois (desktop dark)](browser:/invocations/ehitjnep/artifacts/artifacts/portfolio-desktop-dark-after.png)
![Portfolio depois (mobile light)](browser:/invocations/ehitjnep/artifacts/artifacts/portfolio-mobile-light-after.png)
![Portfolio depois (mobile dark)](browser:/invocations/ehitjnep/artifacts/artifacts/portfolio-mobile-dark-after.png)
- **Resultado:** cartões com `rounded-2xl`, sombras moderadas e contraste alinhado; filtros exibem estados ativos legíveis em ambos os temas.

### About — estado anterior
![About antes (desktop)](browser:/invocations/fjjgshmh/artifacts/artifacts/about-desktop-light.png)
- **Problema:** ausência de modo claro e cards com vidragem sem sombra padrão, comprometendo hierarquia visual.
- **Correção sugerida:** aplicar tokens claros e padronizar `glass` para reproduzir sombra média.

### About — após correções
![About depois (desktop light)](browser:/invocations/ehitjnep/artifacts/artifacts/about-desktop-light-after.png)
![About depois (desktop dark)](browser:/invocations/ehitjnep/artifacts/artifacts/about-desktop-dark-after.png)
- **Resultado:** cards com vidro translúcido consistente, contraste entre títulos e fundos e preservação do guideline de raio.

### Contact — estado anterior
![Contact antes (desktop)](browser:/invocations/fjjgshmh/artifacts/artifacts/contact-desktop-light.png)
- **Problema:** formulário sem variação de tema, inputs com cantos retos (`rounded-md`) e sombras inconsistentes.
- **Correção sugerida:** padronizar componentes de formulário com `rounded-2xl` + `shadow-md` e atualizar tokens.

### Contact — após correções
![Contact depois (desktop light)](browser:/invocations/ehitjnep/artifacts/artifacts/contact-desktop-light-after.png)
![Contact depois (desktop dark)](browser:/invocations/ehitjnep/artifacts/artifacts/contact-desktop-dark-after.png)
- **Resultado:** campos com raio suave, sombra uniforme e contraste adequado no modo claro/escuro.

## Checklist de Conformidade
✅ Paleta e tokens
✅ Tipografia
✅ Acessibilidade
✅ Layout responsivo
