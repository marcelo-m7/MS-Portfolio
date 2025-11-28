import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, Globe, Layers, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { useProfile, useProjects } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslatedText } from '@/hooks/useTranslatedContent';
import { LINKS } from '@/lib/siteLinks'; // Import LINKS

// Memoized project card component to prevent re-renders
const FeaturedProjectCard = memo(({ 
  project, 
  index,
  prefersReducedMotion 
}: { 
  project: {
    slug: string; // Added slug to project type
    name: string;
    summary: string;
    category: string;
    url?: string | null;
    repo_url?: string | null;
    technologies?: Array<{ name: string }>;
    year: number; // Ensure year is part of the project type
  };
  index: number;
  prefersReducedMotion: boolean | null;
}) => {
  const techStack = useMemo(() => {
    return (
      ((project.technologies as Array<{ name: string }> | undefined)?.map((t) => t.name) ??
        // Some legacy entries might include a `stack` array; guard to satisfy types safely
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
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <motion.div // Changed from <a> to <div> to wrap the Link
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={
          prefersReducedMotion
            ? undefined
            : { rotateX: -6, rotateY: 6, translateZ: 12 }
        }
        whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      >
        <Link to={`/portfolio/${project.slug}`} className="block"> {/* Link to project detail page */}
          <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/70 text-white shadow-md">
                <Code2 className="text-white" size={24} aria-hidden />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  {project.category}
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full border border-border/60 bg-background/70 text-muted-foreground">
                  {project.year}
                </span>
              </div>
            </div>
            <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              {project.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1 rounded-xl bg-muted/60 text-foreground/80"
                >
                  {tech}
                </span>
              ))}
            </div>
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
  
  // Translate dynamic content from cv.json
  const translatedBio = useTranslatedText(profile?.bio);
  const translatedHeadline = useTranslatedText(profile?.headline);

  // Memoize animation variants to prevent recreation on every render
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
      {/* Hero Section */}
      <section className="relative min-h-[calc(100dvh-8rem)] flex items-center justify-center overflow-hidden py-16">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={containerVariants}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            animate={prefersReducedMotion ? undefined : 'visible'}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 shadow-[0_20px_35px_-25px_hsl(var(--secondary)/0.2)]"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              {loadingProfile ? (
                <Skeleton className="w-24 h-4" />
              ) : (
                <span className="text-sm font-medium">{profile?.location}</span>
              )}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-display font-bold mb-6 mt-6 text-balance"
            >
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {loadingProfile ? (
                  <span
                    className="inline-block w-40 h-10 mx-auto rounded-md bg-muted animate-pulse"
                    aria-hidden
                  />
                ) : (
                  profile?.name
                )}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium"
            >
              {loadingProfile ? (
                <span
                  className="inline-block w-64 h-6 mx-auto rounded-md bg-muted animate-pulse"
                  aria-hidden
                />
              ) : (
                translatedHeadline
              )}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto"
            >
              {loadingProfile ? (
                <span
                  className="inline-block w-80 h-5 mx-auto rounded-md bg-muted animate-pulse"
                  aria-hidden
                />
              ) : (
                translatedBio
              )}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="px-10 shadow-lg shadow-secondary/30 w-full sm:w-auto"
              >
                <Link to="/portfolio">
                  <Code2 className="mr-2" />
                  {t.home.explorePortfolio}
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-border/70 bg-card/60 px-10 hover:border-primary/70 hover:text-primary w-full sm:w-auto"
              >
                <Link to="/contact">
                  {t.home.getInTouch}
                </Link>
              </Button>

              {/* New button for Monynha.com */}
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="px-10 shadow-lg shadow-accent/30 w-full sm:w-auto"
              >
                <a href={LINKS.monynhaSite} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2" />
                  Monynha Softwares
                  <ArrowRight className="ml-2" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, 12, 0] }}
              transition={prefersReducedMotion ? undefined : { duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Projetos em Destaque
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Seleção dos melhores trabalhos do ecossistema Monynha
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {loadingProjects
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                ))
              : (projects?.slice(0, 6).map((project, index) => (
                  <FeaturedProjectCard
                    key={project.name}
                    project={project}
                    index={index}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                )))}
          </div>

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
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

      {/* Collections & Art (static, no data needed) */}
      <section className="pb-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Coleções & Arte
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experiências imersivas e séries experimentais que conectam tecnologia, narrativa e arte digital.
            </p>
          </motion.div>
          {/* Static links, unchanged */}
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link
                to="/series/creative-systems"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-6 shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary via-primary to-accent text-white shadow-md">
                    <Layers aria-hidden className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                    Creative Systems
                  </h3>
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
              <Link
                to="/art/artleo"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-6 shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-md">
                    <Palette aria-hidden className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                    Art Leo Creative Spaces
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground/90">
                    Experiência 3D com narrativas interativas e composição sonora inspirada nos espaços criativos de Leonardo Silva.
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