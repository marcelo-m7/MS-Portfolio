import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ExternalLink, X } from "lucide-react";
import cvData from "../../public/data/cv.json";
import { Button } from "@/components/ui/button";

const isMediaImage = (src: string) => src.endsWith(".svg");

export default function ArtworkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const shouldReduceMotion = useReducedMotion();
  const artwork = cvData.artworks.find((item) => item.slug === slug);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (!artwork) {
    return (
      <div className="min-h-screen px-6 pb-20 pt-28">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold">Arte não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            A obra solicitada não existe ou foi movida.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/portfolio">Voltar ao portfólio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-24 pt-28">
      <div className="container mx-auto max-w-5xl">
        <Button
          asChild
          variant="ghost"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-border/60 hover:bg-card/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
        >
          <Link to="/portfolio">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao portfólio
          </Link>
        </Button>

        <motion.article
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="rounded-3xl border border-border/60 bg-card/70 p-10 shadow-[0_26px_80px_-45px_rgba(14,165,233,0.8)]"
        >
          <header className="space-y-4">
            <h1 className="text-4xl font-display font-bold leading-tight md:text-5xl">
              {artwork.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-background/70 px-3 py-1 font-semibold text-primary">
                {artwork.year}
              </span>
              <ul className="flex flex-wrap gap-2 text-xs">
                {artwork.materials.map((material) => (
                  <li
                    key={material}
                    className="rounded-full bg-muted/50 px-3 py-1 font-medium text-foreground/80"
                  >
                    {material}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-base text-muted-foreground md:text-lg">
              {artwork.description}
            </p>
          </header>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            {artwork.media.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setLightboxSrc(src)}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-muted/40 p-4 text-left transition hover:border-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
              >
                {isMediaImage(src) ? (
                  <img
                    src={src}
                    alt={`Visual da obra ${artwork.title}`}
                    loading="lazy"
                    width={480}
                    height={270}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Pré-visualização indisponível
                  </span>
                )}
              </button>
            ))}
          </section>

          {artwork.url3d && (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/60 p-6">
              <div className="max-w-xl text-sm text-muted-foreground">
                Explore a experiência completa em 3D no site dedicado.
              </div>
              <Button asChild className="rounded-full">
                <a href={artwork.url3d} target="_blank" rel="noopener noreferrer">
                  Visitar experiência 3D
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          )}
        </motion.article>
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-4xl rounded-3xl border border-border/60 bg-background p-6">
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-foreground transition hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
              aria-label="Fechar visualização"
            >
              <X className="h-4 w-4" />
            </button>
            {isMediaImage(lightboxSrc) ? (
              <img
                src={lightboxSrc}
                alt={`Visual ampliado da obra ${artwork.title}`}
                className="max-h-[70vh] w-full object-contain"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Conteúdo não disponível.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
