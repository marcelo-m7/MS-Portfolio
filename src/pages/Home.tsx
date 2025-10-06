import { lazy, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Code2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import cvData from "../../public/data/cv.json";

const HeroScene = lazy(() => import("@/components/Hero3D"));

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 flex items-center justify-center">
      <svg
        viewBox="0 0 600 600"
        className="h-[70vh] w-[70vh] max-w-4xl opacity-70"
        role="img"
        aria-labelledby="hero-title"
      >
        <title id="hero-title">Ilustração abstrata em gradiente</title>
        <defs>
          <radialGradient id="heroGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#0EA5E9" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="300" r="280" fill="url(#heroGradient)" />
      </svg>
    </div>
  );
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {shouldReduceMotion ? (
          <HeroBackdrop />
        ) : (
          <Suspense fallback={<HeroBackdrop />}>
            <HeroScene />
          </Suspense>
        )}

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-5 py-2 text-sm font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
              <span>{cvData.profile.location}</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-display font-bold leading-tight md:text-7xl">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {cvData.profile.name}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground/90 md:text-2xl">
                {cvData.profile.headline}
              </p>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground/80 md:text-lg">
                {cvData.profile.bio}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full border-0 px-8 py-6 text-base font-semibold tracking-wide text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] transition hover:shadow-[0_0_40px_rgba(14,165,233,0.35)]"
              >
                <Link to="/portfolio" aria-label="Explorar o portfólio completo">
                  <Code2 className="mr-2 h-5 w-5" aria-hidden="true" />
                  Explorar Portfólio
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold transition hover:bg-card/60"
              >
                <Link to="/contact">Falar com o estúdio</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <Link
                to="/thoughts"
                className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1 text-secondary transition hover:border-secondary/60 hover:text-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
              >
                Ler as últimas reflexões
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>

        {!shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="flex h-12 w-6 items-start justify-center rounded-full border border-muted-foreground/30 p-2">
              <motion.span
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatType: "loop" }}
                className="h-2 w-1 rounded-full bg-primary"
              />
            </div>
          </motion.div>
        )}
      </section>

      <section className="px-6 py-24">
        <div className="container mx-auto">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
            className="mb-16 text-center"
          >
            <span className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Destaques recentes
            </span>
            <h2 className="mt-6 text-4xl font-display font-bold md:text-5xl">
              Experiências digitais com propósito
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Uma curadoria das criações que combinam tecnologia acessível, storytelling e estética Art Leo.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cvData.projects.slice(0, 6).map((project, index) => (
              <motion.a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.08, duration: 0.45 }}
                className="group rounded-3xl border border-border/50 bg-card/60 p-6 transition hover:-translate-y-1 hover:border-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
                aria-label={`Abrir o projeto ${project.name} em uma nova aba`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-[0_0_20px_rgba(124,58,237,0.45)]">
                      <Code2 className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {project.year}
                      </p>
                      <p className="text-sm text-muted-foreground">{project.category}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                  {project.name}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground/90">
                  {project.summary}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground/80">
                  {project.stack.slice(0, 3).map((tech) => (
                    <li key={tech} className="rounded-full bg-muted/40 px-3 py-1 font-medium">
                      {tech}
                    </li>
                  ))}
                </ul>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6">
              <Link to="/portfolio">
                Ver todos os projetos
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
