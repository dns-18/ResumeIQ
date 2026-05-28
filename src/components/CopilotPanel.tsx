import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, X, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const suggestions = [
  "Rewrite my summary stronger",
  "Optimize for Google PM role",
  "Make this sound leadership-focused",
  "Add quantified metrics",
];

type Msg = { role: "user" | "ai"; text: string };

const fakeReply = (q: string) =>
  `Here's an optimized take on "${q.slice(0, 40)}..."  \nTry: "Led cross-functional team of 12 to ship AI-powered analytics platform, driving 38% lift in retention and $4.2M ARR within two quarters." This swaps weak verbs for measurable impact and surfaces leadership signal that ATS parsers and recruiters both reward.`;

export const CopilotPanel = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi — I'm your AI Career Copilot. Ask me to rewrite a bullet, tune for a target role, or explain any ATS issue." },
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    const reply = fakeReply(text);
    let i = 0;
    setMsgs((m) => [...m, { role: "ai", text: "" }]);
    const id = setInterval(() => {
      i += 3;
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "ai", text: reply.slice(0, i) };
        return copy;
      });
      if (i >= reply.length) { clearInterval(id); setTyping(false); }
    }, 16);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-aurora animate-aurora shadow-neon flex items-center justify-center text-background"
        aria-label="Open AI Copilot"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="fixed right-4 bottom-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))] glass rounded-3xl shadow-elevated flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-aurora animate-aurora flex items-center justify-center">
                  <Bot className="h-5 w-5 text-background" />
                </div>
                <div>
                  <div className="font-display font-semibold leading-tight">Career Copilot</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-lime animate-pulse" /> Online · GPT-Neural
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                    m.role === "ai"
                      ? "bg-secondary text-foreground"
                      : "ml-auto bg-gradient-primary text-background"
                  }`}
                >{m.text || (typing && i === msgs.length - 1 ? "▍" : "")}</motion.div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-border space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> {s}
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the copilot anything…"
                  className="bg-secondary border-border"
                />
                <Button type="submit" size="icon" className="bg-gradient-aurora text-background"><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};