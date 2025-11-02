import { Buffer } from 'buffer';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/providers/theme-provider";
import { QueryProvider } from "./lib/queryClient";

// Polyfill Buffer for gray-matter in browser
window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </QueryProvider>,
);
