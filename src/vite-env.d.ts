/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_SUPABASE_URL: string;
  readonly VITE_PUBLIC_SUPABASE_ANON_KEY: string;
  readonly VITE_ENABLE_HERO_3D?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    setLanguage?: (lang: 'pt' | 'en' | 'es' | 'fr') => void;
    __afterGoogleTranslateInit?: () => void;
  }
}

export {};
