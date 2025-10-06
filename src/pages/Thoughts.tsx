import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import cvData from "../../public/data/cv.json";

const formatter = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function Thoughts() {
  const shouldReduceMotion = useReducedMotion();
  const thoughts = [...cvData.thoughts].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? "")
  );

  return (
    <div className="min-h-screen px-6 pb-20 pt-28">
      <div className="container mx-auto max-w-4xl">
        <motion.header
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="mb-12 space-y-6 text-center md:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Insights & processos
          </span>
          <div>
            <h1 className="text-4xl font-display font-bold md:text-5xl">
              Pensamentos que guiam o estúdio
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Reflexões sobre tecnologia inclusiva, arte digital e cultura Monynha.
            </p>
          </div>
        </motion.header>

        <div className="space-y-8">
          {thoughts.map((thought, index) => (
            <motion.article
              key={thought.slug}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: shouldReduceMotion ? 0 : index * 0.08, duration: 0.45 }}
              className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-8 shadow-[0_18px_60px_-40px_rgba(124,58,237,0.8)] transition-colors duration-300 hover:border-secondary/60"
            >
              {(() => {
                const dateISO = thought.date ?? new Date().toISOString();
                return (
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1 font-semibold text-primary/80">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <time dateTime={dateISO}>
                        {formatter.format(new Date(dateISO))}
                      </time>
                    </span>
                    <ul className="flex flex-wrap gap-2" aria-label="Etiquetas do pensamento">
                      {thought.tags?.map((tag) => (
                        <li
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-3 py-1 text-xs font-semibold text-foreground/80"
                        >
                          <Tag className="h-3 w-3" aria-hidden="true" />
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              <div className="mt-6 space-y-4">
                <h2 className="text-3xl font-display font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                  {thought.title}
                </h2>
                <p className="text-base text-muted-foreground/90">
                  {thought.excerpt}
                </p>
              </div>

              <Button
                asChild
                variant="ghost"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:border-secondary/60 hover:text-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
              >
                <Link to={`/thoughts/${thought.slug}`} aria-label={`Ler o pensamento ${thought.title}`}>
                  Ler reflexão completa
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
