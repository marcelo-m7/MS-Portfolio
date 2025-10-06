import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';
import { useState } from 'react';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';

export default function Portfolio() {
  const [filter, setFilter] = useState<string>('Todos');
  
  const categories = ['Todos', ...new Set(cvData.projects.map(p => p.category))];
  
  const filteredProjects = filter === 'Todos' 
    ? cvData.projects 
    : cvData.projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen pt-24 pb-16">
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
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
              className="rounded-2xl"
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group"
            >
              <div className="glass rounded-2xl overflow-hidden h-full flex flex-col hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code2 className="w-16 h-16 text-primary/50" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full glass text-xs font-medium">
                      {project.year}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap ml-2">
                      {project.category}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 flex-1">
                    {project.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-md bg-muted/50 text-foreground/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Ver Projeto
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
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
