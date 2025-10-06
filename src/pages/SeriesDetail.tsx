import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Calendar, Layers3 } from 'lucide-react';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';

const getWorksFromSeries = (slugs: string[]) =>
  cvData.artworks.filter((artwork) => slugs.includes(artwork.slug));

export default function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const serie = cvData.series.find((item) => item.slug === slug);

  if (!serie) {
    return (
      <div className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">Série não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            A série procurada não existe ou foi arquivada. Volta para a biblioteca criativa para explorar outras experiências.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link to="/series">Ver todas as séries</Link>
          </Button>
        </div>
      </div>
    );
  }

  const works = getWorksFromSeries(serie.works);

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-[0_48px_85px_-70px_rgba(124,58,237,0.85)] backdrop-blur-xl"
        >
          <Button
            asChild
            variant="ghost"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <Link to="/series">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Voltar para séries
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
              <Calendar className="h-3 w-3" aria-hidden />
              {serie.year}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
              <Layers3 className="h-3 w-3" aria-hidden />
              {works.length} obras destacadas
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">{serie.title}</h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{serie.description}</p>

          <div className="mt-10 grid gap-6">
            {works.map((artwork) => (
              <Link
                key={artwork.slug}
                to={`/art/${artwork.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/40 p-6 transition hover:border-primary/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-display font-semibold transition-colors group-hover:text-primary">
                      {artwork.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground/80">{artwork.materials.join(' • ')}</p>
                  </div>
                  <span className="self-start rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {artwork.year}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{artwork.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Acessar obra
                  <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden />
                </span>
              </Link>
            ))}
            {works.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-6 text-sm text-muted-foreground">
                Ainda não existem obras associadas a esta série. Volta em breve para novidades luminosas.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
