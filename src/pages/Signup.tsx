import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageTitle } from "@/hooks/usePageTitle";
import { supabase, supabaseConfigured } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UNCONFIGURED_NOTICE =
  "Authentication isn't connected yet — this build needs Supabase keys.";

const friendlySignupError = (message: string) => {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already exists")) {
    return "An account with this email already exists — sign in instead.";
  }
  return message;
};

const Signup = () => {
  usePageTitle("Create account · ResumeIQ");
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in? Skip the form entirely.
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) navigate("/dashboard", { replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError("Enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    // No real auth available in this build — say so, never fake an account.
    if (!supabaseConfigured || !supabase) {
      setError(UNCONFIGURED_NOTICE);
      return;
    }

    setSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName.trim() } },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(friendlySignupError(signUpError.message));
      return;
    }

    // With "Confirm email" ON, Supabase returns a user with no identities
    // when the email is already registered (anti-enumeration). Treat that
    // as the already-registered case rather than a fake success.
    if (data.user && data.user.identities?.length === 0) {
      setError("An account with this email already exists — sign in instead.");
      return;
    }

    if (data.session) {
      // "Confirm email" OFF: the account is active immediately.
      navigate("/dashboard", { replace: true });
      return;
    }
    // "Confirm email" ON: the account exists but needs inbox confirmation.
    setEmailSent(true);
  };

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create account"
      subtitle="One account for your drafts, scores, and recruiter feedback."
    >
      {emailSent ? (
        <div className="space-y-4">
          <p role="status" className="rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-3 text-sm leading-relaxed">
            Check your inbox to confirm your email, then sign in.
          </p>
          <Button asChild className="min-h-11 w-full bg-gradient-aurora text-base font-semibold text-white hover:opacity-90">
            <Link to="/login">Go to sign in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="signup-name">Display name</Label>
            <Input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="min-h-11 text-base md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-11 text-base md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-h-11 pr-11 text-base md:text-sm"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-confirm">Confirm password</Label>
            <Input
              id="signup-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="min-h-11 text-base md:text-sm"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-destructive">
              {error}
              {error.includes("already exists") && (
                <>
                  {" "}
                  <Link to="/login" className="font-medium underline underline-offset-4">
                    Sign in
                  </Link>
                </>
              )}
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
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default Signup;
