import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import cvData from "../../public/data/cv.json";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/70 px-6 py-12">
      <div className="container mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Monynha Softwares
          </p>
          <p className="text-base text-muted-foreground/90">
            {cvData.profile.headline} · {cvData.profile.location}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <Link
            to="/thoughts"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 font-semibold text-secondary transition hover:border-secondary/60 hover:text-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
          >
            Pensamentos recentes
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground/80">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            Construído com amor inclusivo pela Monynha Softwares.
          </span>
        </div>
      </div>
    </footer>
  );
}
