import { useState, lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Maximize2 } from 'lucide-react';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const ArtworkPreview3D = lazy(() => import('@/components/ArtworkPreview3D'));

export default function ArtworkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const artwork = cvData.artworks?.find((item) => item.slug === slug);
  const [lightboxMedia, setLightboxMedia] = useState<string | null>(null);
  const [show3D, setShow3D] = useState(false);

  if (!artwork) {
    return (
      <div className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">Obra não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            Esta obra não está disponível. Que tal voltar para o portfolio e descobrir outras experiências?
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link to="/portfolio">Explorar portfolio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleLightbox = (media: string | null) => {
    setLightboxMedia(media);
  };

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border/70 bg-card/70 p-8 shadow-[0_45px_85px_-70px_rgba(124,58,237,0.85)] backdrop-blur-xl"
        >
          <Button
            asChild
            variant="ghost"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <Link to="/portfolio">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Voltar para o portfolio
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
              {artwork.year}
            </span>
            {artwork.materials.map((material) => (
              <Badge key={material} variant="outline" className="border-border/60 text-muted-foreground">
                {material}
              </Badge>
            ))}
          </div>

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">{artwork.title}</h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{artwork.description}</p>

          {artwork.media?.length > 0 && (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {artwork.media.map((media, index) => (
                <button
                  key={media}
                  type="button"
                  onClick={() => handleLightbox(media)}
                  className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/60 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <img
                    src={media}
                    alt={`${artwork.title} – visual ${index + 1}`}
                    width={640}
                    height={360}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-x-4 bottom-4 inline-flex items-center justify-between rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-semibold text-foreground">
                    Ampliar visual
                    <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </button>
              ))}
            </div>
          )}

          {artwork.url3d && (
            <div className="mt-10 rounded-3xl border border-border/60 bg-background/60 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Experiência imersiva</p>
                  <p className="text-base text-muted-foreground/90">
                    Abre uma prévia 3D com controles orbitais diretamente no browser.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    className="rounded-full border-border/70"
                    onClick={() => setShow3D(true)}
                  >
                    Pré-visualizar em 3D
                  </Button>
                  <Button asChild className="rounded-full bg-gradient-to-r from-primary via-secondary to-accent">
                    <a href={artwork.url3d} target="_blank" rel="noopener noreferrer">
                      Visitar projeto completo
                      <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Dialog open={lightboxMedia !== null} onOpenChange={(open) => !open && handleLightbox(null)}>
        <DialogContent className="max-w-3xl rounded-3xl border border-border/70 bg-card/95 p-0">
          {lightboxMedia && (
            <img
              src={lightboxMedia}
              alt={`${artwork.title} – visual ampliado`}
              width={960}
              height={540}
              className="h-full w-full rounded-3xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={show3D} onOpenChange={setShow3D}>
        <DialogContent className="max-w-4xl rounded-3xl border border-border/70 bg-card/95">
          <Suspense
            fallback={
              <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
                Carregando visualização 3D…
              </div>
            }
          >
            {show3D ? <ArtworkPreview3D /> : null}
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
}
