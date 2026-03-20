import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, GitBranch, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { siteConfig } from '@/config/site';

export interface GitHubHighlightItem {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  updatedAt: string;
  language: string | null;
}

export const GitHubHighlightsSection = memo(function GitHubHighlightsSection({
  items,
  isLoading,
  isFallback,
}: {
  items: GitHubHighlightItem[];
  isLoading: boolean;
  isFallback: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="px-6 pb-24">
      <div className="container mx-auto max-w-7xl rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-[0_35px_90px_-70px_hsl(var(--secondary)/0.45)] backdrop-blur-xl md:p-10">
        <motion.div initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }} whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">GitHub dinâmico</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Repos e atividade recente da Monynha</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Dados carregados via GitHub API com preferência por GraphQL, mantendo fallback local para preservar resiliência e previsibilidade visual.
            </p>
          </div>
          <Button asChild variant="outline" className="border-border/70 md:self-start">
            <a href={`https://github.com/${siteConfig.github.organization}`} target="_blank" rel="noopener noreferrer">Ver organização<ArrowUpRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </motion.div>

        {isFallback && !isLoading ? (
          <div className="mb-6 rounded-2xl border border-dashed border-border/70 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
            Exibindo fallback local porque a API do GitHub não respondeu ou excedeu limite de uso.
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-48 w-full rounded-2xl" />)
            : items.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-2xl border border-border/60 bg-background/60 p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-primary">{item.name}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2"><Star className="h-4 w-4" />{item.stars}</span>
                    <span className="inline-flex items-center gap-2"><GitBranch className="h-4 w-4" />{item.forks}</span>
                    <span>{item.language ?? 'Multistack'}</span>
                  </div>
                </motion.a>
              ))}
        </div>
      </div>
    </section>
  );
});
