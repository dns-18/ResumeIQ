import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageTitle } from "@/hooks/usePageTitle";
import { supabase, supabaseConfigured } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UNCONFIGURED_NOTICE =
  "Authentication isn't connected yet — this build needs Supabase keys.";

const ForgotPassword = () => {
  usePageTitle("Reset password · ResumeIQ");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    // No real auth available in this build — say so, never fake a send.
    if (!supabaseConfigured || !supabase) {
      setError(UNCONFIGURED_NOTICE);
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      {sent ? (
        <div className="space-y-5">
          <p
            role="status"
            className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm leading-relaxed text-emerald-300"
          >
            Check your inbox for a password reset link. It expires soon, so use it promptly.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                Sending…
              </>
            ) : (
              "Send reset link"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
