export function BackgroundFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,hsl(var(--secondary)/0.18),transparent_35%),radial-gradient(circle_at_20%_20%,hsl(var(--accent)/0.18),transparent_30%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))]"
    >
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle,hsl(var(--primary)/0.16),transparent_55%)] blur-3xl" />
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full border border-primary/20 bg-primary/10 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/95 to-transparent" />
    </div>
  );
}
