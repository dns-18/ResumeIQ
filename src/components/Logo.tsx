import { Sparkles } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative h-9 w-9 rounded-xl bg-gradient-aurora animate-aurora flex items-center justify-center shadow-neon">
      <Sparkles className="h-5 w-5 text-background" strokeWidth={2.5} />
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-display text-lg font-bold tracking-tight">ResumeIQ</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Intelligent Analysis</span>
    </div>
  </div>
);