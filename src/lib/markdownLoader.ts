/**
 * Markdown Blog Loader - Client-Side
 * 
 * Loads and parses markdown files from the public/content/blog directory.
 * Works in the browser by fetching markdown files at runtime.
 * 
 * This replaces the cv.json "thoughts" data source.
 */

import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  body: string;
  content?: string; // Alias for body to maintain compatibility
}

interface BlogPostFrontmatter {
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
}

// Blog post slugs (file names without .md extension)
// NOTE: This list must be manually maintained for client-side operation.
// TODO: Consider implementing a build-time script to auto-generate this list
// from the filesystem for better maintainability.
const BLOG_POSTS = [
  'design-tecnologia-inclusiva',
  'por-tras-da-monynha',
  'como-construi-meu-portfolio',
  'react-query-gerenciamento-estado',
];

/**
 * Fetch and parse a single markdown file
 */
async function fetchMarkdownPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/content/blog/${slug}.md`);
    
    if (!response.ok) {
      console.error(`Failed to fetch blog post: ${slug}`);
      return null;
    }
    
    const markdownContent = await response.text();
    const { data, content } = matter(markdownContent);
    const frontmatter = data as BlogPostFrontmatter;
    
    return {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      author: frontmatter.author,
      tags: frontmatter.tags || [],
      excerpt: frontmatter.excerpt,
      body: content,
      content: content, // Alias for compatibility
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all blog posts (sorted by date, newest first)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await Promise.all(
    BLOG_POSTS.map(slug => fetchMarkdownPost(slug))
  );
  
  // Filter out null values and sort by date (newest first)
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return fetchMarkdownPost(slug);
}
