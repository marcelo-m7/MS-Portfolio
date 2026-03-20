import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, GitBranch, Sparkles, Star, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatRelativeTime, formatStarCount } from '@/lib/githubApi';
import { useGitHubOverview } from '@/hooks/useGitHubStats';
import { SITE_CONFIG } from '@/config/site';

export function GitHubHighlights() {
  const prefersReducedMotion = useReducedMotion();
  const { data, isLoading } = useGitHubOverview(SITE_CONFIG.githubUsername);

  return (
    <section className="px-6 pb-24">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              GitHub dinâmico
            </div>
            <h2 className="mt-5 text-4xl font-display font-bold md:text-5xl">Código vivo do ecossistema Monynha</h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Repositórios recentes, sinais de manutenção e presença open source carregados com preferência por GitHub GraphQL e fallback local quando necessário.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="border-border/70">
            <a href={`https://github.com/${SITE_CONFIG.githubUsername}`} target="_blank" rel="noopener noreferrer">
              Ver perfil GitHub
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,1.9fr]">
          <div className="rounded-3xl border border-border/60 bg-card/75 p-6 shadow-lg backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)
                : [
                    { label: 'Repos públicos', value: data?.totalPublicRepos ?? 0, icon: GitBranch },
                    { label: 'Seguidores', value: data?.followers ?? 0, icon: Users },
                    {
                      label: 'Contribuições/estrelas',
                      value: data?.contributionCount ?? data?.totalStars ?? 0,
                      icon: Star,
                    },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border/60 bg-background/60 p-5">
                      <item.icon className="h-5 w-5 text-primary" />
                      <p className="mt-4 text-3xl font-display font-semibold">{item.value}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
            </div>
            {!isLoading && data?.source && (
              <p className="mt-4 text-xs text-muted-foreground">Fonte atual: {data.source === 'graphql' ? 'GitHub GraphQL' : data.source === 'rest' ? 'GitHub REST' : 'fallback local cv.json'}.</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-48 rounded-3xl" />)
              : data?.recentRepositories.map((repo, index) => (
                  <motion.a
                    key={repo.id}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-3xl border border-border/60 bg-card/75 p-5 shadow-md backdrop-blur transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{repo.owner}</p>
                        <h3 className="mt-2 text-xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">{repo.name}</h3>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm text-muted-foreground">{repo.description ?? 'Repositório selecionado como fallback do portfólio Monynha.'}</p>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">★ {formatStarCount(repo.stars)}</span>
                      <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">{repo.primaryLanguage ?? 'Stack híbrida'}</span>
                      <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">{formatRelativeTime(repo.updatedAt)}</span>
                    </div>
                  </motion.a>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
