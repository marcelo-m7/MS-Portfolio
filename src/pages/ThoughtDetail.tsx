import { Suspense, lazy } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import cvData from "../../public/data/cv.json";
import { Button } from "@/components/ui/button";

const Markdown = lazy(() => import("react-markdown"));

const formatter = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function ThoughtDetail() {
  const { slug } = useParams<{ slug: string }>();
  const shouldReduceMotion = useReducedMotion();
  const thought = cvData.thoughts.find((item) => item.slug === slug);

  if (!thought) {
    return (
      <div className="min-h-screen px-6 pb-20 pt-28">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold">Conteúdo não encontrado</h1>
          <p className="mt-4 text-muted-foreground">
            Não encontramos este pensamento. Volta ao início para explorar outros insights.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/thoughts">Voltar para pensamentos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const dateISO = thought.date ?? new Date().toISOString();
  const formattedDate = formatter.format(new Date(dateISO));

  return (
    <div className="min-h-screen px-6 pb-24 pt-28">
      <div className="container mx-auto max-w-3xl">
        <Button
          asChild
          variant="ghost"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-muted-foreground hover:border-border/60 hover:bg-card/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
        >
          <Link to="/thoughts">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar
          </Link>
        </Button>

        <motion.article
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="rounded-3xl border border-border/60 bg-card/70 p-10 shadow-[0_30px_90px_-50px_rgba(14,165,233,0.8)]"
        >
          <header className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
              Manifesto criativo
            </span>
            <h1 className="text-4xl font-display font-bold leading-tight md:text-5xl">
              {thought.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1 font-medium text-foreground/80">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <time dateTime={dateISO}>{formattedDate}</time>
              </span>
              <ul className="flex flex-wrap gap-2" aria-label="Etiquetas do pensamento">
                {thought.tags?.map((tag) => (
                  <li
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    <Tag className="h-3 w-3" aria-hidden="true" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </header>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/90">
            <Suspense fallback={<p className="text-muted-foreground">Carregando reflexão...</p>}>
              <Markdown className="prose prose-invert max-w-none">
                {thought.body}
              </Markdown>
            </Suspense>
          </div>

          <footer className="mt-12 rounded-2xl border border-border/50 bg-background/60 p-6">
            <p className="text-sm text-muted-foreground">
              {cvData.profile.name} — {cvData.profile.headline}
            </p>
          </footer>
        </motion.article>
      </div>
    </div>
  );
}
