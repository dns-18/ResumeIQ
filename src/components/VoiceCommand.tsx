import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, HelpCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type SR = any;

const ROUTES: { keywords: string[]; path: string; label: string }[] = [
  { keywords: ["home", "landing", "start", "main"], path: "/", label: "Home" },
  { keywords: ["dashboard", "analyze", "analyse", "analysis", "score"], path: "/dashboard", label: "Dashboard" },
  { keywords: ["recruiter", "simulation", "simulator", "heatmap", "scan"], path: "/recruiter-sim", label: "Recruiter Sim" },
  { keywords: ["dna", "personality", "traits"], path: "/dna", label: "Resume DNA" },
  { keywords: ["copilot", "rewrite", "studio", "assistant", "ai"], path: "/copilot", label: "Copilot" },
  { keywords: ["linkedin", "sync", "gap", "profile"], path: "/linkedin-sync", label: "LinkedIn Sync" },
  { keywords: ["versions", "manager", "vault", "multi"], path: "/versions", label: "Resume Versions" },
  { keywords: ["voice builder", "voice resume", "build resume", "speak"], path: "/voice-builder", label: "Voice Builder" },
  { keywords: ["cover letter", "letter", "cover"], path: "/cover-letter", label: "Cover Letter" },
  { keywords: ["benchmark", "compare", "top ten", "top 10", "competitor"], path: "/benchmark", label: "Benchmark" },
];

const COMMANDS_HELP = [
  '"Go to dashboard"',
  '"Open recruiter simulation"',
  '"Show resume DNA"',
  '"Open copilot"',
  '"Go home"',
  '"Scroll down" / "Scroll up"',
  '"Scroll to top" / "Scroll to bottom"',
  '"Stop listening"',
];

export const VoiceCommand = () => {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const recognitionRef = useRef<SR | null>(null);

  const handleCommand = useCallback(
    (raw: string) => {
      const cmd = raw.toLowerCase().trim();
      if (!cmd) return;

      if (/(stop|cancel|mute|quiet).*(listen|listening|voice)/.test(cmd) || cmd === "stop") {
        recognitionRef.current?.stop();
        return;
      }
      if (/scroll.*top|top of page/.test(cmd)) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast({ title: "Scrolled to top" });
        return;
      }
      if (/scroll.*bottom|bottom of page/.test(cmd)) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        toast({ title: "Scrolled to bottom" });
        return;
      }
      if (/scroll.*down|page down/.test(cmd)) {
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
        return;
      }
      if (/scroll.*up|page up/.test(cmd)) {
        window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" });
        return;
      }
      if (/reload|refresh/.test(cmd)) {
        window.location.reload();
        return;
      }
      if (/(go )?back/.test(cmd)) {
        window.history.back();
        return;
      }

      for (const r of ROUTES) {
        if (r.keywords.some((k) => cmd.includes(k))) {
          navigate(r.path);
          toast({ title: `Navigating to ${r.label}`, description: `"${raw}"` });
          return;
        }
      }

      toast({
        title: "Command not recognized",
        description: `Heard: "${raw}". Try saying "help".`,
      });
    },
    [navigate]
  );

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const rec: SR = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (e: any) => {
      let finalText = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else interim += t;
      }
      setTranscript(interim || finalText);
      if (finalText) {
        handleCommand(finalText);
        setTimeout(() => setTranscript(""), 1200);
      }
    };
    rec.onerror = (e: any) => {
      if (e.error === "not-allowed") {
        toast({
          title: "Microphone blocked",
          description: "Allow mic access to use voice commands.",
        });
        setListening(false);
      }
    };
    rec.onend = () => {
      if (listeningRef.current) {
        try {
          rec.start();
        } catch {}
      } else {
        setListening(false);
      }
    };
    recognitionRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleCommand]);

  const listeningRef = useRef(false);
  useEffect(() => {
    listeningRef.current = listening;
  }, [listening]);

  const toggle = async () => {
    if (!recognitionRef.current) return;
    if (listening) {
      setListening(false);
      recognitionRef.current.stop();
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setListening(true);
        recognitionRef.current.start();
        toast({ title: "Voice commands active", description: 'Try "go to dashboard"' });
      } catch {
        toast({ title: "Microphone permission required" });
      }
    }
  };

  // Keyboard shortcut: Shift + V
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "V" || e.key === "v") && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  if (!supported) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass rounded-xl px-3 py-2 text-xs max-w-xs shadow-glass font-mono"
          >
            <span className="text-muted-foreground">heard: </span>
            <span className="text-foreground">{transcript}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="glass rounded-2xl p-4 w-72 shadow-elevated"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="font-display text-sm font-semibold">Voice commands</div>
              <button
                onClick={() => setShowHelp(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close help"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {COMMANDS_HELP.map((c) => (
                <li key={c} className="font-mono">{c}</li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-border text-[10px] text-muted-foreground">
              Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground">Shift + V</kbd>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={toggle}
          aria-label={listening ? "Stop voice commands" : "Start voice commands"}
          className={`relative h-14 w-14 rounded-full flex items-center justify-center shadow-elevated transition-colors ${
            listening
              ? "bg-gradient-aurora animate-aurora text-background"
              : "glass text-foreground hover:text-foreground"
          }`}
        >
          {listening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          {listening && (
            <>
              <span className="absolute inset-0 rounded-full bg-neon-violet/30 animate-ping" />
              <span className="absolute -inset-1 rounded-full border border-neon-cyan/40 animate-pulse" />
            </>
          )}
        </motion.button>
        <button
          onClick={() => setShowHelp((s) => !s)}
          className="h-9 w-9 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label="Voice command help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default VoiceCommand;