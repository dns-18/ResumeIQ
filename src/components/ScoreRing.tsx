import { motion } from "framer-motion";

export const ScoreRing = ({
  score,
  size = 180,
  label = "ATS Score",
}: { score: number; size?: number; label?: string }) => {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--neon-violet))" />
            <stop offset="50%" stopColor="hsl(var(--neon-pink))" />
            <stop offset="100%" stopColor="hsl(var(--neon-cyan))" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} stroke="hsl(var(--secondary))" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          stroke="url(#ring-grad)" strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 8px hsl(var(--neon-violet) / 0.6))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-display text-4xl font-bold text-gradient"
        >{score}</motion.span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</span>
      </div>
    </div>
  );
};