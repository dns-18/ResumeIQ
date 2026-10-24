import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { AuthContext } from "./auth-context";

/**
 * Session provider for the protected app routes. Lives inside the lazy
 * protected chunk (see ProtectedLayout) so importing the Supabase client
 * here never pulls it into the main bundle.
 *
 * Unconfigured builds (no env vars): session stays null and loading is
 * false immediately — the app never hangs waiting for a client that
 * doesn't exist, and RequireAuth then redirects to /login, which shows
 * the "not connected" notice. Protection is never bypassed.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;
  const metaName = user?.user_metadata?.display_name;
  const displayName =
    typeof metaName === "string" && metaName ? metaName : user?.email?.split("@")[0] ?? "Account";

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, displayName, loading, configured: supabaseConfigured, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
