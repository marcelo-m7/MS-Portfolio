/**
 * Tests for Markdown Blog Loader
 */
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { getAllBlogPosts, getBlogPostBySlug } from '../../src/lib/markdownLoader'

describe('markdownLoader', () => {
  beforeAll(() => {
    global.fetch = vi.fn((url: string) => {
      const slug = url.split('/').pop()?.replace('.md', '')
      if (slug === 'design-tecnologia-inclusiva') {
        return Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(`---
title: "Design e Tecnologia Inclusiva"
date: "2025-01-17"
author: "Marcelo Santos"
tags: ["Acessibilidade", "Design"]
excerpt: "A tecnologia é mais humana quando é feita para todas as pessoas."
---

Content here.`),
        } as Response)
      }
      if (slug === 'por-tras-da-monynha') {
        return Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(`---
title: "Por trás da Monynha"
date: "2025-02-02"
author: "Marcelo Santos"
tags: ["Cultura", "Comunidade"]
excerpt: "Mais do que software — um movimento de orgulho."
---

More content.`),
        } as Response)
      }
      return Promise.resolve({ ok: false, status: 404 } as Response)
    }) as unknown as typeof fetch
  })

  it('should fetch and parse all blog posts', async () => {
    const posts = await getAllBlogPosts()
    expect(posts).toHaveLength(2)
    expect(posts[0].title).toBeDefined()
    expect(posts[0].date).toBeDefined()
    expect(posts[0].author).toBeDefined()
    expect(posts[0].tags).toBeInstanceOf(Array)
    expect(posts[0].excerpt).toBeDefined()
    expect(posts[0].body).toBeDefined()
  })

  it('should sort posts by date (newest first)', async () => {
    const posts = await getAllBlogPosts()
    const dates = posts.map((p) => new Date(p.date).getTime())
    expect(dates[0]).toBeGreaterThanOrEqual(dates[1])
  })

  it('should fetch a single blog post by slug', async () => {
    const post = await getBlogPostBySlug('design-tecnologia-inclusiva')
    expect(post).not.toBeNull()
    expect(post?.title).toBe('Design e Tecnologia Inclusiva')
    expect(post?.slug).toBe('design-tecnologia-inclusiva')
    expect(post?.tags).toContain('Acessibilidade')
  })

  it('should return null for non-existent slug', async () => {
    const post = await getBlogPostBySlug('non-existent-post')
    expect(post).toBeNull()
  })

  it('should include both body and content properties', async () => {
    const post = await getBlogPostBySlug('design-tecnologia-inclusiva')
    expect(post?.body).toBeDefined()
    expect(post?.content).toBeDefined()
    expect(post?.body).toBe(post?.content)
  })
})
