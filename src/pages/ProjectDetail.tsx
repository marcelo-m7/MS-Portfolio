import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Code2,
  Layers,
  Github,
  Globe,
  Shield,
  GitBranch,
} from 'lucide-react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  languageToLocale,
  useCurrentLanguage,
} from '@/hooks/useCurrentLanguage';
import { cn } from '@/lib/utils';
import {
  getStatusBadgeClasses,
  getVisibilityBadgeClasses,
} from '@/lib/projectStyles';
import { useTranslations } from '@/hooks/useTranslations';
import { useCvData } from '@/hooks/useCvData';

const MotionButton = motion(Button);

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);
  const { t } = useTranslations();
  const cvData = useCvData();
  const project = cvData.projects.find((item) => item.slug === slug);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (typeof document === 'undefined' || !project) return;

    const previousTitle = document.title;
    document.title = `${project.name} · ${t('Portfolio.title')} Monynha Softwares`;

    const descriptionSelector = 'meta[name="description"]';
    const existingMeta = document.querySelector<HTMLMetaElement>(
      descriptionSelector,
    );
    const createdMeta = !existingMeta;
    const meta =
      existingMeta ?? document.createElement('meta');
    const previousDescription = meta.getAttribute('content') ?? '';

    if (!existingMeta) {
      meta.name = 'description';
      document.head.appendChild(meta);
    }

    meta.setAttribute(
      'content',
      `${project.name} – ${project.summary}`,
    );

    return () => {
      document.title = previousTitle;
      if (createdMeta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, [project, t]);

  if (!project) {
    return (
      <div className="py-0 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">{t('ProjectDetail.notFound.title')}</h1>
          <p className="mt-4 text-muted-foreground">
            {t('ProjectDetail.notFound.description')}
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link to="/portfolio">{t('ProjectDetail.notFound.cta')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedYear = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
  }).format(new Date(`${project.year}-01-01`));

  const liveLink = project.url ?? undefined;

  return (
    <div className="px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          animate={prefersReducedMotion ? undefined : 'visible'}
          className="rounded-[var(--radius)] border border-border/60 bg-card/80 p-10 shadow-[0_45px_90px_-70px_hsl(var(--primary)/0.3)] backdrop-blur-xl"
        >
          <motion.div variants={itemVariants}>
            <MotionButton
              asChild
              variant="ghost"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
              whileHover={prefersReducedMotion ? undefined : { x: -5 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Link to="/portfolio">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                {t('ProjectDetail.back')}
              </Link>
            </MotionButton>
          </motion.div>

          {/* Overview Section */}
          <motion.section variants={itemVariants} className="mb-10 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-sm font-medium normal-case">
                <Calendar className="h-4 w-4" aria-hidden />
                {formattedYear}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-sm font-medium normal-case">
                <Layers className="h-4 w-4" aria-hidden />
                {project.category}
              </span>
              {project.status && (
                <Badge
                  className={cn(
                    'text-[0.65rem] uppercase tracking-wide',
                    getStatusBadgeClasses(project.status),
                  )}
                >
                  {project.status}
                </Badge>
              )}
              {project.visibility && (
                <Badge
                  className={cn(
                    'text-[0.65rem] uppercase tracking-wide',
                    getVisibilityBadgeClasses(project.visibility),
                  )}
                >
                  {project.visibility}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-display font-semibold text-foreground">
              {project.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground/90">{project.summary}</p>
          </motion.section>

          {/* Project Thumbnail */}
          {project.thumbnail && (
            <motion.div
              variants={itemVariants}
              className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"
            >
              <img
                src={project.thumbnail}
                alt={t('ProjectCard.alt.thumbnail', { name: project.name })}
                loading="lazy"
                decoding="async"
                width={1280}
                height={720}
                className="h-auto w-full object-cover"
              />
            </motion.div>
          )}

          {/* Full Description */}
          {project.fullDescription && (
            <motion.article
              variants={itemVariants}
              className="mt-10 space-y-6 text-base leading-relaxed text-foreground/90 prose prose-invert prose-p:text-foreground/90 prose-strong:text-foreground"
            >
              <ReactMarkdown>{project.fullDescription}</ReactMarkdown>
            </motion.article>
          )}

          {/* Project Metadata */}
          <motion.section variants={itemVariants} className="mt-10 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground/90">
            <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border/60 bg-background/60 px-4 py-3">
              <Globe className="h-4 w-4 text-secondary" aria-hidden />
              <span>{project.domain ?? t('ProjectDetail.metadata.domainFallback')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border/60 bg-background/60 px-4 py-3">
              <Shield className="h-4 w-4 text-primary" aria-hidden />
              <span>{project.visibility ?? t('ProjectDetail.metadata.visibilityFallback')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border/60 bg-background/60 px-4 py-3">
              <GitBranch className="h-4 w-4 text-emerald-300" aria-hidden />
              <span>{project.status ?? t('ProjectDetail.metadata.statusFallback')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border/60 bg-background/60 px-4 py-3">
              <Layers className="h-4 w-4 text-primary" aria-hidden />
              <span>{project.category}</span>
              </div>
            </div>

            <Separator className="bg-border/70" />

            <div>
              <h2 className="text-2xl font-display font-bold mb-4">{t('ProjectDetail.techTitle')}</h2>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    <Code2 className="h-3 w-3" aria-hidden />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                variant="outline"
                className="rounded-full border-border/70"
              >
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('ProjectCard.aria.openRepository', { name: project.name })}
                  className="inline-flex items-center gap-2"
                >
                  <Github className="h-4 w-4" aria-hidden />
                  {t('ProjectCard.actions.viewRepository')}
                </a>
              </Button>
              {liveLink && (
                <Button
                  asChild
                  variant="secondary"
                  className="rounded-full border border-secondary/40"
                >
                  <a
                    href={liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('ProjectCard.aria.openLive', { name: project.name })}
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    {t('ProjectCard.actions.openLive')}
                  </a>
                </Button>
              )}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}