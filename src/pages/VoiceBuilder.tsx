import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, FileText, Mic, MicOff, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

type SpeechRecognitionInstance = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};

const buildResume = (story: string) => {
  const cleanStory = story.replace(/\s+/g, " ").trim();
  const roleMatch = cleanStory.match(/(?:as|role is|i am|i'm|i work as)\s+(?:a|an)?\s*([^,.]+)/i);
  const role = roleMatch?.[1]?.trim() || "AI-Optimized Professional";

  return `DHRUV
${role} | Voice-built resume | linkedin.com/in/dhruv

SUMMARY
Impact-focused ${role.toLowerCase()} with a clear career story, measurable ownership, and strong communication. Experienced in turning complex work into recruiter-ready achievements.

EXPERIENCE
Featured Career Story
- ${cleanStory || "Describe your work by voice or text to generate tailored resume bullets."}
- Translated responsibilities into outcomes, keywords, and concise achievement-driven bullets.
- Strengthened ATS clarity with role-specific language and clean formatting.

SKILLS
Leadership | Communication | Problem Solving | AI Tools | Resume Strategy | Career Storytelling`;
};

export default function VoiceBuilder() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [resume, setResume] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const listeningRef = useRef(false);

  useEffect(() => {
    listeningRef.current = listening;
  }, [listening]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const spokenText = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          finalText += `${spokenText} `;
        } else {
          interimText += spokenText;
        }
      }

      if (finalText) {
        setTranscript((previous) => `${previous} ${finalText}`.replace(/\s+/g, " ").trim());
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      setListening(false);
      const blocked = event.error === "not-allowed" || event.error === "service-not-allowed";
      toast({
        title: blocked ? "Microphone permission blocked" : "Voice input stopped",
        description: blocked
          ? "Allow microphone access in your browser, or type your career story in the box."
          : `Speech recognition reported: ${event.error}`,
      });
    };

    recognition.onend = () => {
      if (listeningRef.current) {
        try {
          recognition.start();
        } catch {
          setListening(false);
        }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // The browser can throw when recognition is already stopped.
      }
    };
  }, []);

  const toggle = async () => {
    if (!supported || !recognitionRef.current) {
      toast({
        title: "Voice input is not supported here",
        description: "Use Chrome or Edge, or type your story below.",
      });
      return;
    }

    if (listening) {
      setListening(false);
      recognitionRef.current.stop();
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setListening(true);
      recognitionRef.current.start();
      toast({ title: "Listening", description: "Tell ResumeIQ your role, wins, skills, and target job." });
    } catch {
      toast({
        title: "Microphone permission required",
        description: "Allow microphone access, or type your career story in the box.",
      });
    }
  };

  const generate = () => {
    if (!transcript.trim()) {
      toast({ title: "Add your career story first", description: "Speak or type your experience before generating." });
      return;
    }

    setGenerating(true);
    window.setTimeout(() => {
      setResume(buildResume(transcript));
      setGenerating(false);
    }, 900);
  };

  const downloadText = () => {
    if (!resume) return;
    const blob = new Blob([resume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "resumeiq-voice-resume.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">No typing required</div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Voice Resume Builder</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Speak naturally about your work. ResumeIQ turns it into a recruiter-ready, ATS-friendly resume draft.
          </p>
        </motion.div>

        {!supported && (
          <GlassCard>
            <p className="text-sm text-neon-amber">
              Voice input is not supported in this browser. Type your career story below and generate normally.
            </p>
          </GlassCard>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard glow className="flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display flex items-center gap-2 text-lg font-semibold">
                <Mic className="h-5 w-5 text-neon-pink" />
                Speak your story
              </h3>
              <span className="font-mono text-xs text-muted-foreground">
                {transcript.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <div className="my-6 flex justify-center">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={toggle}
                className={`relative flex h-28 w-28 items-center justify-center rounded-full shadow-elevated transition-colors ${
                  listening ? "animate-aurora bg-gradient-aurora text-background" : "glass text-foreground"
                }`}
                type="button"
              >
                {listening ? <Mic className="h-10 w-10" /> : <MicOff className="h-10 w-10" />}
                {listening && (
                  <>
                    <span className="absolute inset-0 animate-ping rounded-full bg-neon-violet/30" />
                    <span className="absolute -inset-2 animate-pulse rounded-full border border-neon-cyan/40" />
                  </>
                )}
              </motion.button>
            </div>

            <Textarea
              className="min-h-[190px] resize-none border-border bg-secondary/40 text-sm"
              onChange={(event) => setTranscript(event.target.value)}
              placeholder="Example: I am a product manager with 6 years of experience. I led a $4M launch, improved activation by 24%, and managed teams across design, engineering, and data."
              value={transcript}
            />
            {interimTranscript && <p className="mt-2 text-xs italic text-muted-foreground">{interimTranscript}</p>}

            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="glass border-border" onClick={() => setTranscript("")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button onClick={generate} disabled={generating} className="animate-aurora flex-1 bg-gradient-aurora text-background">
                {generating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                    Generating
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate resume
                  </>
                )}
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5 text-neon-cyan" />
                AI-formatted resume
              </h3>
              {resume && (
                <Button size="sm" variant="outline" className="glass border-border" onClick={downloadText}>
                  <Download className="mr-1.5 h-4 w-4" />
                  TXT
                </Button>
              )}
            </div>
            <div className="min-h-[390px] flex-1 overflow-auto rounded-xl border border-border bg-background/60 p-5 font-mono text-xs leading-relaxed">
              <AnimatePresence mode="wait">
                {resume ? (
                  <motion.pre key="resume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap">
                    {resume}
                  </motion.pre>
                ) : (
                  <div className="flex h-full items-center justify-center text-center italic text-muted-foreground">
                    Your generated resume will appear here.
                    <br />
                    Speak or type first, then generate.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
