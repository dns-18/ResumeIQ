import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Props = HTMLMotionProps<"div"> & { glow?: boolean };

export const GlassCard = forwardRef<HTMLDivElement, Props>(
  ({ className, glow, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "glass rounded-2xl p-6 shadow-glass relative overflow-hidden",
        glow && "neon-border",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
);
GlassCard.displayName = "GlassCard";