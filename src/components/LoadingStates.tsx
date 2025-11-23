import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Reusable loading skeleton components for consistent UX across the app.
 * These components maintain the same layout structure as their real counterparts.
 */

export const LoadingProjectCard = () => (
  <Card className="group overflow-hidden rounded-[var(--radius)] border-border/60 bg-card/80 shadow-[0_10px_30px_-15px_hsl(var(--primary)/0.15)] backdrop-blur-sm transition-all hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.3)]">
    <Skeleton className="h-48 w-full" />
    <CardHeader className="space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </CardHeader>
  </Card>
);

export const LoadingArtworkCard = () => (
  <Card className="group overflow-hidden rounded-[var(--radius)] border-border/60 bg-card/80 shadow-[0_10px_30px_-15px_hsl(var(--primary)/0.15)] backdrop-blur-sm transition-all hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.3)]">
    <Skeleton className="h-64 w-full" />
    <CardHeader className="space-y-3">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </CardHeader>
  </Card>
);

export const LoadingSeriesCard = () => (
  <Card className="group overflow-hidden rounded-[var(--radius)] border-border/60 bg-card/80 shadow-[0_10px_30px_-15px_hsl(var(--primary)/0.15)] backdrop-blur-sm transition-all hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.3)]">
    <Skeleton className="h-56 w-full" />
    <CardHeader className="space-y-3">
      <Skeleton className="h-6 w-3/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center gap-2 mt-4">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </CardHeader>
  </Card>
);

export const LoadingPortfolioGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
    {Array.from({ length: count }).map((_, i) => (
      <LoadingProjectCard key={i} />
    ))}
  </div>
);

export const LoadingProjectDetail = () => (
  <div className="px-6">
    <div className="container mx-auto max-w-4xl">
      <div className="rounded-[var(--radius)] border border-border/60 bg-card/80 p-10 shadow-[0_45px_90px_-70px_hsl(var(--primary)/0.3)] backdrop-blur-xl">
        <Skeleton className="mb-8 h-10 w-48 rounded-full" />
        <div className="mb-10 space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="mt-10 space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      </div>
    </div>
  </div>
);

export const LoadingProfile = () => (
  <div className="glass mb-12 p-8 md:p-12">
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
      <Skeleton className="h-32 w-32 shrink-0 rounded-2xl" />
      <div className="flex-1 space-y-4 text-center md:text-left w-full">
        <Skeleton className="h-9 w-64 mx-auto md:mx-0" />
        <Skeleton className="h-6 w-48 mx-auto md:mx-0" />
        <Skeleton className="h-5 w-40 mx-auto md:mx-0" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  </div>
);

export const LoadingExperience = ({ count = 2 }: { count?: number }) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-32 mt-2 md:mt-0" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

export const LoadingSkills = ({ count = 6 }: { count?: number }) => (
  <div className="grid md:grid-cols-2 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass flex items-center justify-between p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    ))}
  </div>
);

export const LoadingThoughtCard = () => (
  <Card className="overflow-hidden rounded-[var(--radius)] border-border/60 bg-card/80 shadow-[0_10px_30px_-15px_hsl(var(--primary)/0.15)] backdrop-blur-sm transition-all">
    <CardHeader className="space-y-3 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </CardHeader>
  </Card>
);

export const LoadingThoughtDetail = () => (
  <div className="px-6">
    <div className="container mx-auto max-w-3xl">
      <div className="rounded-[var(--radius)] border border-border/60 bg-card/80 p-8 md:p-12 shadow-[0_45px_90px_-70px_hsl(var(--primary)/0.3)] backdrop-blur-xl">
        <Skeleton className="mb-8 h-10 w-48 rounded-full" />
        <div className="mb-8 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-4/5" />
          <div className="flex items-center gap-4 mt-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
        <div className="space-y-4 mt-10">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  </div>
);

export const LoadingSeriesDetail = () => (
  <div className="px-6">
    <div className="container mx-auto max-w-5xl">
      <div className="rounded-[var(--radius)] border border-border/60 bg-card/80 p-10 shadow-[0_45px_90px_-70px_hsl(var(--primary)/0.3)] backdrop-blur-xl">
        <Skeleton className="h-10 w-48 rounded-full mb-8" />
        <div className="space-y-4 mb-8">
          <div className="flex gap-3">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const LoadingArtDetail = () => (
  <div className="px-6">
    <div className="container mx-auto max-w-5xl">
      <div className="rounded-[var(--radius)] border border-border/60 bg-card/80 p-10 shadow-[0_45px_90px_-70px_hsl(var(--primary)/0.3)] backdrop-blur-xl">
        <Skeleton className="mb-8 h-10 w-48 rounded-full" />
        <div className="mb-10 space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      </div>
    </div>
  </div>
);
