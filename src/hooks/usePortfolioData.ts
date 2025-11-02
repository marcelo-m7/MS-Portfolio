/**
 * Custom React Query Hooks for Portfolio Data
 * 
 * Type-safe hooks for fetching portfolio data with caching, loading states, and error handling.
 * Automatically falls back to cv.json if Supabase is unavailable.
 * 
 * Usage:
 *   const { data: projects, isLoading, error } = useProjects();
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchProjects,
  fetchProjectBySlug,
  fetchArtworks,
  fetchArtworkBySlug,
  fetchSeries,
  fetchSeriesBySlug,
  fetchThoughts,
  fetchThoughtBySlug,
  fetchProfile,
  fetchContact,
  fetchExperience,
  fetchSkills,
  fetchTechnologies,
} from '@/lib/api/queries';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/markdownLoader';

// Shared cvData cache - only load once across all hooks
let cvDataCache: Record<string, unknown> | null = null;
let cvDataPromise: Promise<Record<string, unknown>> | null = null;

async function loadCvData(): Promise<Record<string, unknown>> {
  // Return cached data if available
  if (cvDataCache) return cvDataCache;
  
  // Return existing promise if already loading
  if (cvDataPromise) return cvDataPromise;
  
  // Create new loading promise
  cvDataPromise = fetch('/data/cv.json')
    .then(response => response.json())
    .then((data: unknown) => {
      cvDataCache = data as Record<string, unknown>;
      cvDataPromise = null;
      return cvDataCache;
    })
    .catch(error => {
      cvDataPromise = null;
      throw error;
    });
  
  return cvDataPromise;
}

// Stale time: 15 minutes (data is considered fresh for 15 min)
// Portfolio content changes infrequently, so longer cache improves performance
const STALE_TIME = 15 * 60 * 1000;

// Cache time: 30 minutes (data stays in cache for 30 min after becoming stale)
// Reduces API calls and improves loading speed for repeat visits
const CACHE_TIME = 30 * 60 * 1000;

/**
 * Hook to fetch all projects with tech stack
 * Falls back to cv.json if database is unavailable
 */
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const dbData = await fetchProjects();
      if (dbData) return dbData;
      
      // Fallback to cv.json
      const cv = await loadCvData();
      return cv.projects || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch a single project by slug
 */
export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const dbData = await fetchProjectBySlug(slug);
      if (dbData) return dbData;

      // Fallback to cv.json
      const cv = await loadCvData();
      const projects = (cv.projects as Array<Record<string, unknown>>) || [];
      return projects.find((p) => p.slug === slug) || null;
    },
    enabled: !!slug,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch all artworks
 */
export function useArtworks() {
  return useQuery({
    queryKey: ['artworks'],
    queryFn: async () => {
      const dbData = await fetchArtworks();
      if (dbData) return dbData;
      
      // Fallback to cv.json
      const cv = await loadCvData();
      return cv.artworks || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch a single artwork by slug
 */
export function useArtwork(slug: string | undefined) {
  return useQuery({
    queryKey: ['artwork', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const dbData = await fetchArtworkBySlug(slug);
      if (dbData) return dbData;

      // Fallback to cv.json
      const cv = await loadCvData();
      const artworks = (cv.artworks as Array<Record<string, unknown>>) || [];
      return artworks.find((a) => a.slug === slug) || null;
    },
    enabled: !!slug,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch all series
 */
export function useSeries() {
  return useQuery({
    queryKey: ['series'],
    queryFn: async () => {
      const dbData = await fetchSeries();
      if (dbData) return dbData;

      // Fallback to cv.json
      const cv = await loadCvData();
      return cv.series || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch a single series by slug
 */
export function useSeriesDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ['series', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const dbData = await fetchSeriesBySlug(slug);
      if (dbData) return dbData;

      // Fallback to cv.json
      const cv = await loadCvData();
      const series = (cv.series as Array<Record<string, unknown>>) || [];
      return series.find((s) => s.slug === slug) || null;
    },
    enabled: !!slug,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch all thoughts (blog posts)
 * Now loads from markdown files instead of database/cv.json
 */
export function useThoughts() {
  return useQuery({
    queryKey: ['thoughts'],
    queryFn: async () => {
      // Try database first (for backwards compatibility)
      const dbData = await fetchThoughts();
      if (dbData) return dbData;
      
      // Load from markdown files
      const markdownPosts = await getAllBlogPosts();
      if (markdownPosts && markdownPosts.length > 0) return markdownPosts;
      
      // Final fallback to cv.json
      const cv = await loadCvData();
      return cv.thoughts || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch a single thought by slug
 * Now loads from markdown files instead of database/cv.json
 */
export function useThought(slug: string | undefined) {
  return useQuery({
    queryKey: ['thought', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      // Try database first (for backwards compatibility)
      const dbData = await fetchThoughtBySlug(slug);
      if (dbData) return dbData;
      
      // Load from markdown file
      const markdownPost = await getBlogPostBySlug(slug);
      if (markdownPost) return markdownPost;
      
      // Final fallback to cv.json
      const cv = await loadCvData();
      const thoughts = (cv.thoughts as Array<Record<string, unknown>>) || [];
      return thoughts.find((t) => t.slug === slug) || null;
    },
    enabled: !!slug,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch profile data
 */
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const dbData = await fetchProfile();
      if (dbData) return dbData;
      
      // Fallback to cv.json
      const cv = await loadCvData();
      return cv.profile || null;
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch contact info
 */
export function useContact() {
  return useQuery({
    queryKey: ['contact'],
    queryFn: async () => {
      const dbData = await fetchContact();
      // Return data from Supabase (no JSON fallback)
      return dbData;
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch experience with highlights
 */
export function useExperience() {
  return useQuery({
    queryKey: ['experience'],
    queryFn: async () => {
      const dbData = await fetchExperience();
      if (dbData) return dbData;
      
      // Fallback to cv.json
      const cv = await loadCvData();
      return cv.experience || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch skills
 */
export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const dbData = await fetchSkills();
      if (dbData) return dbData;
      
      // Fallback to cv.json
      const cv = await loadCvData();
      return cv.skills || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch all technologies
 */
export function useTechnologies() {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: fetchTechnologies,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}
