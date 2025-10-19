# Auditoria Visual — Marcelo Portigolio

## Sumário
- Erros encontrados
  - Paleta só oferecia o modo escuro e os tokens usavam valores inconsistentes com a identidade visual.
  - Cartões e botões tinham `border-radius` e sombras fora do padrão (`rounded-2xl`, `shadow-md`).
  - Conteúdos próximos da barra fixa ficavam ocultos e havia contrastes insuficientes no modo claro inexistente.
- Correções aplicadas
  - Definição completa dos tokens claros/escuros, normalização das utilitárias (`glass`) e script de detecção de tema.
  - Ajuste das variantes do `Button`, `Card` e dos cartões principais para usar `rounded-2xl` + `shadow-md/hover:shadow-lg`.
  - Revisão de seções (Home, Thought/Series/Project detail) com novos espaçamentos e bordas padronizadas.
- Prints de antes/depois
  - Hero (modo claro ausente) → Hero com tema claro.
  - Grade de projetos encoberta pela navbar → grade com espaçamento.
  - Layout mobile sem tokens de luz → layout mobile coerente.

## Prints e Descrições

### Tema Claro ausente
- **Antes:** hero apenas em modo escuro, impossibilitando contraste adequado no tema claro.
  ![Hero antes](browser:/invocations/hlbjqkxc/artifacts/artifacts/desktop-light.png)
- **Depois:** tokens claros definidos e script de detecção automática habilitando o modo claro consistente.
  ![Hero depois](browser:/invocations/siphvrlo/artifacts/artifacts/after-desktop-light.png)
- **Ajuste:** novos valores HSL no `:root`/`.dark`, tipografia `font-sans` global e utilitário `glass` com `rounded-2xl` + `shadow-md`.

### Navegação encobrindo a lista de projetos
- **Antes:** o heading "Projetos em Destaque" ficava sob a navbar fixa e os cards não seguiam o raio/sombra padrão.
  ![Projetos antes](browser:/invocations/yggzwzet/artifacts/artifacts/desktop-light-mid.png)
- **Depois:** seções com `pt-32`/`pt-12`, cartões `rounded-2xl` e sombras padronizadas.
  ![Projetos depois](browser:/invocations/sejnlmfh/artifacts/artifacts/after-desktop-light-projects.png)
- **Ajuste:** revisão de `Home.tsx`, `ProjectCard.tsx` e utilitário `glass` para harmonizar tokens.

### Layout mobile sem tokens de luz
- **Antes:** versão mobile herdava apenas o modo escuro, com botões e cards usando sombras customizadas.
  ![Mobile antes](browser:/invocations/yhybubag/artifacts/artifacts/mobile-light.png)
- **Depois:** tema claro aplicado com botões `rounded-2xl` e cards consistentes.
  ![Mobile depois](browser:/invocations/grwpgmiv/artifacts/artifacts/after-mobile-light.png)
- **Ajuste:** atualização de `button.tsx`, `card.tsx` e cartões específicos para reforçar tokens globais.

## Checklist de Conformidade
✅ Paleta e tokens  
✅ Tipografia  
✅ Acessibilidade  
✅ Layout responsivo
