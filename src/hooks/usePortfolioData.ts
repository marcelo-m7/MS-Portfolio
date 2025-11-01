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

// Fallback to cv.json when Supabase is unavailable
let cvData: Record<string, unknown> | null = null;
async function loadCvData() {
  if (cvData) return cvData;
  const response = await fetch('/data/cv.json');
  cvData = await response.json() as Record<string, unknown>;
  return cvData;
}

// Stale time: 5 minutes (data is considered fresh for 5 min)
const STALE_TIME = 5 * 60 * 1000;

// Cache time: 10 minutes (data stays in cache for 10 min after becoming stale)
const CACHE_TIME = 10 * 60 * 1000;

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
      // Return data from Supabase (no JSON fallback)
      return dbData;
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
      // Return data from Supabase (no JSON fallback)
      return dbData;
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
      // Return data from Supabase (no JSON fallback)
      return dbData;
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
      // Return data from Supabase (no JSON fallback)
      return dbData;
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
      // Return data from Supabase (no JSON fallback)
      return dbData;
    },
    enabled: !!slug,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch all thoughts (blog posts)
 */
export function useThoughts() {
  return useQuery({
    queryKey: ['thoughts'],
    queryFn: async () => {
      const dbData = await fetchThoughts();
      if (dbData) return dbData;
      
      // Fallback to cv.json
      const cv = await loadCvData();
      return cv.thoughts || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

/**
 * Hook to fetch a single thought by slug
 */
export function useThought(slug: string | undefined) {
  return useQuery({
    queryKey: ['thought', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const dbData = await fetchThoughtBySlug(slug);
      if (dbData) return dbData;
      
      // Fallback to cv.json
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
