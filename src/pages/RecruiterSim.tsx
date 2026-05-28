import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Play, RefreshCw, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { CopilotPanel } from "@/components/CopilotPanel";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ScoreRing";

const sections = [
  { id: "header", label: "Header", x: "10%", y: "8%", w: "80%", h: "14%", attention: 95, comment: "Eye anchors here first — strong name & title contrast." },
  { id: "summary", label: "Summary", x: "10%", y: "26%", w: "80%", h: "14%", attention: 62, comment: "This section feels too generic. Lead with a sharper hook." },
  { id: "exp", label: "Experience", x: "10%", y: "44%", w: "80%", h: "30%", attention: 88, comment: "Strong measurable impact detected on Acme Corp role." },
  { id: "edu", label: "Education", x: "10%", y: "78%", w: "45%", h: "10%", attention: 34, comment: "Glanced past — typical for senior roles." },
  { id: "skills", label: "Skills", x: "58%", y: "78%", w: "32%", h: "10%", attention: 71, comment: "Keywords aligned with target role." },
];

export default function RecruiterSim() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const start = () => {
    setRunning(true); setStep(-1);
    sections.forEach((_, i) => setTimeout(() => setStep(i), (i + 1) * 1100));
    setTimeout(() => setRunning(false), (sections.length + 1) * 1100);
  };

  useEffect(() => { const t = setTimeout(start, 500); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Unique Feature</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Eye className="h-8 w-8 text-neon-cyan" /> Recruiter Simulation
            </h1>
            <p className="text-muted-foreground mt-1">Watch how a real recruiter scans your resume in 6 seconds.</p>
          </div>
          <Button onClick={start} disabled={running} className="bg-gradient-aurora animate-aurora text-background">
            {running ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Scanning…</> : <><Play className="h-4 w-4 mr-2" />Replay scan</>}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <GlassCard glow className="lg:col-span-2 p-4">
            <div className="relative aspect-[4/5] rounded-xl bg-secondary/40 overflow-hidden border border-border">
              {/* fake resume mock */}
              {sections.map((s) => (
                <div
                  key={s.id}
                  className="absolute rounded-md bg-muted/60 border border-border"
                  style={{ left: s.x, top: s.y, width: s.w, height: s.h }}
                >
                  <div className="p-2 text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className="px-2 space-y-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-1.5 rounded-full bg-muted-foreground/20" style={{ width: `${70 - i * 12}%` }} />
                    ))}
                  </div>
                </div>
              ))}

              {/* heatmap dots */}
              {sections.map((s, i) => step >= i && (
                <motion.div
                  key={`heat-${s.id}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    left: s.x, top: s.y, width: s.w, height: s.h,
                    background: `radial-gradient(circle, hsl(${s.attention > 70 ? "0 90% 60%" : s.attention > 50 ? "38 95% 60%" : "190 95% 55%"} / ${s.attention/100 * 0.55}), transparent 70%)`,
                    filter: "blur(8px)",
                  }}
                />
              ))}

              {/* eye cursor */}
              <AnimatePresence>
                {step >= 0 && step < sections.length && (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: 1, scale: 1,
                      left: `calc(${sections[step].x} + ${sections[step].w} / 2 - 16px)`,
                      top: `calc(${sections[step].y} + ${sections[step].h} / 2 - 16px)`,
                    }}
                    transition={{ type: "spring", damping: 18, stiffness: 200 }}
                    className="absolute h-8 w-8 rounded-full bg-gradient-aurora animate-aurora flex items-center justify-center shadow-neon"
                  >
                    <Eye className="h-4 w-4 text-background" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard className="text-center">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Recruiter confidence</div>
              <ScoreRing score={78} size={140} label="Confidence" />
            </GlassCard>
            <GlassCard>
              <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-neon-violet" />Live AI commentary</h3>
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto">
                {sections.map((s, i) => step >= i && (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-secondary/60 text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{s.label}</span>
                      <span className="text-xs font-mono text-muted-foreground">{s.attention}% attention</span>
                    </div>
                    <p className="text-muted-foreground text-xs">{s.comment}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
      <CopilotPanel />
    </div>
  );
}