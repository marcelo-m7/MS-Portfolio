import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

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

const RouteFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground" aria-live="polite">
    Carregando…
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<RouteFallback />}>
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

export default App;
