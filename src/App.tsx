import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, lazy, Suspense } from "react";
import {
  detectInitialLanguage,
  initializeGoogleTranslate,
  setLanguage,
} from "./lib/googleTranslate";
import type { SupportedLanguage } from "./lib/googleTranslate";

const Home = lazy(() => import("./pages/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const About = lazy(() => import("./pages/About"));
const Thoughts = lazy(() => import("./pages/Thoughts"));
const ThoughtDetail = lazy(() => import("./pages/ThoughtDetail"));
const SeriesDetail = lazy(() => import("./pages/SeriesDetail"));
const ArtworkDetail = lazy(() => import("./pages/ArtworkDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeGoogleTranslate();
    const initialLang = detectInitialLanguage();
    setLanguage(initialLang);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "monynha-lang" && event.newValue) {
        const nextLang = event.newValue as SupportedLanguage;
        setLanguage(nextLang);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
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
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
              <Route path="/thoughts" element={<Thoughts />} />
              <Route path="/thoughts/:slug" element={<ThoughtDetail />} />
              <Route path="/series/:slug" element={<SeriesDetail />} />
              <Route path="/art/:slug" element={<ArtworkDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
