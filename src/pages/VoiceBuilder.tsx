import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles, FileText, Download, RefreshCw, Wand2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const SAMPLE_RESUME = `JANE DOE
Senior Product Manager · jane@email.com · linkedin.com/in/janedoe

SUMMARY
Product leader with 6+ years driving 0→1 launches and scaling SaaS platforms. Led cross-functional teams of 8+ across engineering, design, and data to deliver measurable revenue and engagement growth.

EXPERIENCE
Senior Product Manager — Acme Corp · 2022–Present
• Launched flagship analytics suite reaching $4M ARR in 9 months (+38% MAU)
• Led discovery for 3 net-new features, lifting activation by 24%
• Mentored 4 junior PMs and instituted weekly customer-research cadence

Product Manager — Beta Inc · 2019–2022
• Owned mobile onboarding redesign, reducing drop-off by 31%
• Shipped 12 A/B tests; 7 winners contributed +$1.2M incremental revenue

SKILLS
Product strategy · Roadmapping · OKRs · SQL · A/B testing · Figma · Stakeholder management`;

export default function VoiceBuilder() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [resume, setResume] = useState("");
  const recRef = useRef<any>(null);
  const listeningRef = useRef(false);

  useEffect(() => { listeningRef.current = listening; }, [listening]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
    rec.onresult = (e: any) => {
      let finalT = "", interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalT += t + " "; else interim += t;
      }
      if (finalT) setTranscript((p) => (p + " " + finalT).trim());
    };
    rec.onend = () => { if (listeningRef.current) { try { rec.start(); } catch {} } };
    recRef.current = rec;
    return () => { try { rec.stop(); } catch {} };
  }, []);

  const toggle = async () => {
    if (!recRef.current) return;
    if (listening) { setListening(false); recRef.current.stop(); return; }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setListening(true); recRef.current.start();
      toast({ title: "Listening…", description: "Tell us about your career." });
    } catch { toast({ title: "Microphone permission required" }); }
  };

  const generate = () => {
    if (!transcript.trim()) { toast({ title: "Tell us about your experience first" }); return; }
    setGenerating(true);
    setTimeout(() => { setResume(SAMPLE_RESUME); setGenerating(false); }, 1800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">No typing required</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Voice Resume Builder</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Just talk. We'll transform your story into an ATS-optimized, professionally formatted resume.</p>
        </motion.div>

        {!supported && (
          <GlassCard><p className="text-sm text-neon-amber">Voice input isn't supported on this browser. Try Chrome or Edge.</p></GlassCard>
        )}

        <div className="grid lg:grid-cols-2 gap-4">
          <GlassCard glow className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2"><Mic className="h-5 w-5 text-neon-pink" />Speak your story</h3>
              <span className="text-xs text-muted-foreground font-mono">{transcript.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <div className="flex justify-center my-6">
              <motion.button whileTap={{ scale: 0.92 }} onClick={toggle}
                className={`relative h-28 w-28 rounded-full flex items-center justify-center shadow-elevated transition-colors ${listening ? "bg-gradient-aurora animate-aurora text-background" : "glass text-foreground"}`}>
                {listening ? <Mic className="h-10 w-10" /> : <MicOff className="h-10 w-10" />}
                {listening && (<><span className="absolute inset-0 rounded-full bg-neon-violet/30 animate-ping" /><span className="absolute -inset-2 rounded-full border border-neon-cyan/40 animate-pulse" /></>)}
              </motion.button>
            </div>
            <div className="rounded-xl bg-secondary/40 p-4 min-h-[160px] text-sm flex-1">
              {transcript ? <p className="whitespace-pre-wrap">{transcript}</p> : <p className="text-muted-foreground italic">"I'm a product manager with 6 years of experience. I led a $4M launch at Acme last year and grew MAU by 38%…"</p>}
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="glass border-border" onClick={() => setTranscript("")}><RefreshCw className="h-4 w-4 mr-2" />Clear</Button>
              <Button onClick={generate} disabled={generating} className="flex-1 bg-gradient-aurora animate-aurora text-background">
                {generating ? (<><Sparkles className="h-4 w-4 mr-2 animate-pulse" />Generating…</>) : (<><Wand2 className="h-4 w-4 mr-2" />Generate resume</>)}
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-neon-cyan" />AI-formatted resume</h3>
              {resume && <Button size="sm" variant="outline" className="glass border-border"><Download className="h-4 w-4 mr-1.5" />PDF</Button>}
            </div>
            <div className="rounded-xl bg-background/60 border border-border p-5 font-mono text-xs leading-relaxed flex-1 overflow-auto min-h-[320px]">
              <AnimatePresence mode="wait">
                {resume ? (
                  <motion.pre key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap">{resume}</motion.pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground italic text-center">Your generated resume will appear here.<br />Speak first, then hit "Generate".</div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}