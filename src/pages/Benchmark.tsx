import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { TrendingUp, Trophy, Users, Sparkles, ArrowUpRight, Target } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";

const dist = [
  { range: "0-50", count: 8, you: false },
  { range: "50-60", count: 14, you: false },
  { range: "60-70", count: 22, you: false },
  { range: "70-80", count: 28, you: false },
  { range: "80-90", count: 19, you: true },
  { range: "90-100", count: 9, you: false },
];

const metrics = [
  { label: "Keyword density", you: 88, top10: 92, avg: 71 },
  { label: "Quantified bullets", you: 14, top10: 18, avg: 7 },
  { label: "Action verbs", you: 22, top10: 26, avg: 12 },
  { label: "Years experience", you: 6, top10: 7, avg: 5 },
  { label: "Skills matched", you: 17, top10: 21, avg: 11 },
];

export default function Benchmark() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Anonymized benchmark</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Where you stand vs the top 10%</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Compared against <span className="text-neon-cyan font-mono">100</span> anonymized candidates applying for <span className="text-foreground font-semibold">Senior Product Manager @ FAANG</span>.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          <GlassCard glow>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Trophy className="h-4 w-4 text-neon-amber" />Your rank</div>
            <div className="font-display text-5xl font-bold text-gradient mt-2">Top 18%</div>
            <div className="mt-2 text-sm text-neon-lime flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />Better than 82 of 100 candidates</div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Users className="h-4 w-4 text-neon-cyan" />Your score</div>
            <div className="font-display text-5xl font-bold mt-2">87</div>
            <div className="mt-2 text-sm text-muted-foreground">Top 10% avg: <span className="text-neon-lime font-mono">93</span> · cohort avg: <span className="font-mono">72</span></div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Target className="h-4 w-4 text-neon-pink" />Gap to top 10%</div>
            <div className="font-display text-5xl font-bold mt-2">6 pts</div>
            <div className="mt-2 text-sm text-muted-foreground">Close it with 3 high-impact rewrites</div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-neon-violet" />Score distribution (anonymized cohort)</h3>
            <Badge className="bg-gradient-aurora animate-aurora text-background border-0">You're here</Badge>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dist}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {dist.map((d, i) => <Cell key={i} fill={d.you ? "hsl(var(--neon-pink))" : "hsl(var(--neon-violet) / 0.5)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-display text-xl font-semibold flex items-center gap-2 mb-5"><TrendingUp className="h-5 w-5 text-neon-lime" />Metric-by-metric breakdown</h3>
          <div className="space-y-4">
            {metrics.map((m, i) => {
              const max = Math.max(m.top10, m.you, m.avg);
              return (
                <motion.div key={m.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{m.label}</span>
                    <span className="text-muted-foreground font-mono">You {m.you} · Top 10% {m.top10} · Avg {m.avg}</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-muted-foreground/30" style={{ width: `${(m.avg / max) * 100}%` }} />
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-violet to-neon-cyan" style={{ width: `${(m.you / max) * 100}%` }} />
                    <div className="absolute top-0 bottom-0 w-0.5 bg-neon-lime" style={{ left: `${(m.top10 / max) * 100}%` }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-neon-pink/10 to-neon-violet/10 border border-neon-pink/20 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-neon-pink mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold mb-1">AI recommendation</div>
              <p className="text-muted-foreground">Add 4 more quantified bullets and integrate 4 missing skills (Roadmapping, OKRs, A/B Testing, SQL) to break into the top 10%.</p>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}