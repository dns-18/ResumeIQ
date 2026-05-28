import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Loader2, CheckCircle2 } from "lucide-react";

type Stage = "idle" | "uploading" | "parsing" | "analyzing" | "done";
const labels: Record<Stage, string> = {
  idle: "Drop your resume here",
  uploading: "Uploading…",
  parsing: "Parsing structure…",
  analyzing: "Running neural ATS analysis…",
  done: "Analysis complete",
};

export const UploadZone = ({ onComplete }: { onComplete?: () => void }) => {
  const [stage, setStage] = useState<Stage>("idle");
  const [filename, setFilename] = useState<string>("");
  const [drag, setDrag] = useState(false);

  const start = useCallback((name: string) => {
    setFilename(name);
    setStage("uploading");
    setTimeout(() => setStage("parsing"), 900);
    setTimeout(() => setStage("analyzing"), 1900);
    setTimeout(() => { setStage("done"); onComplete?.(); }, 3400);
  }, [onComplete]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault(); setDrag(false);
        const f = e.dataTransfer.files?.[0]; if (f) start(f.name);
      }}
      className={`relative rounded-2xl border-2 border-dashed transition-all p-10 text-center ${
        drag ? "border-neon-violet bg-secondary/40" : "border-border"
      }`}
    >
      {stage === "idle" && (
        <label className="cursor-pointer block">
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) start(f.name); }}
          />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mx-auto h-16 w-16 rounded-2xl bg-gradient-aurora animate-aurora flex items-center justify-center shadow-neon mb-4"
          >
            <UploadCloud className="h-8 w-8 text-background" />
          </motion.div>
          <div className="font-display font-semibold text-lg">{labels.idle}</div>
          <div className="text-sm text-muted-foreground mt-1">PDF, DOCX or TXT · up to 10MB</div>
          <div className="mt-4 inline-flex text-xs text-muted-foreground glass px-3 py-1 rounded-full">
            or click to browse
          </div>
        </label>
      )}

      <AnimatePresence>
        {stage !== "idle" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                {stage === "done" ? <CheckCircle2 className="h-6 w-6 text-neon-lime" /> : <FileText className="h-6 w-6 text-neon-cyan" />}
              </div>
              <div className="text-left">
                <div className="font-medium">{filename}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  {stage !== "done" && <Loader2 className="h-3 w-3 animate-spin" />}
                  {labels[stage]}
                </div>
              </div>
            </div>

            <div className="h-1.5 rounded-full bg-secondary overflow-hidden max-w-md mx-auto">
              <motion.div
                initial={{ width: "5%" }}
                animate={{ width: stage === "uploading" ? "30%" : stage === "parsing" ? "60%" : stage === "analyzing" ? "85%" : "100%" }}
                transition={{ duration: 0.6 }}
                className="h-full bg-gradient-aurora animate-aurora"
              />
            </div>

            {stage !== "done" && (
              <div className="flex justify-center gap-1.5">
                {[0,1,2].map(i => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                    className="h-1.5 w-1.5 rounded-full bg-neon-violet"
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};