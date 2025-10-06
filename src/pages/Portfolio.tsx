import { useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import cvData from "../../public/data/cv.json";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Project = (typeof cvData.projects)[number];

const categories = ["Todos", ...new Set(cvData.projects.map((project) => project.category))];

const getAltText = (project: Project) => `${project.name} — ${project.summary}`;

function ProjectCard({ project }: { project: Project }) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [10, -10]), {
    stiffness: 180,
    damping: 22,
    mass: 0.6,
  });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-10, 10]), {
    stiffness: 180,
    damping: 22,
    mass: 0.6,
  });

  const resetTilt = () => {
    x.set(0);
    y.set(0);
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left - bounds.width / 2;
    const offsetY = event.clientY - bounds.top - bounds.height / 2;
    x.set(offsetX);
    y.set(offsetY);
  };

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
      style={prefersReducedMotion ? undefined : { rotateX, rotateY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="glass flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 p-6 shadow-[0_25px_80px_rgba(59,7,100,0.25)] transition-transform duration-300 ease-out hover:-translate-y-1">
        <AspectRatio ratio={16 / 9}>
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20">
            <img
              src={project.thumbnail}
              width={640}
              height={360}
              loading="lazy"
              decoding="async"
              alt={getAltText(project)}
              className="h-full w-full object-cover"
            />
            <span className="absolute right-4 top-4 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-[0_10px_25px_rgba(15,23,42,0.35)]">
              {project.year}
            </span>
          </div>
        </AspectRatio>

        <div className="mt-5 flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
              {project.name}
            </h3>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {project.category}
            </span>
          </div>

          <p className="mt-4 flex-1 text-sm text-muted-foreground">{project.summary}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/80"
              >
                {tech}
              </span>
            ))}
          </div>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-2.5 group-hover:text-primary/90">
            Ver Projeto
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState<string>("Todos");
  const prefersReducedMotion = useReducedMotion();

  const filteredProjects =
    filter === "Todos"
      ? cvData.projects
      : cvData.projects.filter((project) => project.category === filter);

  return (
    <div className="min-h-screen px-6 pb-16 pt-28">
      <div className="container mx-auto">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-balance font-display text-5xl font-bold md:text-6xl">Portfolio</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Projetos e trabalhos desenvolvidos no ecossistema Monynha
          </p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.1, duration: 0.4 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-3"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                filter === category
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_10px_35px_rgba(76,29,149,0.35)]"
                  : "bg-card/60 hover:bg-card"
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>

        {cvData.series?.length ? (
          <motion.section
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: 0.6 }}
            className="mt-16 rounded-3xl border border-border/60 bg-card/70 p-8 shadow-[0_30px_90px_rgba(14,165,233,0.12)]"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold">Séries criativas</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Coleções que exploram narrativas visuais, experimentos imersivos e arte generativa.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {cvData.series.map((serie) => (
                  <Link
                    key={serie.slug}
                    to={`/series/${serie.slug}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-semibold text-secondary transition hover:border-secondary hover:text-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {serie.title}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.section>
        ) : null}

        {filteredProjects.length === 0 && (
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            className="py-16 text-center"
          >
            <p className="text-lg text-muted-foreground">Nenhum projeto encontrado nesta categoria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
