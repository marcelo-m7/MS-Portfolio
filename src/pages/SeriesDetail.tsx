import { Navigate, useParams, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import cvData from "../../public/data/cv.json";

const artworksBySlug = new Map(cvData.artworks.map((art) => [art.slug, art]));
const projectsBySlug = new Map(cvData.projects.map((project) => [project.slug ?? project.name.toLowerCase().replaceAll(" ", "-"), project]));

export default function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const series = cvData.series.find((item) => item.slug === slug);

  if (!series) {
    return <Navigate to="/portfolio" replace />;
  }

  const works = series.works?.map((workSlug) => ({
    slug: workSlug,
    artwork: artworksBySlug.get(workSlug),
    project: projectsBySlug.get(workSlug),
  }));

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
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Série</p>
          <h1 className="text-balance font-display text-4xl font-bold md:text-5xl">{series.title}</h1>
          <p className="text-lg text-muted-foreground">{series.description}</p>
          <span className="inline-flex items-center gap-2 rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
            {series.year}
          </span>
        </motion.header>

        <motion.section
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.15, duration: 0.6 }}
          className="mt-12 space-y-6"
        >
          {works?.map(({ slug: workSlug, artwork, project }) => (
            <div
              key={workSlug}
              className="glass flex flex-col gap-4 rounded-3xl border border-border/70 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {artwork?.title ?? project?.name ?? workSlug}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {artwork?.description ?? project?.summary ?? "Exploração criativa da série."}
                </p>
                {artwork?.materials && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {artwork.materials.map((material) => (
                      <span key={material} className="rounded-full bg-muted/70 px-2.5 py-0.5 uppercase tracking-wide">
                        {material}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {artwork ? (
                <Link
                  to={`/art/${artwork.slug}`}
                  className="inline-flex items-center gap-2 self-start rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Ver arte
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : project ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Ver projeto
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          ))}
        </motion.section>
      </div>
    </div>
  );
}
