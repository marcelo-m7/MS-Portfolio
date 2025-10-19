# Auditoria Visual — Marcelo Portigolio

## Sumário
- **Erros encontrados**
  - Sombras e brilhos das superfícies não eram renderizados porque o design system usava variáveis inexistentes (`--primary-hsl`, `--secondary-hsl`) nas declarações `rgba()`, deixando botões e cartões visualmente planos.
  - A paleta global não contemplava modo claro, nem seguia integralmente as cores oficiais (#7C3AED, #0EA5E9, #EC4899), o que impedia a captura em tema claro e comprometia consistência entre telas.
  - Componentes shadcn/ui, especialmente botões, não respeitavam o padrão solicitado de `rounded-2xl` com `shadow-md`, gerando desalinhamento com a biblioteca de design.
- **Correções aplicadas**
  - Reescrevemos os tokens para usar `hsl(var(--token) / α)` e adicionamos variáveis completas para ambos os temas, reativando sombras e brilhos.
  - Normalizamos a paleta em `src/index.css`, definindo modo claro e modo escuro com os tons oficiais e acrescentando tokens de sidebar para evitar cores indefinidas.
  - Ajustamos o componente base de botão (`components/ui/button.tsx`) para entregar `rounded-2xl` e `shadow-md` por padrão, mantendo legibilidade e acessibilidade nos estados de foco.
- **Prints de antes/depois**
  - Home (desktop escuro) — profundidade dos botões.
  - Home (desktop claro) — novo tema claro com tokens oficiais.
  - Portfolio (desktop) — cartões com sombras restauradas.
  - Home & Portfolio (mobile) — verificação responsiva em ambos os temas.

## Prints e Descrições
### 1. Sombras e profundidade do Hero (Desktop Escuro)
![Antes — Hero sem profundidade](browser:/invocations/gtlnrsdk/artifacts/artifacts/home-desktop-light-before.png)
*Problema:* As sombras dos botões e chips não apareciam porque as classes Tailwind usavam `rgba(var(--secondary-hsl)/…)` sem a variável definida, resultando em superfícies chapadas.
![Depois — Hero com sombras ativas](browser:/invocations/qwdpnrrg/artifacts/artifacts/home-desktop-dark-after.png)
*Correção:* Reescrevemos as classes para `hsl(var(--secondary) / …)` e atualizamos o design system; os botões agora exibem `shadow-md` com gradiente consistente.

### 2. Tema Claro ausente (Desktop)
![Antes — tema claro indisponível](browser:/invocations/gtlnrsdk/artifacts/artifacts/home-desktop-light-before.png)
*Problema:* Não havia definição de tokens para modo claro, impossibilitando capturas ou navegação com alto contraste em ambientes claros.
![Depois — tema claro alinhado à paleta oficial](browser:/invocations/iwtdsrxb/artifacts/artifacts/home-desktop-light-after.png)
*Correção:* Inserimos variáveis completas para `:root` (claro) e `.dark`, usando os tons #7C3AED, #0EA5E9 e #EC4899, garantindo contraste adequado e consistência.

### 3. Cartões do Portfolio (Desktop)
![Antes — cartões sem glow](browser:/invocations/mmeihqdr/artifacts/artifacts/portfolio-desktop-light-before.png)
*Problema:* Os cartões não apresentavam glow/sombra definidos porque as mesmas variáveis inexistentes eram usadas nas sombras compostas.
![Depois — cartões com profundidade](browser:/invocations/ujbvepud/artifacts/artifacts/portfolio-desktop-dark-after.png)
*Correção:* Ajustamos as sombras para `hsl(var(--token) / α)` e a paleta; os cards recuperaram profundidade e contraste.

### 4. Responsividade (Mobile)
![Depois — Home mobile escuro](browser:/invocations/oonqxchi/artifacts/artifacts/home-mobile-dark-after.png)
![Depois — Home mobile claro](browser:/invocations/yreaqpby/artifacts/artifacts/home-mobile-light-after.png)
![Depois — Portfolio mobile escuro](browser:/invocations/azffrgft/artifacts/artifacts/portfolio-mobile-dark-after.png)
![Depois — Portfolio mobile claro](browser:/invocations/bmgvefdr/artifacts/artifacts/portfolio-mobile-light-after.png)
*Verificação:* Após normalizar tokens e componentes, os layouts mobile preservam espaçamentos, bordas arredondadas (`rounded-2xl`) e sombras (`shadow-md`) nos dois temas.

## Checklist de Conformidade
✅ Paleta e tokens  
✅ Tipografia  
✅ Acessibilidade  
✅ Layout responsivo
