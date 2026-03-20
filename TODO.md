# TODO

## Estado atual
- Home modularizada com code splitting por seções, hero otimizado e highlights dinâmicos do GitHub.
- Background 3D agora respeita capacidade do dispositivo e `prefers-reduced-motion`, com fallback estático automático.
- SEO técnico centralizado por hook, metadados base atualizados e configurações de GitHub/Supabase concentradas.
- Projeto segue com fallback resiliente para `cv.json` e conteúdo local quando APIs externas falham.

## O que foi concluído
- Lazy loading aplicado às seções pesadas da Home e ao background 3D.
- Redução de custo visual do `Galaxy` com densidade, velocidade e interações adaptativas.
- Integração dinâmica com GitHub API adicionada com preferência por GraphQL e fallback REST/local.
- Criação de `src/config/site.ts` para remover hardcodes centrais de branding e endpoints.
- Hook `useSeoMetadata` criado para title, description, canonical, Open Graph e Twitter Cards.
- Documentação operacional para agentes atualizada.

## Pendências críticas
- Revisar `src/main.tsx` e `src/App.tsx` para eliminar dupla composição de `QueryProvider` sem regressão.
- Medir Core Web Vitals reais em produção (LCP, CLS e INP) com telemetria persistida.
- Definir política segura para uso de token GitHub em produção e limites de rate limit.

## Pendências importantes
- Migrar mais páginas para seções/componentes reutilizáveis (`About`, `Contact`, detalhes de projeto).
- Evoluir cards e layouts compartilhados visando futura extração para `@monynha/ui`.
- Estruturar fetch dinâmico de contribuições GitHub e atividade recente por usuário/org.
- Preparar estratégia híbrida Supabase + cache edge para conteúdo editorial.

## Melhorias incrementais
- Adicionar placeholders visuais específicos por seção além dos skeletons genéricos.
- Incluir revalidação inteligente por visibilidade/tempo para dados externos.
- Criar feature flag para desligar completamente 3D por ambiente.
- Padronizar cópia institucional Monynha nos detalhes de projetos e páginas internas.

## Bugs e limitações
- Os testes passam, mas parte do suite emite erros de rede `ENETUNREACH` ao tocar serviços externos de tradução durante o ambiente isolado.
- `vendor-three` continua grande, embora fique lazy-loaded e fora do caminho crítico inicial.
- A integração GitHub GraphQL depende de `VITE_GITHUB_TOKEN`; sem token, a app cai para REST público/local fallback.

## Próximos passos
1. Instrumentar métricas reais de Web Vitals e exibir dashboard interno.
2. Modularizar páginas restantes em `sections/` e `services/` dedicados.
3. Criar camada `data adapters` para GitHub, Supabase e `cv.json` com contrato unificado.
4. Adicionar testes para os novos fluxos de SEO e GitHub highlights.

## Ideias futuras
- Geração estática parcial de conteúdo de portfólio a partir de pipelines Monynha.
- Personalização da Home por idioma/segmento profissional.
- Feed vivo de changelog técnico e posts da Monynha.
- Snapshot visual automatizado para regressão de UI.

## Observações para o próximo agente
- Não reative animações 3D pesadas sem fallback e sem medir impacto de LCP/INP.
- Sempre usar `src/config/site.ts` para branding, URLs e integrações novas.
- Se tocar dados dinâmicos, preservar fallback local e comportamento offline/degradado.
- Atualize este arquivo ao concluir qualquer melhoria estrutural, técnica ou de produto.
