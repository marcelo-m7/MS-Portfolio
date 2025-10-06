import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import cvData from '../../public/data/cv.json';

export default function Thoughts() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            asChild
            variant="ghost"
            className="mb-8 rounded-xl hover:bg-card"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>

          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Pensamentos
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Reflexões sobre tecnologia, design e acessibilidade
            </p>
          </div>

          <div className="space-y-8">
            {cvData.thoughts.map((thought, index) => (
              <motion.article
                key={thought.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-8 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <time>2025</time>
                  <span>•</span>
                  <BookOpen className="h-4 w-4" />
                  <span>Leitura de 3 min</span>
                </div>

                <h2 className="text-3xl font-display font-bold mb-3 hover:text-primary transition-colors">
                  {thought.title}
                </h2>

                <p className="text-lg text-muted-foreground mb-6 italic">
                  {thought.excerpt}
                </p>

                <Link
                  to={`/thoughts/${thought.slug}`}
                  className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full px-3 py-1"
                  aria-label={`Ler o artigo ${thought.title}`}
                >
                  Ler mais
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
