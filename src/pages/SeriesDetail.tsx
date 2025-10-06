import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ExternalLink, Layers } from "lucide-react";
import cvData from "../../public/data/cv.json";
import { Button } from "@/components/ui/button";

const projectsBySlug = new Map(
  cvData.projects.map((project) => [project.slug ?? project.name, project])
);

export default function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const shouldReduceMotion = useReducedMotion();
  const series = cvData.series.find((item) => item.slug === slug);

  if (!series) {
    return (
      <div className="min-h-screen px-6 pb-20 pt-28">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold">Série não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            Esta série artística não existe ou foi movida.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/portfolio">Voltar ao portfólio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const relatedProjects = series.works
    .map((workSlug) => projectsBySlug.get(workSlug))
    .filter((project): project is (typeof cvData.projects)[number] => Boolean(project));

  return (
    <div className="min-h-screen px-6 pb-24 pt-28">
      <div className="container mx-auto max-w-4xl">
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

        <motion.section
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="rounded-3xl border border-border/60 bg-card/70 p-10 shadow-[0_24px_70px_-40px_rgba(124,58,237,0.7)]"
        >
          <header className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
              <Layers className="h-4 w-4" aria-hidden="true" />
              Série artística
            </span>
            <h1 className="text-4xl font-display font-bold leading-tight md:text-5xl">
              {series.title}
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              {series.description}
            </p>
            <p className="text-sm font-semibold text-muted-foreground/80">
              {series.year}
            </p>
          </header>

          {relatedProjects.length > 0 && (
            <div className="mt-10 space-y-4">
              <h2 className="text-xl font-display font-semibold text-foreground">
                Obras relacionadas
              </h2>
              <ul className="space-y-3">
                {relatedProjects.map((project) => (
                  <li key={project.slug ?? project.name}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-secondary/60 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
                      aria-label={`Abrir o projeto ${project.name} em uma nova aba`}
                    >
                      <span>{project.name}</span>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
