import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfile, useProjects } from '@/hooks/usePortfolioData';
import { useGitHubHighlights } from '@/hooks/useGitHubStats';
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslatedText } from '@/hooks/useTranslatedContent';
import { siteConfig } from '@/config/site';
import { useSeoMetadata } from '@/hooks/useSeoMetadata';

const HeroSection = lazy(() => import('@/components/sections/home/HeroSection').then((module) => ({ default: module.HeroSection })));
const FeaturedProjectsSection = lazy(() => import('@/components/sections/home/FeaturedProjectsSection').then((module) => ({ default: module.FeaturedProjectsSection })));
const GitHubHighlightsSection = lazy(() => import('@/components/sections/home/GitHubHighlightsSection').then((module) => ({ default: module.GitHubHighlightsSection })));

export default function Home() {
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: githubHighlights, isLoading: loadingGitHub } = useGitHubHighlights();
  const t = useTranslations();

  const translatedBio = useTranslatedText(profile?.bio);
  const translatedHeadline = useTranslatedText(profile?.headline);

  useSeoMetadata({
    title: siteConfig.title,
    description: siteConfig.description,
    path: '/',
  });

  const featuredProjects = (projects ?? []).slice(0, 6).map((project) => ({
    slug: project.slug,
    name: project.name,
    summary: project.summary,
    category: project.category,
    year: project.year,
    technologies:
      project.technologies?.map((item: { name: string | null }) => ({ name: item.name ?? 'Stack' })) ??
      (project.stack?.map((name: string) => ({ name })) ?? []),
  }));

  return (
    <div>
      <Suspense fallback={<div className="px-6 py-16"><Skeleton className="mx-auto h-[480px] max-w-6xl rounded-3xl" /></div>}>
        <HeroSection
          loadingProfile={loadingProfile}
          location={profile?.location}
          name={profile?.name}
          headline={translatedHeadline}
          bio={translatedBio}
          exploreLabel={t.home.explorePortfolio}
          contactLabel={t.home.getInTouch}
        />
      </Suspense>

      <Suspense fallback={<div className="px-6 py-24"><Skeleton className="mx-auto h-[420px] max-w-7xl rounded-3xl" /></div>}>
        <FeaturedProjectsSection
          loading={loadingProjects}
          projects={featuredProjects}
          title="Projetos em Destaque"
          subtitle="Seleção de produtos, sistemas internos e experiências digitais que traduzem a visão de Marcelo Santos dentro do ecossistema Monynha."
          ctaLabel={t.home.viewAllProjects}
        />
      </Suspense>

      <Suspense fallback={<div className="px-6 pb-24"><Skeleton className="mx-auto h-[360px] max-w-7xl rounded-3xl" /></div>}>
        <GitHubHighlightsSection
          items={githubHighlights?.items ?? []}
          isLoading={loadingGitHub}
          isFallback={githubHighlights?.isFallback ?? false}
        />
      </Suspense>
    </div>
  );
}
