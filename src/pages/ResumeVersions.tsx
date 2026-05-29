import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Copy, Trash2, Star, Trophy, FileText, Target, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Version = { id: string; name: string; role: string; score: number; applies: number; callbacks: number; updated: string; best?: boolean };

const initialVersions: Version[] = [
  { id: "v1", name: "PM · FAANG", role: "Senior Product Manager", score: 92, applies: 14, callbacks: 6, updated: "2d ago", best: true },
  { id: "v2", name: "PM · Startup", role: "Product Lead", score: 87, applies: 9, callbacks: 3, updated: "5d ago" },
  { id: "v3", name: "Growth PM", role: "Growth Product Manager", score: 84, applies: 11, callbacks: 2, updated: "1w ago" },
  { id: "v4", name: "Technical PM", role: "Technical PM @ Infra", score: 78, applies: 6, callbacks: 1, updated: "2w ago" },
];

export default function ResumeVersions() {
  const [versions, setVersions] = useState<Version[]>(initialVersions);
  const [selected, setSelected] = useState<string[]>(["v1", "v2"]);

  const toggle = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s);
  };

  const duplicate = (v: Version) => {
    setVersions([...versions, { ...v, id: `v${Date.now()}`, name: `${v.name} (copy)`, best: false, updated: "just now" }]);
  };
  const remove = (id: string) => setVersions(versions.filter((v) => v.id !== id));

  const compared = versions.filter((v) => selected.includes(v.id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Resume vault</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Multi-Version Manager</h1>
            <p className="text-muted-foreground mt-1">Tailor a resume per role · Track which version converts best.</p>
          </div>
          <Button className="bg-gradient-aurora animate-aurora text-background"><Plus className="h-4 w-4 mr-2" />New version</Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4">
          {versions.map((v, i) => {
            const isSelected = selected.includes(v.id);
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard glow={v.best} className={`h-full transition-all cursor-pointer ${isSelected ? "ring-2 ring-neon-cyan" : ""}`}>
                  <div className="flex items-start justify-between mb-3" onClick={() => toggle(v.id)}>
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-neon-violet" />
                        <span className="font-display font-semibold">{v.name}</span>
                        {v.best && <Badge className="bg-gradient-aurora animate-aurora text-background border-0 text-[10px]"><Trophy className="h-3 w-3 mr-1" />Top</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{v.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl font-bold text-gradient">{v.score}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">ATS</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="rounded-lg bg-secondary/40 p-2">
                      <div className="text-sm font-semibold">{v.applies}</div>
                      <div className="text-[10px] text-muted-foreground">Applied</div>
                    </div>
                    <div className="rounded-lg bg-secondary/40 p-2">
                      <div className="text-sm font-semibold text-neon-lime">{v.callbacks}</div>
                      <div className="text-[10px] text-muted-foreground">Callbacks</div>
                    </div>
                    <div className="rounded-lg bg-secondary/40 p-2">
                      <div className="text-sm font-semibold">{Math.round((v.callbacks / Math.max(v.applies, 1)) * 100)}%</div>
                      <div className="text-[10px] text-muted-foreground">Rate</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Updated {v.updated}</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => duplicate(v)}><Copy className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(v.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold flex items-center gap-2"><Target className="h-5 w-5 text-neon-cyan" />Comparison Dashboard</h3>
            <span className="text-xs text-muted-foreground">Select up to 3 versions · {compared.length} selected</span>
          </div>
          {compared.length < 2 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Select at least 2 versions above to compare.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                    <th className="py-2 pr-4">Metric</th>
                    {compared.map((v) => <th key={v.id} className="py-2 pr-4">{v.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "ATS score", key: "score" as const, fmt: (n: number) => n },
                    { label: "Applications", key: "applies" as const, fmt: (n: number) => n },
                    { label: "Callbacks", key: "callbacks" as const, fmt: (n: number) => n },
                  ].map((row) => {
                    const best = Math.max(...compared.map((v) => v[row.key]));
                    return (
                      <tr key={row.label} className="border-b border-border/50">
                        <td className="py-2.5 pr-4 text-muted-foreground">{row.label}</td>
                        {compared.map((v) => (
                          <td key={v.id} className={`py-2.5 pr-4 font-mono ${v[row.key] === best ? "text-neon-lime font-semibold" : ""}`}>
                            {row.fmt(v[row.key])}
                            {v[row.key] === best && <Star className="inline h-3 w-3 ml-1.5 text-neon-amber" />}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="py-2.5 pr-4 text-muted-foreground">Best fit JD</td>
                    {compared.map((v) => <td key={v.id} className="py-2.5 pr-4 text-xs">{v.role}</td>)}
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-neon-lime/10 to-neon-cyan/10 border border-neon-lime/20 text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-neon-lime" />
                AI insight: <span className="text-neon-lime font-semibold">{compared.sort((a,b)=>b.callbacks/Math.max(b.applies,1)-a.callbacks/Math.max(a.applies,1))[0].name}</span> has the highest callback rate — use it as your default for similar roles.
              </div>
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}