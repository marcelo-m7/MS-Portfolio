import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import cvData from '../../public/data/cv.json';

const Hero3D = lazy(() => import('@/components/Hero3D'));

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Suspense
          fallback={
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.25),_transparent_55%)]" />
          }
        >
          <Hero3D />
        </Suspense>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={prefersReducedMotion ? undefined : { scale: 0.9, opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 shadow-[0_20px_35px_-25px_rgba(56,189,248,0.55)]"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">{cvData.profile.location}</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-balance">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {cvData.profile.name}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
              {cvData.profile.headline}
            </p>

            <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
              {cvData.profile.bio}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="rounded-full text-lg px-8 py-6 bg-gradient-to-r from-primary via-secondary to-accent shadow-[0_15px_45px_-20px_rgba(14,165,233,0.75)] transition-transform hover:-translate-y-0.5 focus-visible:ring-secondary"
              >
                <Link to="/portfolio">
                  <Code2 className="mr-2" />
                  Explorar Portfolio
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full text-lg px-8 py-6 border-2 border-border/80 bg-card/30 backdrop-blur-sm transition hover:border-primary/80 hover:text-primary"
              >
                <Link to="/contact">
                  Entre em Contato
                </Link>
              </Button>
            </div>

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-10 flex flex-col items-center gap-3 text-sm text-muted-foreground/80"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2">
                <PenSquare className="h-4 w-4 text-secondary" aria-hidden />
                <span>Nova rota: reflexões em tecnologia e arte</span>
              </div>
              <Link
                to="/thoughts"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/70 to-primary/70 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-24px_rgba(56,189,248,0.75)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:brightness-105"
              >
                Ler os pensamentos recentes
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, 12, 0] }}
              transition={prefersReducedMotion ? undefined : { duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seleção dos melhores trabalhos do ecossistema Monynha
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvData.projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.name}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-[0_25px_45px_-35px_rgba(56,189,248,0.65)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_18px_38px_-20px_rgba(124,58,237,0.5)]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/70 text-white shadow-[0_0_20px_rgba(124,58,237,0.45)]">
                        <Code2 className="text-white" size={24} aria-hidden />
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>

                    <p className="text-muted-foreground mb-4 text-sm">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-md bg-muted/60 text-foreground/80"
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
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline" size="lg" className="rounded-full border-border/70">
              <Link to="/portfolio">
                Ver Todos os Projetos
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
