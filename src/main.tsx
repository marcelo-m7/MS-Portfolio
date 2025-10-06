import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { detectInitialLanguage, setLanguage, waitForTranslate } from "./lib/googleTranslate";

const initialLanguage = detectInitialLanguage();

if (typeof document !== "undefined") {
  document.documentElement.setAttribute("lang", initialLanguage);
}

const applyInitialLanguage = () => setLanguage(initialLanguage);

if (typeof window !== "undefined") {
  window.addEventListener("google:translate-ready", applyInitialLanguage, { once: true });
  waitForTranslate(applyInitialLanguage);
}

createRoot(document.getElementById("root")!).render(<App />);
