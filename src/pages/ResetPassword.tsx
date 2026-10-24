import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageTitle } from "@/hooks/usePageTitle";
import { supabase, supabaseConfigured } from "@/lib/supabase";

const UNCONFIGURED_NOTICE =
  "Authentication isn't connected yet — this build needs Supabase keys.";
const INVALID_LINK_NOTICE =
  "This reset link is invalid or has expired. Request a new one below.";

type Phase = "verifying" | "ready" | "error";

/**
 * Landing page for Supabase password-recovery links. Supabase sends either
 * a PKCE `?code=` (default in supabase-js v2) or an implicit-flow
 * `#access_token=` hash; both paths are handled — the code is exchanged
 * explicitly, the hash flow is picked up by getSession() (the client parses
 * the URL hash on creation). Only after a recovery session exists does
 * the new-password form render.
 */
const ResetPassword = () => {
  usePageTitle("Reset password · ResumeIQ");
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("verifying");
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const verify = async () => {
      if (!supabaseConfigured || !supabase) {
        setError(UNCONFIGURED_NOTICE);
        setPhase("error");
        return;
      }
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (exchangeError) {
          setError(INVALID_LINK_NOTICE);
          setPhase("error");
        } else {
          setPhase("ready");
        }
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setPhase("ready");
      } else {
        setError(INVALID_LINK_NOTICE);
        setPhase("error");
      }
    };
    verify();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (!supabaseConfigured || !supabase) {
      setError(UNCONFIGURED_NOTICE);
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    navigate("/login", {
      replace: true,
      state: { notice: "Your password was updated — sign in with your new password." },
    });
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Set a new password"
      subtitle="Choose a new password for your account."
    >
      {phase === "verifying" && (
        <p className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Verifying your reset link…
        </p>
      )}

      {phase === "error" && (
        <div className="space-y-5">
          <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-destructive">
            {error}
          </p>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/forgot-password" className="font-medium text-foreground underline underline-offset-4">
              Request a new reset link
            </Link>
          </p>
        </div>
      )}

      {phase === "ready" && (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="reset-password">New password</Label>
            <Input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-11 text-base md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reset-confirm">Confirm new password</Label>
            <Input
              id="reset-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="min-h-11 text-base md:text-sm"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="min-h-11 w-full bg-gradient-aurora text-base font-semibold text-white hover:opacity-90"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating…
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
