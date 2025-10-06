import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';

export default function ThoughtArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = cvData.thoughts.find((thought) => thought.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-display font-bold">Conteúdo não encontrado</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Não encontramos o pensamento que você procurou. Talvez ele tenha sido movido ou renomeado.
          </p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/thoughts">Voltar para Pensamentos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Button asChild variant="ghost" className="mb-8 rounded-xl hover:bg-card focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <Link to="/thoughts">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Voltar
            </Link>
          </Button>

          <header className="mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>Publicado em 2025</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-balance">{article.title}</h1>
            <p className="text-lg text-muted-foreground/80">{article.excerpt}</p>
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
