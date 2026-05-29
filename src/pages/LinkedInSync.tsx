import { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, FileText, ArrowRight, CheckCircle2, AlertTriangle, Plus, Sparkles, Link2, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const gaps = [
  { type: "missing", side: "linkedin", text: "Promotion to Senior PM (2024) is on LinkedIn but missing from resume", action: "Import to resume" },
  { type: "missing", side: "resume", text: "Resume lists 'Led $4M product launch' — not mentioned on LinkedIn", action: "Add to LinkedIn" },
  { type: "mismatch", side: "both", text: "Job title differs: 'Product Manager' (resume) vs 'Senior PM' (LinkedIn)", action: "Standardize" },
  { type: "missing", side: "linkedin", text: "5 endorsed skills not reflected on resume: Roadmapping, OKRs, A/B Testing, SQL, Figma", action: "Bulk import" },
  { type: "achievement", side: "linkedin", text: "Recommendation from VP of Product — convert to resume quote", action: "Use as testimonial" },
];

export default function LinkedInSync() {
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const connect = () => {
    setSyncing(true);
    setTimeout(() => { setConnected(true); setSyncing(false); }, 1600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Profile sync</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">LinkedIn × Resume Gap Analysis</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Connect your LinkedIn to surface inconsistencies, missing achievements, and one-click imports between your two career artifacts.</p>
        </motion.div>

        {!connected ? (
          <GlassCard glow className="p-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-aurora animate-aurora flex items-center justify-center shadow-neon mb-4">
              <Linkedin className="h-8 w-8 text-background" />
            </div>
            <h2 className="font-display text-2xl font-semibold">Connect your LinkedIn profile</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">We'll compare it line-by-line with your resume to find gaps, inconsistencies, and untapped wins.</p>
            <Button onClick={connect} disabled={syncing} className="mt-6 bg-gradient-aurora animate-aurora text-background">
              {syncing ? (<><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Syncing…</>) : (<><Link2 className="h-4 w-4 mr-2" />Connect LinkedIn</>)}
            </Button>
            <div className="mt-4 text-xs text-muted-foreground">Read-only · Revoke any time</div>
          </GlassCard>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Alignment score", value: "72%", sub: "+18 if all gaps fixed", color: "text-neon-cyan" },
                { label: "Gaps detected", value: "5", sub: "3 high impact", color: "text-neon-amber" },
                { label: "One-click imports", value: "8", sub: "Ready to apply", color: "text-neon-lime" },
              ].map((s) => (
                <GlassCard key={s.label}>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
                  <div className={`font-display text-4xl font-bold mt-1 ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
                </GlassCard>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <GlassCard>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-neon-violet" />
                  <h3 className="font-display text-lg font-semibold">Resume</h3>
                  <Badge variant="outline" className="ml-auto">v3 · uploaded today</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="p-2.5 rounded-lg bg-secondary/40">Product Manager · Acme · 2022–Present</li>
                  <li className="p-2.5 rounded-lg bg-secondary/40">Led $4M product launch (+38% MAU)</li>
                  <li className="p-2.5 rounded-lg bg-secondary/40">Managed 6-person cross-functional team</li>
                </ul>
              </GlassCard>
              <GlassCard>
                <div className="flex items-center gap-2 mb-3">
                  <Linkedin className="h-5 w-5 text-neon-cyan" />
                  <h3 className="font-display text-lg font-semibold">LinkedIn</h3>
                  <Badge variant="outline" className="ml-auto">synced just now</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="p-2.5 rounded-lg bg-secondary/40">Senior Product Manager · Acme · 2024–Present</li>
                  <li className="p-2.5 rounded-lg bg-secondary/40">Product Manager · Acme · 2022–2024</li>
                  <li className="p-2.5 rounded-lg bg-secondary/40">12 endorsed skills · 4 recommendations</li>
                </ul>
              </GlassCard>
            </div>

            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-neon-pink" />Detected gaps & suggestions</h3>
                <Button size="sm" className="bg-gradient-aurora animate-aurora text-background"><Plus className="h-4 w-4 mr-1" />Import all</Button>
              </div>
              <div className="space-y-2.5">
                {gaps.map((g, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors">
                    {g.type === "missing" ? <AlertTriangle className="h-4 w-4 mt-0.5 text-neon-amber shrink-0" /> :
                     g.type === "mismatch" ? <AlertTriangle className="h-4 w-4 mt-0.5 text-neon-pink shrink-0" /> :
                     <CheckCircle2 className="h-4 w-4 mt-0.5 text-neon-lime shrink-0" />}
                    <div className="flex-1 text-sm">{g.text}</div>
                    <Button size="sm" variant="ghost" className="text-neon-cyan hover:text-neon-cyan">
                      {g.action} <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </>
        )}
      </main>
    </div>
  );
}