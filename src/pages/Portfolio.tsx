import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Palette, Layers } from 'lucide-react'; // Import Palette and Layers
import { useMemo, useState } from 'react';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const [filter, setFilter] = useState<string>('Todos');
  const prefersReducedMotion = useReducedMotion();

  const categories = useMemo(
    () => [
      'Todos',
      ...new Set(cvData.projects.map((p) => p.category)),
      'Arte Digital', // Add Artworks category
      'Série Criativa', // Add Series category
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

    // Add a type property for easier rendering
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
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
              className={`rounded-full border-border/70 px-3 py-1.5 text-sm transition ${
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
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.slug || item.name}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="group"
            >
              {item.type === 'project' && (
                <div className="rounded-[var(--radius)] border border-border/70 bg-card/70 backdrop-blur-xl overflow-hidden shadow-[0_20px_40px_-30px_hsl(var(--accent)/0.1)] focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 focus-within:ring-offset-background group-hover:shadow-[0_35px_60px_-45px_hsl(var(--accent)/0.3),_0_15px_30px_-15px_hsl(var(--primary)/0.2)]">
                  <Link
                    to={`/portfolio/${item.slug}`}
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
                        src={item.thumbnail}
                        width={640}
                        height={360}
                        loading="lazy"
                        decoding="async"
                        alt={`${item.name} – ${item.category}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute top-4 right-4">
                        <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium">
                          {item.year}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap ml-2">
                          {item.category}
                        </span>
                      </div>

                      <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.stack.map((tech: string) => (
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
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Ver Projeto Online
                      <ExternalLink size={16} aria-hidden />
                    </a>
                  </div>
                </div>
              )}

              {item.type === 'artwork' && (
                <div className="rounded-[var(--radius)] border border-border/70 bg-card/70 backdrop-blur-xl overflow-hidden shadow-[0_20px_40px_-30px_hsl(var(--accent)/0.1)] focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 focus-within:ring-offset-background group-hover:shadow-[0_35px_60px_-45px_hsl(var(--accent)/0.3),_0_15px_30px_-15px_hsl(var(--primary)/0.2)]">
                  <Link
                    to={`/art/${item.slug}`}
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
                        src={item.media?.[0]}
                        width={640}
                        height={360}
                        loading="lazy"
                        decoding="async"
                        alt={`${item.title} – Arte Digital`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute top-4 right-4">
                        <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium">
                          {item.year}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap ml-2">
                          Arte Digital
                        </span>
                      </div>

                      <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.materials.map((material: string) => (
                          <span
                            key={material}
                            className="text-xs px-2 py-1 rounded-md bg-muted/60 text-foreground/80"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                  {item.url3d && (
                    <div className="p-6 pt-0">
                      <a
                        href={item.url3d}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Ver Experiência 3D
                        <ExternalLink size={16} aria-hidden />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {item.type === 'series' && (
                <div className="rounded-[var(--radius)] border border-border/70 bg-card/70 backdrop-blur-xl overflow-hidden shadow-[0_20px_40px_-30px_hsl(var(--accent)/0.1)] focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 focus-within:ring-offset-background group-hover:shadow-[0_35px_60px_-45px_hsl(var(--accent)/0.3),_0_15px_30px_-15px_hsl(var(--primary)/0.2)]">
                  <Link
                    to={`/series/${item.slug}`}
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
                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/25 via-secondary/20 to-accent/25 flex items-center justify-center">
                      <Layers className="h-24 w-24 text-white/50" aria-hidden />
                      <div className="absolute top-4 right-4">
                        <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium">
                          {item.year}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap ml-2">
                          Série Criativa
                        </span>
                      </div>

                      <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.works.length > 0 && (
                          <span className="text-xs px-2 py-1 rounded-md bg-muted/60 text-foreground/80">
                            {item.works.length} obras
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="p-6 pt-0">
                    <Link
                      to={`/series/${item.slug}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Ver Coleção Completa
                      <ExternalLink size={16} aria-hidden />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
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