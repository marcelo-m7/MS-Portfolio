import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import cvData from "../../public/data/cv.json";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Thoughts() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen px-6 pb-16 pt-28">
      <div className="container mx-auto max-w-4xl">
        <motion.header
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-balance font-display text-5xl font-bold md:text-6xl">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Pensamentos
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Reflexões sobre tecnologia, design e acessibilidade.
          </p>
        </motion.header>

        <div className="space-y-8">
          {cvData.thoughts.map((thought, index) => (
            <motion.article
              key={thought.slug}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: prefersReducedMotion ? 0 : index * 0.1, duration: 0.5 }}
              className="glass group rounded-3xl border border-border/70 p-8 transition-shadow hover:shadow-[0_25px_60px_rgba(76,29,149,0.25)]"
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={thought.date}>{formatDate(thought.date)}</time>
                </span>
                {thought.tags?.length ? (
                  <span className="inline-flex items-center gap-2">
                    <Tag className="h-4 w-4" aria-hidden="true" />
                    <span className="flex flex-wrap gap-2">
                      {thought.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-muted/70 px-2.5 py-0.5 text-xs uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </span>
                  </span>
                ) : null}
              </div>

              <h2 className="mt-5 font-display text-3xl font-semibold text-foreground transition-colors group-hover:text-primary">
                {thought.title}
              </h2>

              <p className="mt-3 text-lg text-muted-foreground">{thought.excerpt}</p>

              <Link
                to={`/thoughts/${thought.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Ler artigo completo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
