import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Code2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import cvData from '../../public/data/cv.json';

const Hero3D = lazy(() => import('@/components/Hero3D'));

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Suspense
          fallback={<div className="absolute inset-0 hero-aurora" aria-hidden />}
        >
          <Hero3D />
        </Suspense>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" aria-hidden />
              <span className="text-sm font-medium tracking-wide">
                {cvData.profile.location}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-balance">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {cvData.profile.name}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
              {cvData.profile.headline}
            </p>

            <p className="text-lg text-muted-foreground/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              {cvData.profile.bio}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="rounded-2xl text-lg px-8 py-6 bg-primary hover:bg-primary/90 glow-purple focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Link to="/portfolio">
                  <Code2 className="mr-2" aria-hidden />
                  Explorar Portfolio
                  <ArrowRight className="ml-2" aria-hidden />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl text-lg px-8 py-6 border-2 hover:bg-card focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Link to="/contact">Entre em Contato</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <Link
                to="/thoughts"
                className="group inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <BookOpen className="h-4 w-4 text-secondary transition-transform group-hover:-translate-y-0.5" aria-hidden />
                Descubra os pensamentos mais recentes
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <span className="hidden md:inline text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                Conteúdo traduzido automaticamente para EN · ES · FR
              </span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden
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
      <section className="relative py-24 px-6">
        <div className="absolute inset-x-0 -top-16 h-64 pointer-events-none bg-gradient-to-b from-primary/10 via-background to-background blur-3xl" aria-hidden />
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-3xl"
                >
                  <div className="glass rounded-3xl overflow-hidden h-full flex flex-col shadow-[0_20px_60px_rgba(124,58,237,0.2)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_28px_80px_rgba(56,189,248,0.25)]">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <span className="absolute top-4 right-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                        {project.year}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-2xl font-display font-semibold group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <span className="text-xs font-semibold tracking-wide uppercase rounded-full bg-muted/60 px-3 py-1 text-muted-foreground whitespace-nowrap">
                          {project.category}
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                        {project.summary}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.stack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-1 rounded-lg bg-primary/15 text-primary/90"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
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
            className="text-center mt-16"
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Link to="/portfolio">
                Ver Todos os Projetos
                <ArrowRight className="ml-2" aria-hidden />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
