/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://<ref>.supabase.co — see .env.example */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anonymous (public) key — safe to expose in the client bundle. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
