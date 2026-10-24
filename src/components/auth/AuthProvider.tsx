import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  /** user_metadata.display_name, falling back to the email prefix. */
  displayName: string;
  loading: boolean;
  configured: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

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
