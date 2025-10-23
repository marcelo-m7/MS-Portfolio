import { useState, Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Maximize2, Orbit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useArtwork } from '@/hooks/usePortfolioData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  languageToLocale,
  useCurrentLanguage,
} from '@/hooks/useCurrentLanguage';

const MotionButton = motion(Button);
const MotionImg = motion.img;

const isArtPreview3DEnabled =
  import.meta.env.VITE_ENABLE_ART_3D?.toLowerCase() === 'true';

const Art3DPreviewLazy = isArtPreview3DEnabled
  ? lazy(() => import('@/components/Art3DPreview'))
  : null;

export default function ArtDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);
  const { data: artwork, isLoading } = useArtwork(slug ?? '');
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [is3DOpen, setIs3DOpen] = useState(false);

  // Extract arrays from database objects
  const mediaUrls = artwork?.media?.map(m => m.media_url) ?? [];
  const materials = artwork?.materials?.map(m => m.material) ?? [];

  const canRender3DPreview = Boolean(artwork?.url_3d && Art3DPreviewLazy);

  const handleOpenMedia = (media: string) => {
    setActiveMedia(media);
    setIsMediaOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-0 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-[var(--radius)] border border-border/60 bg-card/80 p-10 shadow-md backdrop-blur-xl">
            <Skeleton className="h-10 w-48 rounded-full mb-8" />
            <div className="space-y-4 mb-8">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-96 w-full rounded-lg mb-6" />
            <Skeleton className="h-32 w-full mb-6" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="py-0 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">Obra não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            Esta peça artística não existe ou foi movida. Volte ao portfolio para descobrir outras experiências digitais.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link to="/portfolio">Ver Portfolio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-0 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[var(--radius)] border border-border/60 bg-card/80 p-10 shadow-[0_45px_90px_-70px_hsl(var(--primary)/0.3)] backdrop-blur-xl"
        >
          <MotionButton
            asChild
            variant="ghost"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
            whileHover={prefersReducedMotion ? undefined : { x: -5 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link to="/portfolio">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Voltar ao Portfolio
            </Link>
          </MotionButton>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(
                new Date(`${artwork.year}-01-01`),
              )}
            </motion.span>
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {materials.join(' • ')}
            </motion.span>
          </div>

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">
            {artwork.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{artwork.description}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {mediaUrls.map((media, index) => (
              <motion.button
                key={`${media}-${index}`}
                type="button"
                onClick={() => handleOpenMedia(media)}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              >
                <MotionImg
                  src={media}
                  alt={`${artwork.title} — visual ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={360}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-background/70 via-background/20 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Maximize2 className="h-3 w-3" aria-hidden />
                    Expandir
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {artwork.url_3d && (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <MotionButton
                type="button"
                onClick={() => setIs3DOpen(true)}
                className="inline-flex items-center gap-2 rounded-full"
                disabled={!canRender3DPreview}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Orbit className="h-4 w-4" aria-hidden />
                {canRender3DPreview ? 'Explorar Experiência 3D' : 'Pré-visualização Indisponível'}
              </MotionButton>
              <motion.a
                href={artwork.url_3d}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Abrir em Nova Aba
                <ExternalLink className="h-4 w-4" aria-hidden />
              </motion.a>
              {!canRender3DPreview && (
                <p className="text-sm text-muted-foreground/80">
                  A visualização interativa está desativada nesta build. Defina VITE_ENABLE_ART_3D="true" para ativar.
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
        <DialogContent className="max-w-4xl border border-border/60 bg-card/90 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>{artwork.title}</DialogTitle>
            <DialogDescription>Visualização ampliada da obra.</DialogDescription>
          </DialogHeader>
          {typeof activeMedia === 'string' && (
            <img
              src={activeMedia}
              alt={`${artwork.title} em detalhe`}
              className="h-auto w-full rounded-2xl"
              loading="lazy"
            />
          )}
        </DialogContent>
      </Dialog>

      {artwork.url_3d && (
        <Dialog open={is3DOpen} onOpenChange={setIs3DOpen}>
          <DialogContent className="max-w-5xl border border-border/60 bg-card/90 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle>Exploração 3D</DialogTitle>
              <DialogDescription>
                Cena interativa da experiência Art Leo com controlo de órbita.
              </DialogDescription>
            </DialogHeader>
            <div className="h-[420px] w-full overflow-hidden rounded-2xl bg-background/80">
              {canRender3DPreview ? (
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Carregando visualização 3D…
                    </div>
                  }
                >
                  {prefersReducedMotion ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
                      <Orbit className="h-6 w-6" aria-hidden />
                      <p className="max-w-sm text-center text-sm">
                        A visualização 3D está desativada porque a preferência do sistema indica movimento reduzido.
                      </p>
                    </div>
                  ) : (
                    Art3DPreviewLazy && <Art3DPreviewLazy />
                  )}
                </Suspense>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
                  <Orbit className="h-6 w-6" aria-hidden />
                  <p className="max-w-sm text-center text-sm">
                    Esta build foi gerada sem os assets 3D locais. Abra o link externo para visualizar a cena.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}