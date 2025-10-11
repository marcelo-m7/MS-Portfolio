import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import ArtworkCard from '@/components/ArtworkCard';
import SeriesCard from '@/components/SeriesCard';

export default function Portfolio() {
  const [filter, setFilter] = useState<string>('Todos');
  const prefersReducedMotion = useReducedMotion();

  const categories = useMemo(
    () => [
      'Todos',
      ...new Set(cvData.projects.map((p) => p.category)),
      'Arte Digital',
      'Série Criativa',
    ],
    [],
  );

  const filteredItems = useMemo(() => {
    let items: any[] = [];
    if (filter === 'Todos') {
      items = [...cvData.projects, ...cvData.artworks, ...cvData.series];
    } else if (filter === 'Arte Digital') {
      items = cvData.artworks;
    } else if (filter === 'Série Criativa') {
      items = cvData.series;
    } else {
      items = cvData.projects.filter((p) => p.category === filter);
    }

    return items.map((item) => {
      if ('materials' in item) return { ...item, type: 'artwork' };
      if ('works' in item) return { ...item, type: 'series' };
      return { ...item, type: 'project' };
    });
  }, [filter]);

  return (
    <div className="px-6">
      <div className="container mx-auto max-w-6xl">
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
            Projetos, arte digital e séries criativas do ecossistema Monynha
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

        {/* Dynamic Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => {
            if (item.type === 'project') {
              return <ProjectCard key={item.slug} project={item} index={index} />;
            }
            if (item.type === 'artwork') {
              return <ArtworkCard key={item.slug} artwork={item} index={index} />;
            }
            if (item.type === 'series') {
              return <SeriesCard key={item.slug} series={item} index={index} />;
            }
            return null;
          })}
        </div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              Nenhum item encontrado nesta categoria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}