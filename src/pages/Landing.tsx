import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Brain, Eye, Dna, Rocket, Sparkles, Target, Trophy,
  Workflow, Mic, Users, Wand2, BarChart3, Shield, Zap
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { ScoreRing } from "@/components/ScoreRing";
import { CopilotPanel } from "@/components/CopilotPanel";

const features = [
  { icon: Eye, title: "Recruiter Simulation", desc: "Watch the 6-second scan with heatmaps and AI commentary.", color: "from-neon-violet to-neon-pink" },
  { icon: Brain, title: "AI Career Copilot", desc: "Conversational rewriting tuned to any target role.", color: "from-neon-cyan to-neon-violet" },
  { icon: Dna, title: "Resume Personality DNA", desc: "Classify tone, leadership traits & recruiter perception.", color: "from-neon-pink to-neon-amber" },
  { icon: Shield, title: "ATS Battlefield", desc: "Compare against Workday, Greenhouse, Lever, Taleo.", color: "from-neon-lime to-neon-cyan" },
  { icon: BarChart3, title: "Skill Gap Forecast", desc: "See which skills are rising and falling in your field.", color: "from-neon-amber to-neon-pink" },
  { icon: Target, title: "Interview Predictor", desc: "Callback probability with AI mock questions.", color: "from-neon-violet to-neon-cyan" },
  { icon: Wand2, title: "Rewrite Studio", desc: "Inline AI suggestions on every line of your resume.", color: "from-neon-cyan to-neon-lime" },
  { icon: Workflow, title: "Job Match Universe", desc: "Galaxy view of jobs orbiting your profile.", color: "from-neon-pink to-neon-violet" },
  { icon: Trophy, title: "Gamified Progression", desc: "XP, streaks, achievements as your score grows.", color: "from-neon-amber to-neon-lime" },
  { icon: Users, title: "Live Collaboration", desc: "Share with mentors, get live comments and cursors.", color: "from-neon-cyan to-neon-pink" },
  { icon: Mic, title: "Voice Analysis", desc: "Hear your report read with conversational AI.", color: "from-neon-violet to-neon-amber" },
  { icon: Sparkles, title: "Storytelling Engine", desc: "Turn your career into a recruiter-grade narrative.", color: "from-neon-lime to-neon-violet" },
];

const stats = [
  { v: "3.7x", l: "More interview calls" },
  { v: "94%", l: "ATS pass rate" },
  { v: "120k+", l: "Resumes optimized" },
  { v: "<6s", l: "Recruiter scan modeled" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative px-4 pt-12 pb-32">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neon-lime animate-pulse" />
              Now with Recruiter Simulation Engine v2 · Live
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
              Beat the bots.
              <br />
              <span className="text-gradient animate-aurora">Land the interview.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              NeuroATS is the AI career intelligence platform that simulates real recruiters,
              decodes your resume DNA, and rewrites your story in seconds.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-aurora animate-aurora text-background font-semibold text-base h-12 px-6 shadow-neon hover:opacity-90">
                <Link to="/dashboard">
                  Analyze my resume <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 glass border-border">
                <Link to="/recruiter-sim">
                  <Eye className="mr-2 h-4 w-4" /> See recruiter sim
                </Link>
              </Button>
            </div>

            <div className="mt-16 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-12 bg-gradient-glow blur-3xl opacity-60 animate-pulse-glow rounded-full" />
                <div className="relative glass rounded-3xl p-10 shadow-elevated">
                  <ScoreRing score={92} size={220} />
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-6 glass rounded-xl px-3 py-2 text-xs flex items-center gap-2 shadow-glass"
                >
                  <Zap className="h-3.5 w-3.5 text-neon-amber" /> +18 pts this week
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-2 -left-8 glass rounded-xl px-3 py-2 text-xs flex items-center gap-2 shadow-glass"
                >
                  <Trophy className="h-3.5 w-3.5 text-neon-lime" /> Streak: 7 days
                </motion.div>
              </motion.div>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-5"
                >
                  <div className="font-display text-3xl font-bold text-gradient">{s.v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-4">
              <Sparkles className="h-3 w-3" /> Twelve superpowers, one platform
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Not another ATS checker. <span className="text-gradient">A career co-pilot.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every feature is built around how modern recruiters actually evaluate candidates.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <GlassCard
                key={f.title}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                className="group hover:shadow-elevated cursor-pointer"
              >
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-5 w-5 text-background" />
                </div>
                <h3 className="font-display font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <GlassCard glow className="text-center p-12 md:p-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-50 animate-pulse-glow" />
            <div className="relative">
              <Rocket className="h-12 w-12 mx-auto text-gradient mb-6" />
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Ready to <span className="text-gradient">10x your callbacks?</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Drop your resume. Get your AI report, recruiter simulation, and career DNA in under 30 seconds.
              </p>
              <Button asChild size="lg" className="mt-8 bg-gradient-aurora animate-aurora text-background font-semibold h-12 px-8 shadow-neon">
                <Link to="/dashboard">Start free analysis <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>

      <footer className="px-4 py-10 border-t border-border">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© 2026 NeuroATS — Built for the future of work.</div>
          <div className="flex gap-6">
            <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <Link to="/copilot" className="hover:text-foreground">Copilot</Link>
            <Link to="/dna" className="hover:text-foreground">DNA</Link>
          </div>
        </div>
      </footer>

      <CopilotPanel />
    </div>
  );
}