# TODO

## Estado atual
- O portfólio agora carrega a camada visual de fundo com fallback estático por padrão e só ativa o 3D interativo quando o dispositivo suporta a experiência.
- A home passou a expor dados dinâmicos do GitHub com preferência por GraphQL, fallback para REST público e fallback final para `cv.json`.
- SEO técnico foi centralizado em um utilitário de metadata e aplicado nas principais páginas críticas.
- A arquitetura está mais preparada para evolução contínua com novas pastas de `config/`, `services/`, `components/background/` e `components/sections/`.

## O que foi concluído
- Fallback visual estático para background e redução automática de custo para dispositivos fracos.
- Lazy loading adicional para a secção dinâmica do GitHub e desacoplamento do background 3D.
- Otimizações na preview 3D com geometria/luzes mais leves e modo estático para reduced-motion ou hardware fraco.
- Nova integração GitHub com priorização de GraphQL e fallback local resiliente.
- Centralização de metadata SEO/Open Graph/Twitter/canonical.
- Remoção de duplicidade de `QueryProvider` para evitar arquitetura confusa.
- Atualização do branding com assinatura elegante “Marcelo Santos / Monynha Softwares”.
- Documentação operacional atualizada para próximos agentes.

## Pendências críticas
- Adicionar testes específicos para `useDeviceCapabilities`, `useDocumentMetadata` e fluxo GitHub GraphQL/REST/fallback.
- Medir LCP/CLS/INP em ambiente real de produção e registrar baseline.
- Revisar imagens/miniaturas do portfólio para garantir formatos ainda mais leves (AVIF/WebP quando aplicável).

## Pendências importantes
- Extrair cards/layout primitives compartilháveis para futura migração para `@monynha/ui`.
- Estruturar conteúdo dinâmico adicional via Supabase para hero/about/contact sem depender tanto de `cv.json`.
- Criar uma camada de feature flags/documentação de env para APIs externas.
- Aplicar o utilitário de metadata também às demais rotas secundárias.

## Melhorias incrementais
- Adicionar skeletons dedicados para a secção GitHub e secções lazy-loaded adicionais.
- Introduzir analytics/observabilidade de Web Vitals por rota.
- Criar snapshots visuais/Playwright para homepage, portfolio e detail pages.
- Evoluir i18n de labels ainda estáticas nas novas secções.

## Bugs e limitações
- GitHub GraphQL depende de `VITE_GITHUB_TOKEN`; sem token a app usa REST e depois fallback local.
- O preview 3D ainda existe, mas foi intencionalmente limitado para preservar performance em hardware modesto.
- Algumas páginas continuam com copy parcialmente estática em PT e podem exigir refinamento multilíngue.
- Não foi possível gerar screenshot automatizado nesta sessão porque a ferramenta de browser/screenshot não estava disponível.

## Próximos passos
1. Criar testes para a integração GitHub e metadata.
2. Medir bundle/chunks e revisar novos pontos de split por rota/feature.
3. Planejar extração progressiva de componentes reutilizáveis para `@monynha/ui`.
4. Definir contrato de conteúdo dinâmico entre GitHub, Supabase e fallback local.

## Ideias futuras
- Dashboard editorial para gerir portfolio, séries e pensamentos via Supabase.
- Página “Now / Building” com dados automáticos de GitHub e Monynha.
- Showcase de case studies com métricas técnicas e storytelling de produto.
- Dark/light branded themes por iniciativa do ecossistema Monynha.

## Observações para o próximo agente
- Preserve a regra: 3D só com fallback e validação de capacidade do dispositivo.
- Evite reintroduzir providers duplicados, imports pesados no bundle inicial ou APIs hardcoded fora de `config/`.
- Se tocar em branding, mantenha equilíbrio entre identidade pessoal e Monynha Softwares.
- Sempre atualize este arquivo ao fechar uma rodada relevante de trabalho.

## Prioridades
### Crítica
- Cobertura de testes das novas camadas de performance/metadata/GitHub.
- Medição real de Core Web Vitals em produção.

### Importante
- Mais conteúdo dinâmico vindo de APIs/Supabase.
- Extração progressiva de componentes compartilháveis.

### Incremental
- Melhorias finas de copy, animação leve e observabilidade.
