# Auditoria Visual — Marcelo Portigolio

## Sumário
- Erros encontrados
- Correções aplicadas
- Prints de antes/depois
- Checklist de Conformidade

## Erros encontrados
- Ausência de tema claro: tokens HSL estavam definidos apenas para um modo escuro, impossibilitando a alternância e deixando o botão de acessibilidade ausente na navegação.
- Componentes shadcn/ui (Buttons, Cards) com `rounded-md`/`rounded-full` e sombras exageradas, destoando da identidade visual especificada (`rounded-2xl`, `shadow-md`).
- Utilitário `glass` e cartões secundários usando bordas inconsistentes e sombras profundas, gerando contraste insuficiente em superfícies claras.

## Correções aplicadas
- Implementado `ThemeProvider` (next-themes) e toggle acessível no Navbar, além de tokens HSL completos para modo claro/escuro com fontes base normalizadas (`font-sans`, `font-display`).
- Atualizados componentes shadcn (Buttons, Cards) para `rounded-2xl` + `shadow-md` por padrão e normalizados botões/link cards para remover `rounded-full` customizado.
- Refatorado utilitário `glass` e superfícies principais (Home, Portfolio, About, Contact, Thoughts) para usar `rounded-2xl`, sombras suaves e chips/pílulas com contrastes dentro da paleta.

## Prints e Descrições

### Home – tema claro indisponível (antes)
Sem alternância de tema, a paleta permanecia escura e não atendia à diretriz de acessibilidade para tema claro.
![Home desktop sem tema claro (antes)](browser:/invocations/hffbbdfy/artifacts/artifacts/home-desktop-light-before.png)

### Home – tema claro implementado (depois)
Toggle visível no Navbar, tokens claros com contraste adequado entre texto e fundo.
![Home desktop tema claro (depois)](browser:/invocations/zqstetrv/artifacts/artifacts/home-desktop-light-after.png)

### Home – mobile dark (antes)
Botões arredondados excessivamente e sem consistência de sombras.
![Home mobile dark (antes)](browser:/invocations/hffbbdfy/artifacts/artifacts/home-mobile-dark-before.png)

### Home – mobile dark revisado (depois)
Botões `rounded-2xl` com `shadow-md` e toggle funcional.
![Home mobile dark (depois)](browser:/invocations/zqstetrv/artifacts/artifacts/home-mobile-dark-after.png)

## Checklist de Conformidade
✅ Paleta e tokens
✅ Tipografia
✅ Acessibilidade
✅ Layout responsivo
