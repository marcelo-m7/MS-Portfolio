import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import {
  detectInitialLanguage,
  getStorageKey,
  setLanguage,
  SUPPORTED_LANGUAGES,
} from "./lib/language";
import type { SupportedLanguage } from "./lib/language";
import Layout from "./components/Layout"; // Import the new Layout component
import { ThemeProvider } from "./components/ThemeProvider";

const Home = lazy(() => import("./pages/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail")); // Import ProjectDetail
const About = lazy(() => import("./pages/About"));
const Thoughts = lazy(() => import("./pages/Thoughts"));
const ThoughtDetail = lazy(() => import("./pages/ThoughtDetail"));
const SeriesDetail = lazy(() => import("./pages/SeriesDetail"));
const ArtDetail = lazy(() => import("./pages/ArtDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const initialLang = detectInitialLanguage();
    setLanguage(initialLang);

    const storageKey = getStorageKey();
    const supportedLanguages = SUPPORTED_LANGUAGES as readonly string[];

    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue) {
        const normalized = event.newValue.toLowerCase();
        if (supportedLanguages.includes(normalized)) {
          setLanguage(normalized as SupportedLanguage);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="flex min-h-[50vh] items-center justify-center">
                  <span className="animate-pulse text-sm text-muted-foreground">
                    Carregando…
                  </span>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Layout />}> {/* Use Layout as the parent route */}
                  <Route index element={<Home />} />
                  <Route path="portfolio" element={<Portfolio />} />
                  <Route path="portfolio/:slug" element={<ProjectDetail />} /> {/* New route for project details */}
                  <Route path="about" element={<About />} />
                  <Route path="thoughts" element={<Thoughts />} />
                  <Route path="thoughts/:slug" element={<ThoughtDetail />} />
                  <Route path="series/:slug" element={<SeriesDetail />} />
                  <Route path="art/:slug" element={<ArtDetail />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
