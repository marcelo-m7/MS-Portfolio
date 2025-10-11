import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Code2, Layers } from 'lucide-react';
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
    <div className="px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          animate={prefersReducedMotion ? undefined : 'visible'}
          className="rounded-[var(--radius)] border border-border/60 bg-card/70 p-10 shadow-[0_45px_90px_-70px_rgba(var(--primary-hsl)/0.3)] backdrop-blur-xl"
        >
          <motion.div variants={itemVariants}>
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
          </motion.div>

          {/* Overview Section */}
          <motion.section variants={itemVariants} className="mb-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
                <Calendar className="h-4 w-4" aria-hidden />
                {formattedYear}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
                <Layers className="h-4 w-4" aria-hidden />
                {project.category}
              </span>
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
                alt={`Thumbnail do projeto ${project.name}`}
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

          {/* Technologies Used Section */}
          <motion.section variants={itemVariants} className="mt-10">
            <h2 className="text-2xl font-display font-bold mb-4">Tecnologias Utilizadas</h2>
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
          </motion.section>

          {/* Live Project Section */}
          <motion.section variants={itemVariants} className="mt-10">
            <h2 className="text-2xl font-display font-bold mb-4">Ver Projeto Online</h2>
            <motion.a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-10px_rgba(var(--primary-hsl)/0.4)] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Acessar Projeto
              <ExternalLink className="h-4 w-4" aria-hidden />
            </motion.a>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}