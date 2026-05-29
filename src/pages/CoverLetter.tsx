import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Copy, Download, RefreshCw, Wand2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const TONES = ["Professional", "Conversational", "Confident", "Storytelling"] as const;

const sampleLetter = (company: string, role: string, tone: string) => `Dear ${company || "Hiring Team"},

When I read the ${role || "Senior Product Manager"} posting, I felt an unusual jolt of recognition — the problems you're describing are the ones I've spent the last six years solving.

At Acme Corp I led the launch of an analytics suite that grew to $4M ARR in nine months, lifting MAU by 38%. What I loved most wasn't the number; it was watching a 6-person team turn fuzzy customer signals into a roadmap the whole company rallied behind. That kind of clarity-from-chaos is what your team seems to be building toward.

I'd bring three things to ${company || "your team"}: a bias for shipping experiments weekly, a habit of writing crisp PRDs that engineers actually enjoy reading, and the discipline to kill features that don't move the metric.

I'd love to talk about how I can help accelerate your roadmap. Thank you for considering my application.

Warmly,
Jane Doe

— Tone: ${tone}`;

export default function CoverLetter() {
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState<typeof TONES[number]>("Professional");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!jd.trim()) { toast({ title: "Paste a job description first" }); return; }
    setLoading(true);
    setTimeout(() => { setLetter(sampleLetter(company, role, tone)); setLoading(false); }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Cover letter AI</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Tailored. Human-Sounding. In Seconds.</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Drop in the JD — our AI cross-references your resume to write a cover letter that doesn't sound like AI.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="font-display text-lg font-semibold flex items-center gap-2 mb-4"><Mail className="h-5 w-5 text-neon-violet" />Job details</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="glass border-border" />
                <Input placeholder="Role title" value={role} onChange={(e) => setRole(e.target.value)} className="glass border-border" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Job description</div>
                <Textarea placeholder="Paste the JD here…" value={jd} onChange={(e) => setJd(e.target.value)} className="glass border-border min-h-[180px]" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Tone</div>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-full text-xs transition-colors ${tone === t ? "bg-gradient-aurora animate-aurora text-background" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <Button onClick={generate} disabled={loading} className="w-full bg-gradient-aurora animate-aurora text-background">
                {loading ? (<><Sparkles className="h-4 w-4 mr-2 animate-pulse" />Crafting…</>) : (<><Wand2 className="h-4 w-4 mr-2" />Generate cover letter</>)}
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-neon-pink" />Your letter</h3>
              {letter && (
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="text-neon-lime border-neon-lime/40">Human-score: 96%</Badge>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(letter); toast({ title: "Copied" }); }}><Copy className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={generate}><RefreshCw className="h-4 w-4" /></Button>
                </div>
              )}
            </div>
            <div className="rounded-xl bg-background/60 border border-border p-5 text-sm leading-relaxed flex-1 overflow-auto min-h-[360px]">
              <AnimatePresence mode="wait">
                {letter ? (
                  <motion.pre key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap font-sans">{letter}</motion.pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground italic text-center">Your tailored cover letter will appear here.</div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}