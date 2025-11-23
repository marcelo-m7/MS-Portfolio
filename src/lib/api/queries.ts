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

import { supabase } from '../supabaseClient';
import { logger } from '../logger';
import type { Tables as DBTables } from '@/types/database.types';

// Row type aliases from public views (generated types)
type Project = DBTables<'projects'>;
type ProjectStack = DBTables<'project_stack'>;
type Technology = DBTables<'technologies'>;
type ProjectWithStack = Project & {
  technologies: Array<{ name: string | null; category: string | null }>;
};
type ArtworkRow = DBTables<'artworks'>;
type ArtworkMedia = DBTables<'artwork_media'>;
type ArtworkMaterial = DBTables<'artwork_materials'>;
type Artwork = ArtworkRow & {
  media: Array<ArtworkMedia>;
  materials: Array<ArtworkMaterial>;
};
type SeriesRow = DBTables<'series'>;
type SeriesWork = DBTables<'series_works'>;
type Series = SeriesRow & {
  works: Array<SeriesWork>;
};
type ThoughtRow = DBTables<'thoughts'>;
type ThoughtTag = DBTables<'thought_tags'>;
type Thought = ThoughtRow & {
  tags: string[];
};
type ExperienceRow = DBTables<'experience'>;
type ExperienceHighlight = DBTables<'experience_highlights'>;
type Experience = ExperienceRow & {
  highlights: string[];
};

// Small helper for filtering null/undefined items
const notNull = <T>(v: T | null | undefined): v is T => v != null;

/**
 * Fetch all projects with their technology stack
 */
export async function fetchProjects(): Promise<ProjectWithStack[] | null> {
  if (!supabase) return null;

  try {
    // Fetch projects (using portfolio schema configured in client)
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (projectsError) throw projectsError;
    if (!projects) return null;

    // Fetch project_stack and technologies separately (views may not have FKs for embedded selects)
    const [{ data: stackData, error: stackError }, { data: techData, error: techError }] = await Promise.all([
      supabase.from('project_stack').select('*').order('display_order', { ascending: true }),
      supabase.from('technologies').select('*'),
    ] as const);

    if (stackError) throw stackError;
    if (techError) throw techError;

    // Map technologies to projects
    const projectsWithStack: ProjectWithStack[] = (projects ?? [])
      .filter((p): p is Project => !!p && !!p.id)
      .map((project) => {
        const techs = (stackData ?? [])
          .filter((s: ProjectStack) => s?.project_id === project.id)
          .map((s) => s?.technology_id)
          .filter(notNull)
          .map((tid) => (techData ?? [])?.find((t: Technology) => t?.id === tid))
          .filter(notNull)
          .map((t) => ({ name: t.name ?? null, category: t.category ?? null }));

        return {
          ...project,
          technologies: techs,
        };
      });

    return projectsWithStack;
  } catch (error) {
    logger.error('Error fetching projects', { component: 'api/queries' }, error);
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
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (projectError) throw projectError;
    if (!project) return null;

    // Fetch technologies for this project
    const [{ data: stackData, error: stackError }, { data: techData, error: techError }] = await Promise.all([
      supabase.from('project_stack').select('*').eq('project_id', project.id).order('display_order', { ascending: true }),
      supabase.from('technologies').select('*'),
    ] as const);

    if (stackError) throw stackError;
    if (techError) throw techError;

    const technologies = (stackData ?? [])
      .map((s: ProjectStack) => (techData ?? [])?.find((t: Technology) => t?.id === s?.technology_id))
      .filter(notNull)
      .map((t) => ({ name: t.name ?? null, category: t.category ?? null }));

    return {
      ...project,
      technologies,
    };
  } catch (error) {
    logger.error(`Error fetching project ${slug}`, { component: 'api/queries' }, error);
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
      .from('artworks')
      .select('*')
      .order('display_order', { ascending: true});

    if (artworksError) throw artworksError;
    if (!artworks) return null;

    // Fetch media for all artworks
    const { data: mediaData, error: mediaError } = await supabase
      .from('artwork_media')
      .select('*')
      .order('display_order', { ascending: true });

    if (mediaError) throw mediaError;

    // Fetch materials for all artworks
    const { data: materialsData, error: materialsError } = await supabase
      .from('artwork_materials')
      .select('*')
      .order('display_order', { ascending: true});

    if (materialsError) throw materialsError;

    // Map media and materials to artworks
    const artworksWithDetails: Artwork[] = (artworks ?? [])
      .filter((a): a is ArtworkRow => !!a && !!a.id)
      .map((artwork) => ({
        ...artwork,
        media: (mediaData ?? []).filter((m: ArtworkMedia) => m?.artwork_id === artwork.id),
        materials: (materialsData ?? []).filter((m: ArtworkMaterial) => m?.artwork_id === artwork.id),
      }));

    return artworksWithDetails;
  } catch (error) {
    logger.error('Error fetching artworks', { component: 'api/queries' }, error);
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
      .from('artworks')
      .select('*')
      .eq('slug', slug)
      .single();

    if (artworkError) throw artworkError;
    if (!artwork) return null;

    // Fetch media
    const { data: mediaData, error: mediaError } = await supabase
      .from('artwork_media')
      .select('*')
      .eq('artwork_id', artwork.id)
      .order('display_order', { ascending: true });

    if (mediaError) throw mediaError;

    // Fetch materials
    const { data: materialsData, error: materialsError} = await supabase
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
    logger.error(`Error fetching artwork ${slug}`, { component: 'api/queries' }, error);
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
      .from('series')
      .select('*')
      .order('display_order', { ascending: true });

    if (seriesError) throw seriesError;
    if (!series) return null;

    // Fetch works for all series
    const { data: worksData, error: worksError } = await supabase
      .from('series_works')
      .select('*')
      .order('display_order', { ascending: true});

    if (worksError) throw worksError;

    // Map works to series
    const seriesWithWorks: Series[] = (series ?? [])
      .filter((s): s is SeriesRow => !!s && !!s.id)
      .map((s) => ({
        ...s,
        works: (worksData ?? []).filter((w: SeriesWork) => w?.series_id === s.id),
      }));

    return seriesWithWorks;
  } catch (error) {
    logger.error('Error fetching series', { component: 'api/queries' }, error);
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
      .from('series')
      .select('*')
      .eq('slug', slug)
      .single();

    if (seriesError) throw seriesError;
    if (!series) return null;

    // Fetch works
    const { data: worksData, error: worksError } = await supabase
      .from('series_works')
      .select('*')
      .eq('series_id', series.id)
      .order('display_order', { ascending: true});

    if (worksError) throw worksError;

    return {
      ...series,
      works: worksData || [],
    };
  } catch (error) {
    logger.error(`Error fetching series ${slug}`, { component: 'api/queries' }, error);
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
      .from('thoughts')
      .select('*')
      .order('date', { ascending: false });

    if (thoughtsError) throw thoughtsError;
    if (!thoughts) return null;

    // Fetch tags for all thoughts
    const { data: tagsData, error: tagsError } = await supabase
      .from('thought_tags')
      .select('*');

    if (tagsError) throw tagsError;

    // Map tags to thoughts
    const thoughtsWithTags: Thought[] = (thoughts ?? [])
      .filter((t): t is ThoughtRow => !!t && !!t.id)
      .map((thought) => ({
        ...thought,
        tags:
          (tagsData ?? [])
            .filter((t: ThoughtTag) => t?.thought_id === thought.id)
            .map((t) => t?.tag)
            .filter(notNull) || [],
      }));

    return thoughtsWithTags;
  } catch (error) {
    logger.error('Error fetching thoughts', { component: 'api/queries' }, error);
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
      .from('thoughts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (thoughtError) throw thoughtError;
    if (!thought) return null;

    // Fetch tags
    const { data: tagsData, error: tagsError } = await supabase
      .from('thought_tags')
      .select('*')
      .eq('thought_id', thought.id);

    if (tagsError) throw tagsError;

    return {
      ...thought,
  tags: (tagsData ?? []).map((t: ThoughtTag) => t?.tag).filter(notNull) || [],
    };
  } catch (error) {
    logger.error(`Error fetching thought ${slug}`, { component: 'api/queries' }, error);
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
      .from('profile')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching profile', { component: 'api/queries' }, error);
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
      .from('contact')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching contact', { component: 'api/queries' }, error);
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
      .from('experience')
      .select('*')
      .order('display_order', { ascending: true });

    if (expError) throw expError;
    if (!experience) return null;

    // Fetch highlights
    const { data: highlightsData, error: highlightsError } = await supabase
      .from('experience_highlights')
      .select('*')
      .order('display_order', { ascending: true});

    if (highlightsError) throw highlightsError;

    // Map highlights to experience
    const experienceWithHighlights: Experience[] = (experience ?? [])
      .filter((e): e is ExperienceRow => !!e && !!e.id)
      .map((exp) => ({
        ...exp,
        highlights:
          (highlightsData ?? [])
            .filter((h: ExperienceHighlight) => h?.experience_id === exp.id)
            .map((h) => h?.highlight)
            .filter(notNull) || [],
      }));

    return experienceWithHighlights;
  } catch (error) {
    logger.error('Error fetching experience', { component: 'api/queries' }, error);
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
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true});

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching skills', { component: 'api/queries' }, error);
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
      .from('technologies')
      .select('*')
      .order('name', { ascending: true});

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching technologies', { component: 'api/queries' }, error);
    return null;
  }
}
