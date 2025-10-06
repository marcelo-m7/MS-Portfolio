import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import cvData from '../../public/data/cv.json';
import { Suspense, lazy, useMemo } from 'react';

const Hero3D = lazy(() => import('@/components/Hero3D'));

const ReducedMotionHero = () => (
  <div className="absolute inset-0 -z-10">
    <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.45),rgba(15,23,42,0.85))]" />
  </div>
);

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  const heroBackground = useMemo(() => {
    if (prefersReducedMotion) {
      return <ReducedMotionHero />;
    }

    return (
      <Suspense
        fallback={
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        }
      >
        <Hero3D />
      </Suspense>
    );
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {heroBackground}

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
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
                className="rounded-2xl text-lg px-8 py-6 bg-primary hover:bg-primary/90 glow-purple focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Link to="/portfolio">
                  <Code2 className="mr-2" aria-hidden="true" />
                  Explorar Portfolio
                  <ArrowRight className="ml-2" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl text-lg px-8 py-6 border-2 hover:bg-card focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Link to="/contact">Entre em Contato</Link>
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 text-sm text-muted-foreground"
            >
              <Link
                to="/thoughts"
                className="inline-flex items-center gap-2 rounded-full bg-muted/30 px-4 py-2 text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Últimas reflexões em Pensamentos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
                >
                  <div className="glass rounded-2xl p-6 h-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-purple">
                        <Code2 className="text-white" size={24} aria-hidden="true" />
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
                          className="text-xs px-2 py-1 rounded-md bg-muted/50 text-foreground/80"
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
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
