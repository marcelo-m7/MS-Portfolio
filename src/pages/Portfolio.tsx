import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';

export default function Portfolio() {
  const [filter, setFilter] = useState<string>('Todos');
  const prefersReducedMotion = useReducedMotion();

  const categories = useMemo(
    () => ['Todos', ...new Set(cvData.projects.map((p) => p.category))],
    []
  );

  const filteredProjects = useMemo(() => {
    if (filter === 'Todos') return cvData.projects;
    return cvData.projects.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Projetos e trabalhos desenvolvidos no ecossistema Monynha
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
              className={`rounded-full border-border/70 transition ${
                filter === category
                  ? 'bg-gradient-to-r from-primary via-secondary to-accent text-white'
                  : 'hover:border-primary/60 hover:text-primary'
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="group"
            >
              <motion.div
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { rotateX: -6, rotateY: 6, translateZ: 12 }
                }
                whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="focus-within:ring-offset-background"
              >
                <div className="rounded-3xl border border-border/70 bg-card/70 backdrop-blur-xl overflow-hidden shadow-[0_35px_60px_-45px_rgba(124,58,237,0.8)] focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 focus-within:ring-offset-background">
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/25 via-secondary/20 to-accent/25">
                    <img
                      src={project.thumbnail}
                      width={640}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      alt={`${project.name} – ${project.category}`}
                      className="h-full w-full object-cover"
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
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-md bg-muted/60 text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Ver Projeto
                      <ExternalLink size={16} aria-hidden />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              Nenhum projeto encontrado nesta categoria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
