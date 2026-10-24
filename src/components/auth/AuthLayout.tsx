import { Link } from "react-router-dom";
import { ArrowLeft, Gauge, MessagesSquare, Mic } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/app/Reveal";
import { SectionCard } from "@/components/app/SectionCard";
import type { ReactNode } from "react";

const FEATURES = [
  {
    icon: Mic,
    title: "Voice-built drafts",
    text: "Speak your story and get a polished resume draft back.",
  },
  {
    icon: Gauge,
    title: "ATS clarity scoring",
    text: "Structure and keywords tuned so hiring systems read you cleanly.",
  },
  {
    icon: MessagesSquare,
    title: "Recruiter-style feedback",
    text: "Simulated recruiter reads and benchmarks before you apply.",
  },
];

type AuthLayoutProps = {
  /** Eyebrow label above the form heading (Landing section-header style). */
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

/**
 * Landing-style split layout for the auth pages (NOT inside AppShell).
 * Desktop: aurora panel on the left, glass form card on the right.
 * Mobile: the panel stacks above the form, compact.
 */
export const AuthLayout = ({ eyebrow, title, subtitle, children }: AuthLayoutProps) => (
  <div className="flex min-h-screen flex-col lg:flex-row">
    {/* Left aurora panel */}
    <div className="relative overflow-hidden bg-gradient-aurora px-6 py-8 sm:px-10 lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:px-12 lg:py-12">
      {/* Soft dark wash so white text stays legible over the gradient */}
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
      <div className="relative">
        <Link to="/" aria-label="Back to home">
          <Logo className="[&_span]:text-white [&_.text-muted-foreground]:text-white/70" />
        </Link>
        <h1 className="mt-8 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:mt-0 lg:text-5xl">
          Your resume,
          <br />
          speaking clearly.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
          Sign in to pick up your drafts, scores, and recruiter feedback where
          you left off.
        </p>
      </div>
      <ul className="relative mt-8 space-y-5 lg:mt-0">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Icon className="h-5 w-5 text-white" />
            </span>
            <span>
              <span className="block font-display text-base font-semibold text-white">
                {title}
              </span>
              <span className="block text-sm leading-relaxed text-white/75">
                {text}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>

    {/* Right form side */}
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-12">
      <div className="w-full max-w-md">
        <Reveal>
          <Link
            to="/"
            className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <SectionCard className="p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
            <div className="mt-6">{children}</div>
          </SectionCard>
        </Reveal>
      </div>
    </div>
  </div>
);
