import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Code2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';
import {
  languageToLocale,
  useCurrentLanguage,
} from '@/hooks/useCurrentLanguage';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);
  const project = cvData.projects.find((item) => item.slug === slug);

  if (!project) {
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

  const formattedYear = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(
    new Date(`${project.year}-01-01`),
  );

  return (
    <div className="py-0 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[var(--radius)] border border-border/60 bg-card/70 p-10 shadow-[0_45px_90px_-70px_rgba(var(--primary-hsl)/0.3)] backdrop-blur-xl"
        >
          <Button
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
          </Button>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Calendar className="h-4 w-4" aria-hidden />
              {formattedYear}
            </motion.span>
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Code2 className="h-4 w-4" aria-hidden />
              {project.category}
            </motion.span>
          </div>

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">
            {project.name}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{project.summary}</p>

          {project.thumbnail && (
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"
            >
              <img
                src={project.thumbnail}
                alt={`Thumbnail do projeto ${project.name}`}
                loading="lazy"
                decoding="async"
                width={1280}
                height={720}
                className="h-auto w-full object-cover"
              />
            </motion.div>
          )}

          {project.fullDescription && (
            <article className="mt-10 space-y-6 text-base leading-relaxed text-foreground/90 prose prose-invert prose-p:text-foreground/90 prose-strong:text-foreground">
              <ReactMarkdown>{project.fullDescription}</ReactMarkdown>
            </article>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <motion.a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-10px_rgba(var(--primary-hsl)/0.4)] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Ver Projeto Online
              <ExternalLink className="h-4 w-4" aria-hidden />
            </motion.a>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}