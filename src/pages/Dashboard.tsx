import { useState } from "react";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart, CartesianGrid
} from "recharts";
import {
  TrendingUp, Trophy, Target, Flame, Sparkles, CheckCircle2, AlertTriangle,
  Zap, FileText, Brain, ArrowUpRight, Download
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { ScoreRing } from "@/components/ScoreRing";
import { UploadZone } from "@/components/UploadZone";
import { CopilotPanel } from "@/components/CopilotPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const radarData = [
  { axis: "Keywords", v: 88 },
  { axis: "Formatting", v: 94 },
  { axis: "Impact", v: 76 },
  { axis: "Clarity", v: 82 },
  { axis: "Leadership", v: 71 },
  { axis: "Relevance", v: 90 },
];
const atsBars = [
  { name: "Workday", score: 94 },
  { name: "Greenhouse", score: 89 },
  { name: "Lever", score: 91 },
  { name: "Taleo", score: 72 },
  { name: "iCIMS", score: 85 },
];
const skillTrend = [
  { m: "Jan", rising: 30, falling: 20 },
  { m: "Feb", rising: 42, falling: 24 },
  { m: "Mar", rising: 55, falling: 22 },
  { m: "Apr", rising: 64, falling: 28 },
  { m: "May", rising: 78, falling: 26 },
  { m: "Jun", rising: 88, falling: 30 },
];
const insights = [
  { type: "win", text: "Strong measurable impact in 4 bullets", icon: CheckCircle2 },
  { type: "warn", text: "Summary feels generic — try sharper hook", icon: AlertTriangle },
  { type: "win", text: "Excellent keyword density for target role", icon: CheckCircle2 },
  { type: "warn", text: "Missing: 'roadmap', 'OKRs', 'stakeholder'", icon: AlertTriangle },
];
const achievements = [
  { name: "First Upload", unlocked: true },
  { name: "Score 90+", unlocked: true },
  { name: "ATS Master", unlocked: true },
  { name: "Streak: 7d", unlocked: true },
  { name: "DNA Decoded", unlocked: false },
  { name: "Interview Ready", unlocked: false },
];

export default function Dashboard() {
  const [analyzed, setAnalyzed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Workspace</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">AI Analysis Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass border-border"><Download className="h-4 w-4 mr-2" />Export PDF</Button>
            <Button className="bg-gradient-aurora animate-aurora text-background"><Sparkles className="h-4 w-4 mr-2" />New analysis</Button>
          </div>
        </motion.div>

        {!analyzed ? (
          <GlassCard glow className="p-8">
            <UploadZone onComplete={() => setAnalyzed(true)} />
          </GlassCard>
        ) : (
          <>
            {/* Top grid */}
            <div className="grid lg:grid-cols-3 gap-4">
              <GlassCard glow className="lg:col-span-1 flex flex-col items-center justify-center">
                <ScoreRing score={87} />
                <div className="mt-4 text-center">
                  <div className="text-sm text-muted-foreground">Overall ATS compatibility</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-neon-lime">
                    <TrendingUp className="h-4 w-4" /> +14 since last run
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Resume Personality DNA</div>
                    <h3 className="font-display text-xl font-semibold mt-1">Strategic Leader · Analytical Builder</h3>
                  </div>
                  <Badge className="bg-gradient-aurora animate-aurora text-background border-0">DNA</Badge>
                </div>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar dataKey="v" stroke="hsl(var(--neon-violet))" fill="hsl(var(--neon-violet))" fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            {/* Insights + ATS bars */}
            <div className="grid lg:grid-cols-3 gap-4">
              <GlassCard className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-semibold flex items-center gap-2"><Shield className="h-5 w-5 text-neon-cyan" />ATS Battlefield</h3>
                  <span className="text-xs text-muted-foreground">5 engines compared</span>
                </div>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={atsBars}>
                      <defs>
                        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--neon-violet))" />
                          <stop offset="100%" stopColor="hsl(var(--neon-cyan))" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                      <Bar dataKey="score" fill="url(#bar-grad)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-display text-xl font-semibold flex items-center gap-2 mb-4"><Brain className="h-5 w-5 text-neon-pink" />AI Insights</h3>
                <div className="space-y-2.5">
                  {insights.map((i, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-secondary/50"
                    >
                      <i.icon className={`h-4 w-4 mt-0.5 ${i.type === "win" ? "text-neon-lime" : "text-neon-amber"}`} />
                      <span className="text-sm">{i.text}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Skill trend + interview + gamification */}
            <div className="grid lg:grid-cols-3 gap-4">
              <GlassCard className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-neon-lime" />Skill Gap Forecast</h3>
                  <span className="text-xs text-muted-foreground">Next 6 months</span>
                </div>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={skillTrend}>
                      <defs>
                        <linearGradient id="rising" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--neon-lime))" stopOpacity={0.6}/>
                          <stop offset="100%" stopColor="hsl(var(--neon-lime))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="falling" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--neon-pink))" stopOpacity={0.6}/>
                          <stop offset="100%" stopColor="hsl(var(--neon-pink))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="m" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                      <Area type="monotone" dataKey="rising" stroke="hsl(var(--neon-lime))" fill="url(#rising)" strokeWidth={2} />
                      <Area type="monotone" dataKey="falling" stroke="hsl(var(--neon-pink))" fill="url(#falling)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-display text-xl font-semibold flex items-center gap-2 mb-1"><Target className="h-5 w-5 text-neon-cyan" />Interview Predictor</h3>
                <p className="text-xs text-muted-foreground mb-4">Callback probability for "Senior PM @ Google"</p>
                <div className="text-5xl font-display font-bold text-gradient">73%</div>
                <div className="h-2 mt-3 rounded-full bg-secondary overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "73%" }} transition={{ duration: 1.2 }} className="h-full bg-gradient-aurora animate-aurora" />
                </div>
                <div className="mt-4 space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Zap className="h-3.5 w-3.5 text-neon-amber" />3 mock questions ready</div>
                  <Link to="/recruiter-sim" className="inline-flex items-center gap-1 text-neon-cyan hover:underline">
                    Run recruiter sim <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </GlassCard>
            </div>

            {/* Gamification */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold flex items-center gap-2"><Trophy className="h-5 w-5 text-neon-amber" />Career Progression</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5"><Flame className="h-4 w-4 text-neon-pink" />7-day streak</div>
                  <div className="font-mono">Lv. 12 · 2,840 XP</div>
                </div>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden mb-5">
                <motion.div initial={{ width: 0 }} animate={{ width: "68%" }} transition={{ duration: 1.2 }} className="h-full bg-gradient-aurora animate-aurora" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {achievements.map((a, i) => (
                  <motion.div
                    key={a.name}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center ${
                      a.unlocked ? "bg-gradient-aurora animate-aurora text-background shadow-neon" : "bg-secondary text-muted-foreground opacity-50"
                    }`}
                  >
                    <Trophy className="h-5 w-5 mb-1" />
                    <div className="text-[10px] font-semibold leading-tight">{a.name}</div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/recruiter-sim"><GlassCard className="hover:shadow-elevated cursor-pointer h-full">
                <FileText className="h-6 w-6 text-neon-violet mb-2" />
                <div className="font-display font-semibold">Recruiter Simulation</div>
                <p className="text-sm text-muted-foreground mt-1">See the 6-second scan with heatmap & AI commentary.</p>
              </GlassCard></Link>
              <Link to="/dna"><GlassCard className="hover:shadow-elevated cursor-pointer h-full">
                <Brain className="h-6 w-6 text-neon-cyan mb-2" />
                <div className="font-display font-semibold">Resume DNA</div>
                <p className="text-sm text-muted-foreground mt-1">Decode tone, leadership, recruiter perception.</p>
              </GlassCard></Link>
              <Link to="/copilot"><GlassCard className="hover:shadow-elevated cursor-pointer h-full">
                <Sparkles className="h-6 w-6 text-neon-pink mb-2" />
                <div className="font-display font-semibold">Rewrite Studio</div>
                <p className="text-sm text-muted-foreground mt-1">Inline AI suggestions on every line.</p>
              </GlassCard></Link>
            </div>
          </>
        )}
      </main>
      <CopilotPanel />
    </div>
  );
}

function Shield(props: any) {
  // small inline so we don't pull another icon import
  return <Sparkles {...props} />;
}