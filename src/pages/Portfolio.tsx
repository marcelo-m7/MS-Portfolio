import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import cvData from '../../public/data/cv.json';

export default function Portfolio() {
  const [filter, setFilter] = useState<string>('Todos');

  const categories = ['Todos', ...new Set(cvData.projects.map((p) => p.category))];

  const filteredProjects =
    filter === 'Todos'
      ? cvData.projects
      : cvData.projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
          role="tablist"
          aria-label="Filtrar projetos por categoria"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
              className="rounded-full px-5 py-2 focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-pressed={filter === category}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="group"
            >
              <div className="glass rounded-3xl overflow-hidden h-full flex flex-col hover:shadow-[0_28px_80px_rgba(56,189,248,0.25)] transition-all duration-500">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 right-4 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                    {project.year}
                  </span>
                </AspectRatio>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-2xl font-display font-semibold group-hover:text-primary transition-colors">
                      {project.name}
                    </h2>
                    <span className="text-xs font-semibold tracking-wide uppercase rounded-full bg-muted/70 px-3 py-1 text-muted-foreground whitespace-nowrap">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4 flex-1 leading-relaxed">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-lg bg-primary/15 text-primary/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full px-4 py-2"
                    aria-label={`Ver projeto ${project.name}`}
                  >
                    Ver Projeto
                    <ExternalLink size={16} aria-hidden />
                  </a>
                </div>
              </div>
            </motion.article>
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
