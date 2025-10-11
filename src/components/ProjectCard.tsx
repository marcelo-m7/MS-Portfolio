import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';
import React from 'react';

interface ProjectCardProps {
  project: {
    slug: string;
    name: string;
    summary: string;
    stack: string[];
    url: string;
    thumbnail: string;
    category: string;
    year: number;
  };
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group"
    >
      <div className="rounded-[var(--radius)] border border-border/70 bg-card/70 backdrop-blur-xl overflow-hidden shadow-[0_20px_40px_-30px_hsl(var(--accent)/0.1)] focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 focus-within:ring-offset-background group-hover:shadow-[0_35px_60px_-45px_hsl(var(--accent)/0.3),_0_15px_30px_-15px_hsl(var(--primary)/0.2)]">
        <Link
          to={`/portfolio/${project.slug}`}
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
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/25 via-secondary/20 to-accent/25">
            <motion.img
              src={project.thumbnail}
              width={640}
              height={360}
              loading="lazy"
              decoding="async"
              alt={`${project.name} – ${project.category}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-4 right-4">
              <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium">
                {project.year}
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap ml-2">
                {project.category}
              </span>
            </div>

            <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
              {project.summary}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech: string) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-1 rounded-md bg-muted/60 text-foreground/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Link>
        <div className="p-6 pt-0">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Ver Projeto Online
            <ExternalLink size={16} aria-hidden />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;