import { motion } from "framer-motion";
import { Radar, RadarChart, PolarAngleAxis, PolarGrid, ResponsiveContainer } from "recharts";
import { Dna, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { CopilotPanel } from "@/components/CopilotPanel";

const traits = [
  { axis: "Strategic", v: 88 },
  { axis: "Analytical", v: 82 },
  { axis: "Creative", v: 64 },
  { axis: "Execution", v: 90 },
  { axis: "Communication", v: 76 },
  { axis: "Leadership", v: 84 },
];
const archetypes = [
  { name: "Strategic Leader", match: 88, color: "from-neon-violet to-neon-pink" },
  { name: "Analytical Builder", match: 82, color: "from-neon-cyan to-neon-violet" },
  { name: "Creative Innovator", match: 64, color: "from-neon-pink to-neon-amber" },
  { name: "Execution Specialist", match: 90, color: "from-neon-lime to-neon-cyan" },
];

export default function DnaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Personality Analytics</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Dna className="h-8 w-8 text-neon-pink" /> Resume Personality DNA
          </h1>
          <p className="text-muted-foreground mt-1">How recruiters subconsciously perceive your communication style.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="font-display font-semibold mb-2">Trait signature</h3>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={traits}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }} />
                  <Radar dataKey="v" stroke="hsl(var(--neon-pink))" fill="hsl(var(--neon-pink))" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-display font-semibold mb-4">Archetype match</h3>
            <div className="space-y-4">
              {archetypes.map((a, i) => (
                <div key={a.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{a.name}</span>
                    <span className="font-mono text-muted-foreground">{a.match}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${a.match}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${a.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-neon-violet" />Recruiter perception</h3>
          <p className="text-muted-foreground leading-relaxed">
            Your resume reads as a <span className="text-foreground font-medium">decisive, outcome-driven operator</span> with a calm, executive tone.
            Quantified impact and crisp verbs project confidence. To unlock higher-tier roles, lean further into vision-setting language —
            recruiters scanning for VP+ candidates respond to phrases like <span className="font-mono text-neon-cyan">"set the roadmap"</span> and
            <span className="font-mono text-neon-cyan"> "aligned 4 orgs around"</span>.
          </p>
        </GlassCard>
      </main>
      <CopilotPanel />
    </div>
  );
}