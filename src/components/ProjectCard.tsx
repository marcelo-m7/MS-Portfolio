import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, Globe, Layers, ExternalLink } from 'lucide-react';
import React from 'react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  getStatusBadgeClasses,
  getVisibilityBadgeClasses,
} from '@/lib/projectStyles';

const MotionCard = motion(Card);

interface ProjectCardProps {
  project: {
    slug: string;
    name: string;
    summary: string;
    stack: string[];
    url?: string | null;
    domain?: string | null;
    repoUrl: string;
    thumbnail: string;
    category: string;
    status?: string;
    visibility?: string;
    year: number;
  };
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const prefersReducedMotion = useReducedMotion();
  const liveLink = project.url ?? undefined;

  return (
    <MotionCard
      role="article"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="group h-full overflow-hidden border-border/70 bg-card/90 shadow-md backdrop-blur"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-primary/25 via-secondary/20 to-accent/25">
        <motion.img
          src={project.thumbnail}
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          alt={`Thumbnail do projeto ${project.name}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge
            variant="outline"
            className="border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold tracking-wide uppercase"
          >
            {project.year}
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Link
              to={`/portfolio/${project.slug}`}
              aria-label={`Abrir detalhes do projeto ${project.name}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <CardTitle className="font-display text-2xl font-semibold transition-colors group-hover:text-primary">
                {project.name}
              </CardTitle>
            </Link>
          </div>
          <Badge
            variant="outline"
            className="border-secondary/60 bg-secondary/15 text-xs font-medium text-secondary"
          >
            {project.category}
          </Badge>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground/90">
          {project.summary}
        </p>

        <div className="flex flex-wrap items-center gap-2">
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
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-0">
        <Separator className="bg-border/70" />
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground/80">
          <span className="inline-flex items-center gap-2">
            <Globe className="h-4 w-4 text-secondary" aria-hidden />
            {project.domain ?? 'Domínio interno'}
          </span>
          <span className="inline-flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" aria-hidden />
            {project.category}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-xl border border-border/60 bg-background/70 px-3 py-1 text-[0.7rem] font-medium text-foreground/85"
            >
              {tech}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex flex-wrap items-center gap-3 border-t border-border/60 bg-background/50">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="border-border/70 text-xs font-semibold"
        >
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Acessar repositório ${project.name} no GitHub`}
            className="inline-flex items-center gap-2"
          >
            <Github className="h-4 w-4" aria-hidden />
            Ver Repositório
          </a>
        </Button>

        {liveLink && (
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="border border-secondary/40 text-xs font-semibold"
          >
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visitar domínio de ${project.name}`}
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Acessar Online
            </a>
          </Button>
        )}
      </CardFooter>
    </MotionCard>
  );
};

export default ProjectCard;