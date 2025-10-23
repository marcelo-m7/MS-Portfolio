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
import cvData from '../../public/data/cv.json';

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
      
      // Fallback to cv.json if database is unavailable
      if (!dbData) {
        console.info('Using cv.json fallback for projects');
        return cvData.projects.map((project) => ({
          ...project,
          technologies: project.stack.map((name) => ({ name, category: null })),
          id: project.slug, // Use slug as ID for cv.json data
          full_description: project.fullDescription,
          repo_url: project.repoUrl,
          display_order: null,
          created_at: null,
          updated_at: null,
        }));
      }
      
      return dbData;
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info(`Using cv.json fallback for project: ${slug}`);
        const project = cvData.projects.find((p) => p.slug === slug);
        if (!project) return null;
        
        return {
          ...project,
          technologies: project.stack.map((name) => ({ name, category: null })),
          id: project.slug,
          full_description: project.fullDescription,
          repo_url: project.repoUrl,
          display_order: null,
          created_at: null,
          updated_at: null,
        };
      }
      
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info('Using cv.json fallback for artworks');
        return cvData.artworks.map((artwork) => ({
          ...artwork,
          id: artwork.slug,
          media: artwork.media.map((url, idx) => ({ media_url: url, display_order: idx + 1 })),
          url_3d: artwork.url3d || null,
          display_order: null,
          created_at: null,
          updated_at: null,
        }));
      }
      
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info(`Using cv.json fallback for artwork: ${slug}`);
        const artwork = cvData.artworks.find((a) => a.slug === slug);
        if (!artwork) return null;
        
        return {
          ...artwork,
          id: artwork.slug,
          media: artwork.media.map((url, idx) => ({ media_url: url, display_order: idx + 1 })),
          url_3d: artwork.url3d || null,
          display_order: null,
          created_at: null,
          updated_at: null,
        };
      }
      
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info('Using cv.json fallback for series');
        return cvData.series.map((s) => ({
          ...s,
          id: s.slug,
          works: s.works.map((workSlug, idx) => ({
            work_slug: workSlug,
            work_type: 'project', // Default type
            display_order: idx + 1,
          })),
          display_order: null,
          created_at: null,
          updated_at: null,
        }));
      }
      
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info(`Using cv.json fallback for series: ${slug}`);
        const series = cvData.series.find((s) => s.slug === slug);
        if (!series) return null;
        
        return {
          ...series,
          id: series.slug,
          works: series.works.map((workSlug, idx) => ({
            work_slug: workSlug,
            work_type: 'project',
            display_order: idx + 1,
          })),
          display_order: null,
          created_at: null,
          updated_at: null,
        };
      }
      
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info('Using cv.json fallback for thoughts');
        return cvData.thoughts.map((thought) => ({
          ...thought,
          id: thought.slug,
          display_order: null,
          created_at: null,
          updated_at: null,
        }));
      }
      
      return dbData;
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info(`Using cv.json fallback for thought: ${slug}`);
        const thought = cvData.thoughts.find((t) => t.slug === slug);
        if (!thought) return null;
        
        return {
          ...thought,
          id: thought.slug,
          display_order: null,
          created_at: null,
          updated_at: null,
        };
      }
      
      return dbData;
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info('Using cv.json fallback for profile');
        return {
          id: 'profile',
          name: cvData.profile.name,
          headline: cvData.profile.headline,
          location: cvData.profile.location,
          bio: cvData.profile.bio,
          avatar: cvData.profile.avatar,
          lang_default: cvData.langDefault,
          created_at: null,
          updated_at: null,
        };
      }
      
      return dbData;
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info('Using cv.json fallback for contact');
        return {
          id: 'contact',
          email: cvData.contact.email,
          availability: cvData.contact.availability,
          note: cvData.contact.note,
          success_message: cvData.contact.successMessage,
          error_message: cvData.contact.errorMessage,
          created_at: null,
          updated_at: null,
        };
      }
      
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info('Using cv.json fallback for experience');
        return cvData.experience.map((exp, idx) => ({
          id: `exp-${idx}`,
          role: exp.role,
          org: exp.org,
          start_date: exp.start,
          end_date: exp.end,
          location: exp.location,
          highlights: exp.highlights,
          display_order: idx + 1,
          created_at: null,
          updated_at: null,
        }));
      }
      
      return dbData;
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
      
      // Fallback to cv.json
      if (!dbData) {
        console.info('Using cv.json fallback for skills');
        return cvData.skills.map((skill, idx) => ({
          id: `skill-${idx}`,
          name: skill.name,
          category: skill.category,
          level: skill.level,
          display_order: idx + 1,
          created_at: null,
          updated_at: null,
        }));
      }
      
      return dbData;
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
