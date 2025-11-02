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
  Star,
  GitFork,
} from 'lucide-react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useProject } from '@/hooks/usePortfolioData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { GitHubStats } from '@/components/GitHubStats';
import {
  languageToLocale,
  useCurrentLanguage,
} from '@/hooks/useCurrentLanguage';
import { cn } from '@/lib/utils';
import {
  getStatusBadgeClasses,
  getVisibilityBadgeClasses,
} from '@/lib/projectStyles';
import { formatRelativeTime, formatStarCount } from '@/lib/githubApi';

const MotionButton = motion(Button);

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);
  const { data: dbProject, isLoading } = useProject(slug);

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
    if (typeof document === 'undefined' || !dbProject) return;

    const previousTitle = document.title;
    document.title = `${dbProject.title} · Portfólio Monynha Softwares`;

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
      `${dbProject.title} – ${dbProject.summary}`,
    );

    return () => {
      document.title = previousTitle;
      if (createdMeta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, [dbProject]);

  // Loading state
  if (isLoading) {
    return (
      <div className="px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-[var(--radius)] border border-border/60 bg-card/80 p-10 shadow-[0_45px_90px_-70px_hsl(var(--primary)/0.3)] backdrop-blur-xl">
            <Skeleton className="mb-8 h-10 w-48 rounded-full" />
            <div className="mb-10 space-y-4">
              <div className="flex gap-3">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
            <div className="mt-10 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 404 state
  if (!dbProject) {
    return (
      <div className="py-0 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">Projeto não encontrado</h1>
          <p className="mt-4 text-muted-foreground">
            Este projeto não existe ou foi movido. Volte ao portfolio para descobrir outros trabalhos.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link to="/portfolio">Ver Portfolio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedYear = dbProject.year
    ? new Intl.DateTimeFormat(locale, {
        year: 'numeric',
      }).format(new Date(`${dbProject.year}-01-01`))
    : '—';

  const liveLink = dbProject.liveDemoUrl ?? undefined;
  const stack = dbProject.technologies ?? [];
  const cachedAt = dbProject.cachedAt ? new Date(dbProject.cachedAt) : null;
  const cachedAtLabel = cachedAt
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(cachedAt)
    : null;
  const githubLastPushLabel = dbProject.githubLastPush
    ? formatRelativeTime(dbProject.githubLastPush)
    : null;
  const storedGithubStats = [
    { icon: Star, label: 'Stars', value: dbProject.githubStars },
    { icon: GitFork, label: 'Forks', value: dbProject.githubForks },
    { icon: Github, label: 'Watchers', value: dbProject.githubWatchers },
  ].filter((stat) => typeof stat.value === 'number');

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
                Voltar ao Portfolio
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
                {dbProject.category ?? 'Projeto'}
              </span>
              {dbProject.status && (
                <Badge
                  className={cn(
                    'text-[0.65rem] uppercase tracking-wide',
                    getStatusBadgeClasses(dbProject.status),
                  )}
                >
                  {dbProject.status}
                </Badge>
              )}
              {dbProject.visibility && (
                <Badge
                  className={cn(
                    'text-[0.65rem] uppercase tracking-wide',
                    getVisibilityBadgeClasses(dbProject.visibility),
                  )}
                >
                  {dbProject.visibility}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-display font-semibold text-foreground">
              {dbProject.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground/90">{dbProject.summary}</p>
          </motion.section>

          {/* Project Thumbnail */}
          {dbProject.thumbnail && (
            <motion.div
              variants={itemVariants}
              className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"
            >
              <img
                src={dbProject.thumbnail}
                alt={`Thumbnail do projeto ${dbProject.title}`}
                loading="lazy"
                decoding="async"
                width={1280}
                height={720}
                className="h-auto w-full object-cover"
              />
            </motion.div>
          )}

          {/* Full Description */}
          {dbProject.description && (
            <motion.article
              variants={itemVariants}
              className="mt-10 space-y-6 text-base leading-relaxed text-foreground/90 prose prose-invert prose-p:text-foreground/90 prose-strong:text-foreground"
            >
              <ReactMarkdown>{dbProject.description}</ReactMarkdown>
            </motion.article>
          )}

          {/* Project Metadata */}
          <motion.section variants={itemVariants} className="mt-10 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground/90">
              <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border/60 bg-background/60 px-4 py-3">
                <Globe className="h-4 w-4 text-secondary" aria-hidden />
                <span>{dbProject.domain ?? 'Domínio reservado'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border/60 bg-background/60 px-4 py-3">
                <Shield className="h-4 w-4 text-primary" aria-hidden />
                <span>{dbProject.visibility ?? 'Visibilidade não definida'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border/60 bg-background/60 px-4 py-3">
                <GitBranch className="h-4 w-4 text-emerald-300" aria-hidden />
                <span>{dbProject.status ?? 'Estado em revisão'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border/60 bg-background/60 px-4 py-3">
                <Layers className="h-4 w-4 text-primary" aria-hidden />
                <span>{dbProject.category ?? 'Projeto'}</span>
              </div>
            </div>

            <Separator className="bg-border/70" />

            <div>
              <h2 className="text-2xl font-display font-bold mb-4">Tecnologias Utilizadas</h2>
              {stack.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {stack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      <Code2 className="h-3 w-3" aria-hidden />
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/90">
                  Stack em curadoria — acompanhe atualizações no repositório.
                </p>
              )}
            </div>

            {dbProject.githubUrl && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-display font-bold">Atividade no GitHub</h2>
                  <GitHubStats repoUrl={dbProject.githubUrl} />
                </div>
                {storedGithubStats.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {storedGithubStats.map(({ icon: Icon, label, value }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        <Icon className="h-3 w-3" aria-hidden />
                        <span>
                          {label}: {typeof value === 'number' ? formatStarCount(value) : value}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
                {dbProject.githubTopics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {dbProject.githubTopics.map((topic) => (
                      <Badge key={topic} variant="outline" className="border-border/60 bg-background/60 text-xs font-medium">
                        #{topic}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground/80">
                  {githubLastPushLabel && (
                    <span>Último push público: {githubLastPushLabel}. </span>
                  )}
                  {cachedAtLabel && <span>Cache atualizado em {cachedAtLabel}.</span>}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {dbProject.githubUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-border/70"
                >
                  <a
                    href={dbProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir repositório ${dbProject.title} no GitHub`}
                    className="inline-flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" aria-hidden />
                    Ver Repositório
                  </a>
                </Button>
              )}
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
                    aria-label={`Visitar domínio de ${dbProject.title}`}
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    Acessar Online
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