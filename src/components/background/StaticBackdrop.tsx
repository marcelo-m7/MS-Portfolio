export function StaticBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--secondary)/0.18),_transparent_38%),radial-gradient(circle_at_80%_20%,_hsl(var(--accent)/0.16),_transparent_28%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--background)))]"
    >
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent blur-3xl" />
      <div className="absolute left-1/2 top-24 h-40 w-40 -translate-x-1/2 rounded-full border border-primary/10 bg-primary/5 blur-2xl" />
    </div>
  );
}
