import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Thoughts() {
  const { content } = useLanguage();
  const { thoughts, profile, ui } = content;

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button asChild variant="ghost" className="mb-8 rounded-xl hover:bg-card">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {ui.thoughts.back}
            </Link>
          </Button>

          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {ui.thoughts.title}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">{ui.thoughts.subtitle}</p>
          </div>

          <div className="space-y-8">
            {thoughts.map((thought, index) => (
              <motion.article
                key={thought.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-8 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <time>{ui.thoughts.year}</time>
                  <span>•</span>
                  <BookOpen className="h-4 w-4" />
                  <span>{ui.thoughts.readingTime}</span>
                </div>

                <h2 className="text-3xl font-display font-bold mb-3 hover:text-primary transition-colors">
                  {thought.title}
                </h2>

                <p className="text-lg text-muted-foreground mb-4 italic">{thought.excerpt}</p>

                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground/90 leading-relaxed">{thought.body}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">{profile.headline}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
