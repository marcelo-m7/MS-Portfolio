import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, Globe, Layers, Palette, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, memo, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { useProfile, useProjects } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslatedText } from '@/hooks/useTranslatedContent';
import { LINKS } from '@/lib/siteLinks';
import { useDocumentMetadata } from '@/lib/metadata';

const GitHubHighlights = lazy(() => import('@/components/sections/GitHubHighlights').then((mod) => ({ default: mod.GitHubHighlights })));

const FeaturedProjectCard = memo(({
  project,
  index,
  prefersReducedMotion,
}: {
  project: {
    slug: string;
    name: string;
    summary: string;
    category: string;
    url?: string | null;
    repo_url?: string | null;
    technologies?: Array<{ name: string }>;
    year: number;
  };
  index: number;
  prefersReducedMotion: boolean | null;
}) => {
  const techStack = useMemo(() => {
    return (
      ((project.technologies as Array<{ name: string }> | undefined)?.map((t) => t.name) ??
        (("stack" in (project as object) ? (project as Record<string, unknown>).stack : undefined) as string[] | undefined) ??
        []
      ).slice(0, 3)
    );
  }, [project]);

  return (
    <motion.div
      key={project.name}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="group"
    >
      <motion.div
        className="block rounded-[2rem] border border-border/70 bg-card/70 p-1 shadow-lg backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={prefersReducedMotion ? undefined : { rotateX: -4, rotateY: 4, translateZ: 8 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      >
        <Link to={`/portfolio/${project.slug}`} className="block rounded-[1.8rem] bg-background/75 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/70 text-white shadow-md">
              <Code2 className="text-white" size={24} aria-hidden />
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{project.category}</span>
              <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">{project.year}</span>
            </div>
          </div>
          <h3 className="mt-6 text-xl font-display font-bold transition-colors group-hover:text-primary">{project.name}</h3>
          <p className="mt-3 text-sm text-muted-foreground">{project.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="rounded-xl bg-muted/60 px-3 py-1 text-xs text-foreground/80">
                {tech}
              </span>
            ))}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
});

FeaturedProjectCard.displayName = 'FeaturedProjectCard';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const t = useTranslations();

  const translatedBio = useTranslatedText(profile?.bio);
  const translatedHeadline = useTranslatedText(profile?.headline);

  useDocumentMetadata({
    title: 'Marcelo Santos / Monynha Softwares',
    description:
      'Portfólio técnico com foco em performance, produtos escaláveis, open source, branding Monynha e experiências criativas.',
    path: '/',
  });

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }), []);

  return (
    <div>
      <section className="relative flex min-h-[calc(100dvh-8rem)] items-center justify-center overflow-hidden px-6 py-16">
        <div className="container relative z-10 mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            animate={prefersReducedMotion ? undefined : 'visible'}
            className="mx-auto grid items-center gap-12 lg:grid-cols-[1.25fr,0.75fr]"
          >
            <div className="text-center lg:text-left">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 shadow-lg backdrop-blur">
                <Sparkles className="h-4 w-4 text-accent" />
                {loadingProfile ? <Skeleton className="h-4 w-32" /> : <span className="text-sm font-medium">{profile?.location}</span>}
              </motion.div>

              <motion.div variants={itemVariants} className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <BadgeCheck className="h-4 w-4" />
                Marcelo Santos / Monynha Softwares
              </motion.div>

              <motion.h1 variants={itemVariants} className="mt-6 text-5xl font-display font-bold text-balance md:text-7xl">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {loadingProfile ? <span className="inline-block h-10 w-48 rounded-md bg-muted animate-pulse" aria-hidden /> : profile?.name}
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="mt-6 text-xl font-medium text-muted-foreground md:text-2xl">
                {loadingProfile ? <span className="inline-block h-6 w-72 rounded-md bg-muted animate-pulse" aria-hidden /> : translatedHeadline}
              </motion.p>

              <motion.p variants={itemVariants} className="mt-5 max-w-2xl text-lg text-muted-foreground/80 lg:mx-0 mx-auto">
                {loadingProfile ? <span className="inline-block h-5 w-80 rounded-md bg-muted animate-pulse" aria-hidden /> : translatedBio}
              </motion.p>

              <motion.div variants={itemVariants} className="mt-10 flex flex-col items-stretch justify-start gap-4 sm:flex-row sm:flex-wrap lg:items-center">
                <Button asChild size="lg" className="px-10 shadow-lg shadow-secondary/30">
                  <Link to="/portfolio">
                    <Code2 className="mr-2" />
                    {t.home.explorePortfolio}
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="border-2 border-border/70 bg-card/60 px-10 hover:border-primary/70 hover:text-primary">
                  <Link to="/contact">{t.home.getInTouch}</Link>
                </Button>

                <Button asChild variant="secondary" size="lg" className="px-10 shadow-lg shadow-accent/30">
                  <a href={LINKS.monynhaSite} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2" />
                    Monynha Softwares
                    <ArrowRight className="ml-2" />
                  </a>
                </Button>
              </motion.div>
            </div>

            <motion.aside variants={itemVariants} className="grid gap-4 rounded-[2rem] border border-border/60 bg-card/70 p-5 shadow-xl backdrop-blur-xl">
              {[
                ['Performance first', '3D com fallback, lazy loading e foco em Core Web Vitals.'],
                ['Produto reutilizável', 'Base pensada para evolução dentro do ecossistema Monynha.'],
                ['Dados vivos', 'Projetos locais, GitHub dinâmico e suporte opcional a Supabase.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-[1.5rem] border border-border/60 bg-background/60 p-5">
                  <h2 className="text-lg font-display font-semibold">{title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </motion.aside>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-display font-bold md:text-5xl">Projetos em Destaque</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Seleção dos melhores trabalhos do ecossistema Monynha com foco em engenharia, experiência e escalabilidade.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loadingProjects
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-[2rem]" />)
              : projects?.slice(0, 6).map((project, index) => (
                  <FeaturedProjectCard key={project.name} project={project} index={index} prefersReducedMotion={prefersReducedMotion} />
                ))}
          </div>

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button asChild variant="outline" size="lg" className="border-border/70">
              <Link to="/portfolio">
                {t.home.viewAllProjects}
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Suspense fallback={<div className="px-6 pb-24"><div className="container mx-auto max-w-7xl"><Skeleton className="h-72 w-full rounded-[2rem]" /></div></div>}>
        <GitHubHighlights />
      </Suspense>

      <section className="px-6 pb-24">
        <div className="container mx-auto">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-display font-bold md:text-5xl">Coleções & Arte</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Experiências imersivas e séries experimentais que conectam tecnologia, narrativa e arte digital.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link to="/series/creative-systems" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <div className="flex h-full flex-col rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary via-primary to-accent text-white shadow-md">
                    <Layers aria-hidden className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">Creative Systems</h3>
                  <p className="mt-3 text-sm text-muted-foreground/90">
                    Coleção de trabalhos que explora IA aplicada, automação inteligente e interfaces artísticas conectadas ao laboratório Monynha.
                  </p>
                </div>
              </Link>
            </motion.div>
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/art/artleo" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <div className="flex h-full flex-col rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-md">
                    <Palette aria-hidden className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">Art Leo Creative Spaces</h3>
                  <p className="mt-3 text-sm text-muted-foreground/90">
                    Experiência 3D com narrativas interativas, preview degradado e composição visual inspirada nos espaços criativos da Monynha.
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
