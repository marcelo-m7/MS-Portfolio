import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import cvData from "../../public/data/cv.json";
import { Button } from "@/components/ui/button";

type Project = (typeof cvData.projects)[number];

const formatCategoryLabel = (category: string) => category;

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((offsetY - centerY) / centerY) * -6;
    const rotateY = ((offsetX - centerX) / centerX) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const motionProps = shouldReduceMotion
    ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
      };

  return (
    <motion.article
      {...motionProps}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: shouldReduceMotion ? 0 : index * 0.08, duration: 0.5 }}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handlePointerMove}
        onMouseLeave={resetTilt}
        onBlur={resetTilt}
        style={
          shouldReduceMotion
            ? undefined
            : {
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }
        }
        className="group block h-full rounded-[28px] border border-border/40 bg-card/60 p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-background"
        aria-label={`Abrir o projeto ${project.name} em uma nova aba`}
      >
        <div className="flex h-full flex-col rounded-[24px] bg-gradient-to-br from-background/90 via-background/60 to-background/30 p-6 shadow-[0_20px_60px_-35px_rgba(14,165,233,0.6)] transition-colors duration-300 group-hover:shadow-[0_24px_70px_-30px_rgba(124,58,237,0.55)]">
          <figure className="relative mb-6 overflow-hidden rounded-3xl border border-border/60 bg-muted/30 shadow-inner">
            <div className="aspect-video"></div>
            <img
              src={project.thumbnail}
              alt={`Thumbnail do projeto ${project.name}`}
              loading="lazy"
              width={320}
              height={180}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
              {project.year}
            </span>
          </figure>

          <div className="flex flex-1 flex-col gap-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-2xl font-display font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                {project.name}
              </h3>
              <span className="whitespace-nowrap rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                {project.category}
              </span>
            </div>

            <p className="text-sm text-muted-foreground/90">
              {project.summary}
            </p>

            <ul className="flex flex-wrap gap-2" aria-label="Tecnologias utilizadas">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-muted/40 px-3 py-1 text-xs font-medium text-foreground/80 transition-colors group-hover:bg-muted/60"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors group-hover:text-secondary/80">
              Ver projeto
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </a>
    </motion.article>
  );
}

export default function Portfolio() {
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<string>("Todos");

  const categories = useMemo(
    () => ["Todos", ...new Set(cvData.projects.map((p) => p.category))],
    []
  );

  const filteredProjects = useMemo(() => {
    if (filter === "Todos") return cvData.projects;
    return cvData.projects.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Portfólio vivo
          </span>
          <h1 className="mt-6 text-balance text-4xl font-display font-bold leading-tight md:text-6xl">
            Impacto digital com acessibilidade e arte
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {`Seleciona uma categoria e explora as experiências criativas desenvolvidas no universo Monynha.`}
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.15, duration: shouldReduceMotion ? 0 : 0.4 }}
          className="mb-12 flex flex-wrap justify-center gap-3"
        >
          {categories.map((category) => {
            const isActive = filter === category;
            return (
              <Button
                key={category}
                variant={isActive ? "default" : "outline"}
                onClick={() => setFilter(category)}
                aria-pressed={isActive}
                className={`rounded-full border-0 px-5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_25px_rgba(124,58,237,0.35)]"
                    : "bg-background/60 text-muted-foreground hover:text-foreground"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background`}
              >
                {formatCategoryLabel(category)}
              </Button>
            );
          })}
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.slug ?? project.name}
              project={project}
              index={index}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="text-lg text-muted-foreground">
              Nenhum projeto encontrado nesta categoria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
