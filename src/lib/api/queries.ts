/**
 * API Query Functions for Supabase Database
 * 
 * Type-safe query functions for fetching portfolio data from Supabase.
 * All functions gracefully handle missing Supabase client (returns null).
 * 
 * Usage:
 *   const projects = await fetchProjects();
 *   if (projects) { ... }
 */

import { supabase, PORTFOLIO_SCHEMA } from '../supabaseClient';
import type { Database } from '@/types/database.types';

// Type aliases for cleaner code
type Tables = Database['portfolio']['Tables'];
type Project = Tables['projects']['Row'];
type ProjectWithStack = Project & {
  technologies: Array<{ name: string; category: string | null }>;
};
type Artwork = Tables['artworks']['Row'] & {
  media: Array<{ media_url: string; display_order: number }>;
  materials: Array<{ material: string; display_order: number }>;
};
type Series = Tables['series']['Row'] & {
  works: Array<{ work_slug: string; work_type: string; display_order: number | null }>;
};
type Thought = Tables['thoughts']['Row'] & {
  tags: string[];
};
type Experience = Tables['experience']['Row'] & {
  highlights: string[];
};

/**
 * Fetch all projects with their technology stack
 */
export async function fetchProjects(): Promise<ProjectWithStack[] | null> {
  if (!supabase) return null;

  try {
    // Fetch projects
    const { data: projects, error: projectsError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (projectsError) throw projectsError;
    if (!projects) return null;

    // Fetch technology relationships for all projects
    const { data: stackData, error: stackError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('project_stack')
      .select(`
        project_id,
        technologies (name, category)
      `)
      .order('display_order', { ascending: true });

    if (stackError) throw stackError;

    // Map technologies to projects
    const projectsWithStack: ProjectWithStack[] = projects.map((project) => {
      const projectTechs = stackData
        ?.filter((s) => s.project_id === project.id)
        .map((s) => s.technologies)
        .filter((t): t is { name: string; category: string | null } => t !== null) || [];

      return {
        ...project,
        technologies: projectTechs,
      };
    });

    return projectsWithStack;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return null;
  }
}

/**
 * Fetch a single project by slug with technologies
 */
export async function fetchProjectBySlug(slug: string): Promise<ProjectWithStack | null> {
  if (!supabase) return null;

  try {
    const { data: project, error: projectError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (projectError) throw projectError;
    if (!project) return null;

    // Fetch technologies for this project
    const { data: stackData, error: stackError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('project_stack')
      .select(`
        technologies (name, category)
      `)
      .eq('project_id', project.id)
      .order('display_order', { ascending: true});

    if (stackError) throw stackError;

    const technologies = stackData
      ?.map((s) => s.technologies)
      .filter((t): t is { name: string; category: string | null } => t !== null) || [];

    return {
      ...project,
      technologies,
    };
  } catch (error) {
    console.error(`Error fetching project ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all artworks with media and materials
 */
export async function fetchArtworks(): Promise<Artwork[] | null> {
  if (!supabase) return null;

  try {
    const { data: artworks, error: artworksError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('artworks')
      .select('*')
      .order('display_order', { ascending: true });

    if (artworksError) throw artworksError;
    if (!artworks) return null;

    // Fetch media for all artworks
    const { data: mediaData, error: mediaError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('artwork_media')
      .select('*')
      .order('display_order', { ascending: true });

    if (mediaError) throw mediaError;

    // Fetch materials for all artworks
    const { data: materialsData, error: materialsError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('artwork_materials')
      .select('*')
      .order('display_order', { ascending: true });

    if (materialsError) throw materialsError;

    // Map media and materials to artworks
    const artworksWithDetails: Artwork[] = artworks.map((artwork) => ({
      ...artwork,
      media: mediaData?.filter((m) => m.artwork_id === artwork.id) || [],
      materials: materialsData?.filter((m) => m.artwork_id === artwork.id) || [],
    }));

    return artworksWithDetails;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return null;
  }
}

/**
 * Fetch artwork by slug with media and materials
 */
export async function fetchArtworkBySlug(slug: string): Promise<Artwork | null> {
  if (!supabase) return null;

  try {
    const { data: artwork, error: artworkError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('artworks')
      .select('*')
      .eq('slug', slug)
      .single();

    if (artworkError) throw artworkError;
    if (!artwork) return null;

    // Fetch media
    const { data: mediaData, error: mediaError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('artwork_media')
      .select('*')
      .eq('artwork_id', artwork.id)
      .order('display_order', { ascending: true });

    if (mediaError) throw mediaError;

    // Fetch materials
    const { data: materialsData, error: materialsError} = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('artwork_materials')
      .select('*')
      .eq('artwork_id', artwork.id)
      .order('display_order', { ascending: true });

    if (materialsError) throw materialsError;

    return {
      ...artwork,
      media: mediaData || [],
      materials: materialsData || [],
    };
  } catch (error) {
    console.error(`Error fetching artwork ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all series with their works
 */
export async function fetchSeries(): Promise<Series[] | null> {
  if (!supabase) return null;

  try {
    const { data: series, error: seriesError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('series')
      .select('*')
      .order('display_order', { ascending: true });

    if (seriesError) throw seriesError;
    if (!series) return null;

    // Fetch works for all series
    const { data: worksData, error: worksError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('series_works')
      .select('*')
      .order('display_order', { ascending: true });

    if (worksError) throw worksError;

    // Map works to series
    const seriesWithWorks: Series[] = series.map((s) => ({
      ...s,
      works: worksData?.filter((w) => w.series_id === s.id) || [],
    }));

    return seriesWithWorks;
  } catch (error) {
    console.error('Error fetching series:', error);
    return null;
  }
}

/**
 * Fetch series by slug with works
 */
export async function fetchSeriesBySlug(slug: string): Promise<Series | null> {
  if (!supabase) return null;

  try {
    const { data: series, error: seriesError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('series')
      .select('*')
      .eq('slug', slug)
      .single();

    if (seriesError) throw seriesError;
    if (!series) return null;

    // Fetch works
    const { data: worksData, error: worksError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('series_works')
      .select('*')
      .eq('series_id', series.id)
      .order('display_order', { ascending: true });

    if (worksError) throw worksError;

    return {
      ...series,
      works: worksData || [],
    };
  } catch (error) {
    console.error(`Error fetching series ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all thoughts with tags
 */
export async function fetchThoughts(): Promise<Thought[] | null> {
  if (!supabase) return null;

  try {
    const { data: thoughts, error: thoughtsError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('thoughts')
      .select('*')
      .order('date', { ascending: false });

    if (thoughtsError) throw thoughtsError;
    if (!thoughts) return null;

    // Fetch tags for all thoughts
    const { data: tagsData, error: tagsError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('thought_tags')
      .select('*');

    if (tagsError) throw tagsError;

    // Map tags to thoughts
    const thoughtsWithTags: Thought[] = thoughts.map((thought) => ({
      ...thought,
      tags: tagsData?.filter((t) => t.thought_id === thought.id).map((t) => t.tag) || [],
    }));

    return thoughtsWithTags;
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    return null;
  }
}

/**
 * Fetch thought by slug with tags
 */
export async function fetchThoughtBySlug(slug: string): Promise<Thought | null> {
  if (!supabase) return null;

  try {
    const { data: thought, error: thoughtError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('thoughts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (thoughtError) throw thoughtError;
    if (!thought) return null;

    // Fetch tags
    const { data: tagsData, error: tagsError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('thought_tags')
      .select('*')
      .eq('thought_id', thought.id);

    if (tagsError) throw tagsError;

    return {
      ...thought,
      tags: tagsData?.map((t) => t.tag) || [],
    };
  } catch (error) {
    console.error(`Error fetching thought ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch profile (singleton)
 */
export async function fetchProfile() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('profile')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Fetch contact info (singleton)
 */
export async function fetchContact() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('contact')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    return null;
  }
}

/**
 * Fetch all experience with highlights
 */
export async function fetchExperience(): Promise<Experience[] | null> {
  if (!supabase) return null;

  try {
    const { data: experience, error: expError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('experience')
      .select('*')
      .order('display_order', { ascending: true });

    if (expError) throw expError;
    if (!experience) return null;

    // Fetch highlights
    const { data: highlightsData, error: highlightsError } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('experience_highlights')
      .select('*')
      .order('display_order', { ascending: true });

    if (highlightsError) throw highlightsError;

    // Map highlights to experience
    const experienceWithHighlights: Experience[] = experience.map((exp) => ({
      ...exp,
      highlights: highlightsData?.filter((h) => h.experience_id === exp.id).map((h) => h.highlight) || [],
    }));

    return experienceWithHighlights;
  } catch (error) {
    console.error('Error fetching experience:', error);
    return null;
  }
}

/**
 * Fetch all skills
 */
export async function fetchSkills() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    return null;
  }
}

/**
 * Fetch all technologies
 */
export async function fetchTechnologies() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .schema(PORTFOLIO_SCHEMA)
      .from('technologies')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return null;
  }
}
