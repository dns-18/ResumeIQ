import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { CopilotPanel } from "@/components/CopilotPanel";
import { Wand2, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const bullets = [
  { weak: "Helped manage marketing campaigns for products.", strong: "Led 6 cross-channel marketing campaigns generating $2.3M pipeline and 41% MQL lift in 2 quarters." },
  { weak: "Worked with engineering team on new features.", strong: "Partnered with 12 engineers to ship 4 flagship features, cutting churn 18% and lifting NPS from 32 → 54." },
  { weak: "Responsible for hiring and onboarding.", strong: "Built and onboarded a 9-person team in 90 days; 100% retention through year 1." },
];

export default function CopilotPage() {
  const [applied, setApplied] = useState<number[]>([]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Studio</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Wand2 className="h-8 w-8 text-neon-violet" /> Smart Rewrite Studio
          </h1>
          <p className="text-muted-foreground mt-1">Hover any bullet — apply AI suggestions in a click.</p>
        </div>

        <GlassCard glow>
          <div className="space-y-3">
            {bullets.map((b, i) => {
              const isApplied = applied.includes(i);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="text-sm leading-relaxed">
                    {isApplied ? (
                      <span className="text-foreground">{b.strong}</span>
                    ) : (
                      <span className="text-muted-foreground line-through decoration-neon-pink/60">{b.weak}</span>
                    )}
                  </div>
                  {!isApplied && (
                    <div className="mt-3 p-3 rounded-lg neon-border bg-background/60">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm flex-1">
                          <div className="text-[10px] uppercase tracking-widest text-neon-cyan mb-1 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> AI suggestion
                          </div>
                          {b.strong}
                        </div>
                        <button
                          onClick={() => setApplied([...applied, i])}
                          className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-aurora animate-aurora text-background text-xs font-semibold"
                        >
                          <Check className="h-3 w-3" /> Apply
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </main>
      <CopilotPanel />
    </div>
  );
}