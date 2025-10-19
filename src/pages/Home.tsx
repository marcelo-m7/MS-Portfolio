import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, PenSquare, Layers, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import cvData from '../../public/data/cv.json';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden py-16">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={containerVariants}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            animate={prefersReducedMotion ? undefined : 'visible'}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 shadow-[0_20px_35px_-25px_hsl(var(--secondary)/0.2)]"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">{cvData.profile.location}</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-display font-bold mb-6 mt-6 text-balance"
            >
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {cvData.profile.name}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium"
            >
              {cvData.profile.headline}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto"
            >
              {cvData.profile.bio}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="px-10 shadow-lg shadow-secondary/30"
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
                className="border-2 border-border/70 bg-card/60 px-10 hover:border-primary/70 hover:text-primary"
              >
                <Link to="/contact">
                  Entre em Contato
                </Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col items-center gap-3 text-sm text-muted-foreground/80"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2"
              >
                <PenSquare className="h-4 w-4 text-secondary" aria-hidden />
                <span>Nova rota: reflexões em tecnologia e arte</span>
              </motion.div>
              <Button asChild className="bg-gradient-to-r from-secondary/80 to-primary/80 px-5 text-sm font-semibold text-white shadow-md hover:brightness-105">
                <Link to="/thoughts">
                  Ler os pensamentos recentes
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
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
            {cvData.projects.slice(0, 6).map((project, index) => {
              const linkTarget = project.url ?? project.repoUrl;

              return (
                <motion.div
                  key={project.name}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <motion.a
                    href={linkTarget}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${project.name} em nova aba`}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    style={{ transformStyle: 'preserve-3d' }}
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                      : { rotateX: -6, rotateY: 6, translateZ: 12 }
                  }
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                >
                  <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/70 text-white shadow-md">
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
                          className="text-xs px-3 py-1 rounded-xl bg-muted/60 text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  </motion.a>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline" size="lg" className="border-border/70">
              <Link to="/portfolio">
                Ver Todos os Projetos
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Collections & Art */}
      <section className="pb-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Coleções & Arte
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experiências imersivas e séries experimentais que conectam tecnologia, narrativa e arte digital.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link
                to="/series/creative-systems"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-6 shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary via-primary to-accent text-white shadow-md">
                    <Layers aria-hidden className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                    Creative Systems
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground/90">
                    Coleção de trabalhos que explora IA aplicada, automação inteligente e interfaces artísticas conectadas ao laboratório Monynha.
                  </p>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                to="/art/artleo"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-6 shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-md">
                    <Palette aria-hidden className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                    Art Leo Creative Spaces
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground/90">
                    Experiência 3D com narrativas interativas e composição sonora inspirada nos espaços criativos de Leonardo Silva.
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}