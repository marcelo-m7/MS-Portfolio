/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_SUPABASE_URL: string;
  readonly VITE_PUBLIC_SUPABASE_ANON_KEY: string;
  readonly VITE_ENABLE_HERO_3D?: string;
  readonly VITE_ENABLE_ART_3D?: string;
  readonly VITE_ENABLE_PRISM_BACKGROUND?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};