import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import {
  detectInitialLanguage,
  initializeGoogleTranslate,
  setLanguage,
} from "./lib/googleTranslate";
import type { SupportedLanguage } from "./lib/googleTranslate";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Thoughts from "./pages/Thoughts";
import ThoughtDetail from "./pages/ThoughtDetail";
import SeriesDetail from "./pages/SeriesDetail";
import ArtDetail from "./pages/ArtDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/thoughts" element={<Thoughts />} />
            <Route path="/thoughts/:slug" element={<ThoughtDetail />} />
            <Route path="/series/:slug" element={<SeriesDetail />} />
            <Route path="/art/:slug" element={<ArtDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
