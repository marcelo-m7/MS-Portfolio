import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleToggle}
      aria-pressed={resolvedTheme === "dark"}
      aria-label={
        resolvedTheme === "dark"
          ? "Ativar tema claro"
          : "Ativar tema escuro"
      }
      className={cn(
        "relative h-11 w-11 rounded-2xl border-border/70 bg-card/80 text-foreground shadow-md transition-colors hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      disabled={!mounted}
    >
      <Sun className="h-5 w-5 transition-all dark:-rotate-90 dark:scale-0" aria-hidden />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden />
      <span className="sr-only">
        {resolvedTheme === "dark" ? "Tema claro" : "Tema escuro"}
      </span>
    </Button>
  );
}
