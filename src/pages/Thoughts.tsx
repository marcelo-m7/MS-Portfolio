import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import cvData from '../../public/data/cv.json';

export default function Thoughts() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Pensamentos
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Reflexões sobre tecnologia, design e acessibilidade em múltiplos idiomas.
            </p>
          </div>

          <div className="grid gap-8">
            {cvData.thoughts.map((thought, index) => (
              <motion.article
                key={thought.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass rounded-3xl p-8 hover:shadow-[0_24px_60px_rgba(124,58,237,0.25)] transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-[0.3em] mb-4">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {new Date().getFullYear()}
                </div>

                <h2 className="text-3xl font-display font-semibold mb-3">
                  {thought.title}
                </h2>

                <p className="text-lg text-muted-foreground mb-6">
                  {thought.excerpt}
                </p>

                <Link
                  to={`/thoughts/${thought.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full px-4 py-2"
                >
                  Ler mais
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
