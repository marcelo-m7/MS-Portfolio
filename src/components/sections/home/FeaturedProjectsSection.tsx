import { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturedProject {
  slug: string;
  name: string;
  summary: string;
  category: string;
  year: number;
  technologies?: Array<{ name: string }>;
}

const FeaturedProjectCard = memo(function FeaturedProjectCard({ project, index }: { project: FeaturedProject; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const techStack = useMemo(() => (project.technologies?.map((item) => item.name) ?? []).slice(0, 3), [project.technologies]);

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="group"
    >
      <Link to={`/portfolio/${project.slug}`} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <div className="h-full rounded-2xl border border-border/70 bg-card/70 p-6 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/70 text-white shadow-md">
              <Code2 className="h-6 w-6" aria-hidden />
            </div>
            <div className="flex flex-col items-end gap-2 text-xs">
              <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">{project.category}</span>
              <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-muted-foreground">{project.year}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold transition-colors group-hover:text-primary">{project.name}</h3>
          <p className="mt-3 text-sm text-muted-foreground">{project.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="rounded-xl bg-muted/60 px-3 py-1 text-xs text-foreground/80">{tech}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export const FeaturedProjectsSection = memo(function FeaturedProjectsSection({
  loading,
  projects,
  title,
  subtitle,
  ctaLabel,
}: {
  loading: boolean;
  projects: FeaturedProject[];
  title: string;
  subtitle: string;
  ctaLabel: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="px-6 py-24">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold md:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-40 w-full rounded-2xl" />)
            : projects.map((project, index) => <FeaturedProjectCard key={project.slug} project={project} index={index} />)}
        </div>
        <motion.div initial={prefersReducedMotion ? undefined : { opacity: 0 }} whileInView={prefersReducedMotion ? undefined : { opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="border-border/70">
            <Link to="/portfolio">{ctaLabel}<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});
