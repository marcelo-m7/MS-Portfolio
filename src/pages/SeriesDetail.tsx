import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const series = cvData.series?.find((item) => item.slug === slug);

  if (!series) {
    return (
      <div className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">Série não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            Não foi possível localizar esta série criativa. Explora outros projetos no portfolio.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link to="/portfolio">Ver portfolio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const artworks = (series.works ?? [])
    .map((workSlug) => cvData.artworks?.find((art) => art.slug === workSlug))
    .filter((item): item is (typeof cvData.artworks)[number] => Boolean(item));

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border/70 bg-card/70 p-8 shadow-[0_35px_70px_-60px_rgba(56,189,248,0.75)] backdrop-blur-xl"
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

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
              <Sparkles className="h-3 w-3" aria-hidden />
              Série criativa
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
              Ano {series.year}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">
            {series.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{series.description}</p>

          {artworks.length > 0 && (
            <div className="mt-10 space-y-6">
              <h2 className="text-2xl font-display font-semibold text-foreground">Peças em destaque</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {artworks.map((art, index) => (
                  <motion.article
                    key={art.slug}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="group flex flex-col rounded-3xl border border-border/60 bg-background/60 p-6 shadow-[0_25px_55px_-45px_rgba(124,58,237,0.75)]"
                  >
                    <div className="relative mb-4 overflow-hidden rounded-2xl border border-border/50 bg-card/60">
                      <img
                        src={art.media[0]}
                        alt={`${art.title} – visual principal`}
                        width={640}
                        height={360}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
                        {art.year}
                      </span>
                      {art.materials.map((material) => (
                        <Badge key={material} variant="outline" className="border-border/60 text-muted-foreground">
                          {material}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="mt-4 text-2xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {art.title}
                    </h3>

                    <p className="mt-3 text-sm text-muted-foreground/90">{art.description}</p>

                    <div className="mt-auto pt-6">
                      <Link
                        to={`/art/${art.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Explorar obra
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
