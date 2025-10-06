import { lazy, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Code2, Sparkles, Feather } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import cvData from "../../public/data/cv.json";

const HeroScene = lazy(() => import("@/components/HeroScene"));

const HeroFallback = () => (
  <div
    role="img"
    aria-label="Ilustração abstrata com gradientes roxos e azuis"
    className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
  >
    <svg
      width="720"
      height="720"
      viewBox="0 0 720 720"
      className="h-[80vmin] max-h-[520px] w-auto opacity-70"
    >
      <defs>
        <radialGradient id="hero-fallback-gradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.85)" />
          <stop offset="45%" stopColor="hsl(var(--secondary) / 0.65)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="360" cy="360" r="320" fill="url(#hero-fallback-gradient)" />
      <circle cx="260" cy="280" r="120" fill="hsl(var(--accent) / 0.25)" />
      <circle cx="440" cy="420" r="140" fill="hsl(var(--primary) / 0.2)" />
    </svg>
  </div>
);

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Suspense fallback={<HeroFallback />}>
          {prefersReducedMotion ? <HeroFallback /> : <HeroScene />}
        </Suspense>

        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={prefersReducedMotion ? undefined : { scale: 0.92, opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
            >
              <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
              <span className="text-sm font-medium">{cvData.profile.location}</span>
            </motion.div>

            <h1 className="text-balance font-display text-4xl font-bold sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {cvData.profile.name}
              </span>
            </h1>

            <p className="mt-6 text-xl font-medium text-muted-foreground md:text-2xl">
              {cvData.profile.headline}
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground/80">
              {cvData.profile.bio}
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="glow-purple rounded-2xl bg-primary px-8 py-6 text-lg hover:bg-primary/90 focus-visible:ring-primary"
              >
                <Link to="/portfolio" className="flex items-center">
                  <Code2 className="mr-2" aria-hidden="true" />
                  Explorar Portfolio
                  <ArrowRight className="ml-2" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl border-2 px-8 py-6 text-lg hover:bg-card"
              >
                <Link to="/contact">Entre em Contato</Link>
              </Button>

              <Link
                to="/thoughts"
                className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-secondary transition hover:text-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Feather className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                Ler pensamentos recentes
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        {!prefersReducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="flex h-12 w-8 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-1.5">
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, 18, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="h-2 w-1 rounded-full bg-primary"
              />
            </div>
          </motion.div>
        )}
      </section>

      {/* Featured Projects */}
      <section className="px-6 py-24">
        <div className="container mx-auto">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-display font-bold md:text-5xl">Projetos em Destaque</h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-muted-foreground">
              Seleção dos melhores trabalhos do ecossistema Monynha
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cvData.projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.name}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: prefersReducedMotion ? 0 : index * 0.08, duration: 0.5 }}
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="glass flex h-full flex-col rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(76,29,149,0.25)]">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-[0_0_25px_hsl(var(--glow-purple)/0.45)]">
                        <Code2 className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {project.name}
                    </h3>

                    <p className="mt-3 flex-1 text-sm text-muted-foreground">{project.summary}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: 0.4 }}
            className="mt-12 text-center"
          >
            <Button asChild variant="outline" size="lg" className="rounded-2xl">
              <Link to="/portfolio">
                Ver Todos os Projetos
                <ArrowRight className="ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
