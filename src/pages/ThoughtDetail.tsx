import { useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import cvData from '../../public/data/cv.json';

export default function ThoughtDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const thought = useMemo(
    () => cvData.thoughts.find((item) => item.slug === slug),
    [slug]
  );

  if (!thought) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-lg text-center space-y-6">
          <h1 className="text-4xl font-display font-semibold">Conteúdo não encontrado</h1>
          <p className="text-muted-foreground">
            Não conseguimos localizar esta reflexão. Talvez ela tenha sido renomeada ou ainda não esteja traduzida.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/thoughts"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Voltar
            </Link>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <Calendar className="h-4 w-4" aria-hidden />
              {new Date().getFullYear()}
            </div>
          </div>

          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-balance">
              {thought.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {thought.excerpt}
            </p>
          </header>

          <div className="prose prose-invert max-w-none leading-relaxed text-foreground/90">
            <ReactMarkdown>{thought.body}</ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
