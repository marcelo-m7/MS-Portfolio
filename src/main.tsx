import { Buffer } from 'buffer';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/providers/theme-provider";
import { QueryProvider } from "./lib/queryClient";
import { initWebVitals } from "./lib/webVitals";

// Polyfill Buffer for gray-matter in browser
window.Buffer = Buffer;

// Initialize Web Vitals monitoring
initWebVitals();

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </QueryProvider>,
);
