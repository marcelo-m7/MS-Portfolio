import { useEffect, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getInitialLanguage, registerGlobalLanguageSetter, setLanguage, useGoogleTranslateGuard } from "@/lib/translate";

const Home = lazy(() => import("./pages/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const About = lazy(() => import("./pages/About"));
const Thoughts = lazy(() => import("./pages/Thoughts"));
const ThoughtDetail = lazy(() => import("./pages/ThoughtDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SeriesDetail = lazy(() => import("./pages/SeriesDetail"));
const ArtworkDetail = lazy(() => import("./pages/ArtworkDetail"));

const queryClient = new QueryClient();

const FallbackScreen = () => (
  <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
    Carregando…
  </div>
);

const AppShell = () => {
  useGoogleTranslateGuard();

  useEffect(() => {
    registerGlobalLanguageSetter();
    const initialLang = getInitialLanguage();
    document.documentElement.setAttribute("lang", initialLang);
    setLanguage(initialLang);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-24">
        <Suspense fallback={<FallbackScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/thoughts" element={<Thoughts />} />
            <Route path="/thoughts/:slug" element={<ThoughtDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/series/:slug" element={<SeriesDetail />} />
            <Route path="/art/:slug" element={<ArtworkDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppShell />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
