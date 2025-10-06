import { Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import cvData from "../../public/data/cv.json";
import { Link } from "react-router-dom";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function ThoughtDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const thought = cvData.thoughts.find((item) => item.slug === slug);

  if (!thought) {
    return <Navigate to="/thoughts" replace />;
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-28">
      <div className="container mx-auto max-w-3xl">
        <Link
          to="/thoughts"
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-2 text-sm text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para pensamentos
        </Link>

        <motion.header
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 space-y-4"
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

          <h1 className="text-balance font-display text-4xl font-bold md:text-5xl">{thought.title}</h1>
        </motion.header>

        <motion.section
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.15, duration: 0.6 }}
          className="prose prose-invert mt-10 max-w-none text-lg leading-relaxed"
        >
          <ReactMarkdown>{thought.body}</ReactMarkdown>
        </motion.section>
      </div>
    </div>
  );
}
