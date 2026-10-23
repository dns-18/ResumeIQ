import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Adds the aurora gradient border ring (the `.neon-border` treatment). */
  glow?: boolean;
  /** Lifts the shadow on hover, like the dashboard quick-link cards. */
  interactive?: boolean;
};

/**
 * Glass surface matching the app/Landing cards: the repo's `.glass` material
 * (blurred translucent panel + glass shadow) with Landing's 28px radius.
 * Static by design — pair with <Reveal> for entrance animation.
 */
export const SectionCard = forwardRef<HTMLDivElement, SectionCardProps>(
  ({ glow, interactive, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass relative overflow-hidden rounded-[28px] p-6 shadow-glass",
        glow && "neon-border",
        interactive && "transition-shadow duration-300 hover:shadow-elevated",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
SectionCard.displayName = "SectionCard";
