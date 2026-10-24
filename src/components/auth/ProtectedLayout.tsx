import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./AuthProvider";
import { AppShell } from "../app/AppShell";

/**
 * Gate for the 9 app routes. While the session is resolving, a minimal
 * landing-styled loading state; without a session, redirect to /login
 * carrying the attempted location so Login can return the user there
 * after sign-in (Login already honors `state.from`).
 *
 * Unconfigured builds: AuthProvider reports loading=false and no session
 * immediately, so guests land on /login and see its "not connected"
 * notice. There is no bypass — an unconfigured production build fails
 * closed, never open.
 */
const RequireAuth = () => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <AppShell />;
};

/**
 * Lazy-loaded from App.tsx (React.lazy) so AuthProvider — and with it the
 * Supabase client — ships in the auth chunk, not the main bundle.
 */
const ProtectedLayout = () => (
  <AuthProvider>
    <RequireAuth />
  </AuthProvider>
);

export default ProtectedLayout;
