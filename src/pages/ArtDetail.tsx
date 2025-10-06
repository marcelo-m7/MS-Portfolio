import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Layers } from 'lucide-react';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';

export default function ArtDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const artwork = cvData.artworks.find((item) => item.slug === slug);

  if (!artwork) {
    return (
      <div className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">Obra não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            Não conseguimos localizar esta obra digital. Visita a galeria completa para descobrir outras experiências.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link to="/art">Ver todas as obras</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-[0_52px_95px_-75px_rgba(14,165,233,0.85)] backdrop-blur-xl"
        >
          <Button
            asChild
            variant="ghost"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <Link to="/art">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Voltar para a galeria
            </Link>
          </Button>

          <header className="flex flex-col gap-4">
            <h1 className="text-4xl font-display font-semibold text-foreground">{artwork.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
                {artwork.year}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
                <Layers className="h-3 w-3" aria-hidden />
                {artwork.materials.join(' • ')}
              </span>
            </div>
            <p className="text-lg text-muted-foreground/90">{artwork.description}</p>
          </header>

          <div className="mt-10 grid gap-6">
            {artwork.media.map((mediaSrc, index) => (
              <figure
                key={mediaSrc}
                className="overflow-hidden rounded-3xl border border-border/60 bg-background/40"
              >
                <img
                  src={mediaSrc}
                  alt={`${artwork.title} – visual ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  width={960}
                  height={540}
                  className="w-full object-cover"
                />
              </figure>
            ))}
          </div>

          {artwork.url3d && (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/50 p-6">
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground">Exploração 3D</h2>
                <p className="text-sm text-muted-foreground/80">
                  Abre a experiência completa em uma nova aba para interagir com o modelo 3D e a ambientação sonora.
                </p>
              </div>
              <a
                href={artwork.url3d}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-secondary to-accent px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_45px_-28px_rgba(124,58,237,0.85)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Visitar experiência imersiva
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
