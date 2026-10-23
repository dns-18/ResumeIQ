import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Auth plumbing (Phase 2). No keys are committed — the client is created from
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (see .env.example). When either is
// absent the app runs in "unconfigured" mode: `supabase` is null, every page
// still builds and renders exactly as before, and auth UI must stay inert.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
