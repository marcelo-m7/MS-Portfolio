import { useState, lazy, Suspense } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ExternalLink, Image as ImageIcon, Box } from "lucide-react";
import cvData from "../../public/data/cv.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ModelViewer = lazy(() => import("@/components/ModelViewer"));

const isModel = (path: string) => path.endsWith(".glb");

export default function ArtworkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const artwork = cvData.artworks.find((item) => item.slug === slug);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);

  if (!artwork) {
    return <Navigate to="/portfolio" replace />;
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-28">
      <div className="container mx-auto max-w-4xl">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-2 text-sm text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para o portfolio
        </Link>

        <motion.header
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 space-y-4"
        >
          <h1 className="text-balance font-display text-4xl font-bold md:text-5xl">{artwork.title}</h1>
          <p className="text-lg text-muted-foreground">{artwork.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="rounded-full bg-muted/70 px-3 py-1">{artwork.year}</span>
            {artwork.materials?.map((material) => (
              <span key={material} className="rounded-full bg-muted/70 px-3 py-1">
                {material}
              </span>
            ))}
          </div>

          {artwork.url3d && (
            <a
              href={artwork.url3d}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Visitar experiência completa
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </motion.header>

        <motion.section
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.15, duration: 0.6 }}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          {artwork.media.map((media) => (
            <Dialog key={media} open={activeMedia === media} onOpenChange={(open) => setActiveMedia(open ? media : null)}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  onClick={() => setActiveMedia(media)}
                  className="group flex flex-col gap-3 rounded-3xl border border-border/70 bg-card/70 p-6 text-left transition hover:border-secondary/60 hover:shadow-[0_25px_60px_rgba(14,165,233,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                    {isModel(media) ? <Box className="h-4 w-4" aria-hidden="true" /> : <ImageIcon className="h-4 w-4" aria-hidden="true" />}
                    {isModel(media) ? "Prévia 3D" : "Visualizar imagem"}
                  </span>
                  <span className="text-sm text-muted-foreground break-all">{media}</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl border-border/60 bg-background/95">
                <DialogHeader>
                  <DialogTitle>{artwork.title}</DialogTitle>
                  <DialogDescription>{artwork.description}</DialogDescription>
                </DialogHeader>
                {isModel(media) ? (
                  <Suspense fallback={<div className="flex h-[420px] items-center justify-center text-muted-foreground">Carregando modelo...</div>}>
                    <div className="h-[420px] overflow-hidden rounded-2xl border border-border/60 bg-card/80">
                      <ModelViewer src={media} />
                    </div>
                  </Suspense>
                ) : (
                  <img
                    src={media}
                    alt={`${artwork.title} preview`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                )}
              </DialogContent>
            </Dialog>
          ))}
        </motion.section>
      </div>
    </div>
  );
}
