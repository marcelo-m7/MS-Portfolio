import { cn } from '@/lib/utils';

const statusMap: Record<string, string> = {
  Desenvolvimento: 'border-amber-500/60 bg-amber-500/15 text-amber-200',
  Produção: 'border-emerald-500/60 bg-emerald-500/15 text-emerald-200',
  MVP: 'border-sky-500/60 bg-sky-500/15 text-sky-100',
};

const visibilityMap: Record<string, string> = {
  Pública: 'border-sky-500/60 bg-sky-500/20 text-sky-100',
  Interna: 'border-fuchsia-500/60 bg-fuchsia-500/20 text-fuchsia-100',
};

export const getStatusBadgeClasses = (status: string) =>
  cn('border border-border/60 bg-background/60 text-foreground', statusMap[status] ?? '');

export const getVisibilityBadgeClasses = (visibility: string) =>
  cn('border border-border/60 bg-background/60 text-foreground', visibilityMap[visibility] ?? '');
