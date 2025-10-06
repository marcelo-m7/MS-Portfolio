import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';

export default function Artworks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            asChild
            variant="ghost"
            className="mb-8 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <Link to="/portfolio">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Voltar ao portfolio
            </Link>
          </Button>

          <header className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Obras digitais
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explorações visuais, protótipos interativos e experiências 3D criadas para artistas e parceiros.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            {cvData.artworks.map((artwork, index) => (
              <motion.article
                key={artwork.slug}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-[0_45px_85px_-70px_rgba(14,165,233,0.75)] backdrop-blur-xl"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                  <img
                    src={artwork.media[0]}
                    alt={artwork.title}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={360}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                      {artwork.year}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-2xl font-display font-semibold transition-colors group-hover:text-primary">
                      {artwork.title}
                    </h2>
                    <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                      <Palette className="mr-1 inline h-3 w-3" aria-hidden />
                      {artwork.materials[0]}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground/90">{artwork.description}</p>

                  <div className="mt-auto">
                    <Link
                      to={`/art/${artwork.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Explorar obra
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
