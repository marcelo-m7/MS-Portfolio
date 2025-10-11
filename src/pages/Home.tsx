import { useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, PenSquare, Layers, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MotionDiv } from '@/components/MotionDiv'; // Import MotionDiv
import { AnimatedLink } from '@/components/AnimatedLink'; // Import AnimatedLink
import { AnimatedButton } from '@/components/AnimatedButton'; // Import AnimatedButton
// import Hero3D from '@/components/Hero3D'; // Removed Hero3D
import cvData from '../../public/data/cv.json';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden">
        {/* <Hero3D /> Removed Hero3D */}

        <div className="container mx-auto px-6 relative z-10">
          <MotionDiv
            delay={0}
            duration={0.8}
            className="max-w-4xl mx-auto text-center"
          >
            <MotionDiv
              delay={0.2}
              duration={0.5}
              scaleFrom={0.9}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 shadow-[0_20px_35px_-25px_rgba(var(--secondary-hsl)/0.2)]"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">{cvData.profile.location}</span>
            </MotionDiv>

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
              <AnimatedButton
                asChild
                size="lg"
                className="rounded-full text-lg px-8 py-6 shadow-[0_15px_45px_-20px_rgba(var(--secondary-hsl)/0.4)]"
                hoverScale={1.02}
                tapScale={0.98}
              >
                <Link to="/portfolio">
                  <Code2 className="mr-2" />
                  Explorar Portfolio
                  <ArrowRight className="ml-2" />
                </Link>
              </AnimatedButton>

              <AnimatedButton
                asChild
                variant="outline"
                size="lg"
                className="rounded-full text-lg px-8 py-6 border-2 border-border/80 bg-card/30 backdrop-blur-sm transition hover:border-primary/80 hover:text-primary"
                hoverScale={1.02}
                tapScale={0.98}
              >
                <Link to="/contact">
                  Entre em Contato
                </Link>
              </AnimatedButton>
            </div>

            <MotionDiv
              delay={0.4}
              duration={0.6}
              className="mt-10 flex flex-col items-center gap-3 text-sm text-muted-foreground/80"
            >
              <MotionDiv
                delay={0.5}
                duration={0.4}
                scaleFrom={0.95}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2"
              >
                <PenSquare className="h-4 w-4 text-secondary" aria-hidden />
                <span>Nova rota: reflexões em tecnologia e arte</span>
              </MotionDiv>
              <AnimatedButton asChild className="rounded-full bg-gradient-to-r from-secondary/70 to-primary/70 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-24px_rgba(var(--secondary-hsl)/0.75)] transition">
                <Link to="/thoughts">
                  Ler os pensamentos recentes
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </AnimatedButton>
            </MotionDiv>
          </MotionDiv>
        </div>

        {/* Scroll indicator */}
        <MotionDiv
          delay={1}
          duration={1}
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
            <MotionDiv
              animate={prefersReducedMotion ? undefined : { y: [0, 12, 0] }}
              transition={prefersReducedMotion ? undefined : { duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full"
              initial={false}
            />
          </div>
        </MotionDiv>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <MotionDiv
            delay={0}
            duration={0.6}
            yOffset={20}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seleção dos melhores trabalhos do ecossistema Monynha
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvData.projects.slice(0, 6).map((project, index) => (
              <MotionDiv
                key={project.name}
                delay={index * 0.1}
                duration={0.5}
                yOffset={20}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <AnimatedLink
                  as="a"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  style={{ transformStyle: 'preserve-3d' }}
                  whileHover={{ rotateX: -6, rotateY: 6, translateZ: 12 }}
                  tapScale={0.99}
                  transitionStiffness={200}
                  transitionDamping={22}
                >
                  <div className="rounded-[var(--radius)] border border-border/70 bg-card/60 p-6 shadow-[0_15px_30px_-20px_hsl(var(--primary)/0.1)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_25px_50px_-25px_hsl(var(--primary)/0.3),_0_10px_20px_-10px_hsl(var(--secondary)/0.2)]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/70 text-white shadow-[0_0_20px_rgba(var(--primary-hsl)/0.2)]">
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
                </AnimatedLink>
              </MotionDiv>
            ))}
          </div>

          <MotionDiv
            delay={0}
            duration={0.6}
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <AnimatedButton asChild variant="outline" size="lg" className="rounded-full border-border/70">
              <Link to="/portfolio">
                Ver Todos os Projetos
                <ArrowRight className="ml-2" />
              </Link>
            </AnimatedButton>
          </MotionDiv>
        </div>
      </section>

      {/* Collections & Art */}
      <section className="pb-24 px-6">
        <div className="container mx-auto">
          <MotionDiv
            delay={0}
            duration={0.6}
            yOffset={20}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Coleções & Arte
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experiências imersivas e séries experimentais que conectam tecnologia, narrativa e arte digital.
            </p>
          </MotionDiv>

          <div className="grid gap-6 md:grid-cols-2">
            <MotionDiv
              delay={0.1}
              duration={0.6}
              yOffset={20}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <AnimatedLink
                to="/series/creative-systems"
                className="group block"
                hoverScale={1} // No scale on hover for these cards
                tapScale={0.99}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
              >
                <div className="flex h-full flex-col rounded-[var(--radius)] border border-border/70 bg-card/70 p-6 shadow-[0_20px_40px_-30px_hsl(var(--secondary)/0.1)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_-40px_hsl(var(--secondary)/0.3),_0_15px_30px_-15px_hsl(var(--accent)/0.2)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary via-primary to-accent text-white shadow-[0_0_20px_rgba(var(--primary-hsl)/0.2)]">
                    <Layers aria-hidden className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                    Creative Systems
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground/90">
                    Coleção de trabalhos que explora IA aplicada, automação inteligente e interfaces artísticas conectadas ao laboratório Monynha.
                  </p>
                </div>
              </AnimatedLink>
            </MotionDiv>

            <MotionDiv
              delay={0.2}
              duration={0.6}
              yOffset={20}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <AnimatedLink
                to="/art/artleo"
                className="group block"
                hoverScale={1} // No scale on hover for these cards
                tapScale={0.99}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
              >
                <div className="flex h-full flex-col rounded-[var(--radius)] border border-border/70 bg-card/70 p-6 shadow-[0_20px_40px_-30px_hsl(var(--accent)/0.1)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_-40px_hsl(var(--accent)/0.3),_0_15px_30px_-15px_hsl(var(--primary)/0.2)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-[0_0_20px_rgba(var(--secondary-hsl)/0.2)]">
                    <Palette aria-hidden className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                    Art Leo Creative Spaces
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground/90">
                    Experiência 3D com narrativas interativas e composição sonora inspirada nos espaços criativos de Leonardo Silva.
                  </p>
                </div>
              </AnimatedLink>
            </MotionDiv>
          </div>
        </div>
      </section>
    </div>
  );
}