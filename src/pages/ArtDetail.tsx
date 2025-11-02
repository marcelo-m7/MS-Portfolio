import { useState, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Maximize2, Orbit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingArtDetail } from '@/components/LoadingStates';
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
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslatedText } from '@/hooks/useTranslatedContent';
import BackButton from '@/components/shared/BackButton';
import NotFoundState from '@/components/shared/NotFoundState';
import MetadataBadge from '@/components/shared/MetadataBadge';
import { Calendar } from 'lucide-react';

const MotionButton = motion(Button);

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
  const t = useTranslations();
  const { data: artwork, isLoading } = useArtwork(slug ?? '');
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [is3DOpen, setIs3DOpen] = useState(false);
  
  // Translate content
  const notFoundMessage = useTranslatedText('Esta peça artística não existe ou foi movida. Volte ao portfolio para descobrir outras experiências digitais.');
  const translatedDescription = useTranslatedText(artwork?.description ?? '');

  // Extract arrays from database objects
  const mediaUrls = artwork?.media?.map(m => m.media_url) ?? [];
  const materials = artwork?.materials?.map(m => m.material) ?? [];

  const canRender3DPreview = Boolean(artwork?.url_3d && Art3DPreviewLazy);

  const handleOpenMedia = (media: string) => {
    setActiveMedia(media);
    setIsMediaOpen(true);
  };

  if (isLoading) {
    return <LoadingArtDetail />;
  }

  if (!artwork) {
    return (
      <NotFoundState
        message={notFoundMessage}
        backTo="/portfolio"
        backLabel={t.nav.portfolio}
      />
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
          <BackButton to="/portfolio" label="Voltar ao Portfolio" />

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <MetadataBadge icon={Calendar} className="text-sm">
              {new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(
                new Date(`${artwork.year}-01-01`),
              )}
            </MetadataBadge>
            <MetadataBadge icon={Calendar} className="text-sm">
              {materials.join(' • ')}
            </MetadataBadge>
          </div>

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">
            {artwork.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{translatedDescription}</p>

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
                <img
                  src={media}
                  alt={`${artwork.title} — visual ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error(`Failed to load media: ${media}`);
                    target.style.display = 'none';
                  }}
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