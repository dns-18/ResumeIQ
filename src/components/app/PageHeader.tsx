import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  /** Small uppercase label above the title — Landing section style (`text-xs uppercase tracking-[0.28em]`). */
  eyebrow?: string;
  /** Optional leading title icon (e.g. a lucide icon with a neon tint), as on the tool pages. */
  icon?: ReactNode;
  title: string;
  /** Rich description (plain string or inline JSX, e.g. Benchmark's highlighted spans). */
  description?: ReactNode;
  /** Buttons/links rendered on the right; wraps below the title on small screens. */
  actions?: ReactNode;
  className?: string;
};

/**
 * Page header in the Landing design language: eyebrow label, Space Grotesk
 * (font-display) title, muted description, optional wrapping actions slot.
 */
export const PageHeader = ({ eyebrow, icon, title, description, actions, className }: PageHeaderProps) => (
  <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
    <div className="min-w-0">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>
      )}
      <h1
        className={cn(
          "mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl",
          icon && "flex items-center gap-3"
        )}
      >
        {icon}
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);
