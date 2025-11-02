---
title: "Como Construí Meu Portfólio"
date: "2025-11-02"
author: "Marcelo Santos"
tags: ["portfolio", "development", "react", "vite", "typescript"]
excerpt: "Um mergulho profundo na construção do meu portfólio pessoal com React, TypeScript e Supabase."
---

Construir um portfólio pessoal é sempre um desafio empolgante. Não é apenas sobre mostrar projetos — é sobre criar uma experiência que reflita quem você é como profissional e como pessoa.

## A Stack

Para este projeto, escolhi uma stack moderna e performática:

- **Vite** como build tool (extremamente rápido!)
- **React 18** com TypeScript para type-safety
- **Tailwind CSS** + **shadcn/ui** para componentes bonitos e acessíveis
- **React Query** para gerenciamento de estado assíncrono
- **Supabase** como backend opcional com fallback para JSON estático

## Arquitetura

A arquitetura é baseada em camadas claras:

1. **Camada de Dados**: Supabase → Markdown → cv.json (fallback em cascata)
2. **Camada de Estado**: React Query com cache inteligente
3. **Camada de Apresentação**: Componentes React com Framer Motion
4. **Camada Visual**: Three.js para o fundo 3D imersivo

## Acessibilidade em Primeiro Lugar

Cada decisão de design considerou acessibilidade:

- Navegação por teclado completa
- Alt-text descritivo em todas as imagens
- Suporte a `prefers-reduced-motion`
- Contraste adequado (WCAG AA+)
- Semântica HTML5 apropriada

## Performance

Otimizações implementadas:

- **Code splitting** manual via Vite
- **Lazy loading** de rotas
- **SVG apenas** (sem rasters pesados)
- **Compression**: Gzip/Brotli no servidor
- **Caching estratégico** com React Query

## Resultado

O resultado é um site que carrega em < 2s, é totalmente acessível e funciona perfeitamente em dispositivos móveis. Mais importante: é uma expressão autêntica da minha visão de tecnologia inclusiva e design responsável.

---

*Código disponível em: [github.com/marcelo-m7/MS-Portfolio](https://github.com/marcelo-m7/MS-Portfolio)*
