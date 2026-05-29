import { FormEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Instagram, Mic, MicOff, Twitter } from "lucide-react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionInstance = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventShape) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};

type SpeechRecognitionEventShape = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const fadeVideo = (
  video: HTMLVideoElement,
  targetOpacity: number,
  duration: number,
  animationRef: MutableRefObject<number | null>,
) => {
  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
  }

  const startOpacity = Number.parseFloat(video.style.opacity || "0");
  const startedAt = performance.now();

  const animate = (now: number) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    video.style.opacity = String(startOpacity + (targetOpacity - startOpacity) * progress);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    animationRef.current = null;
  };

  animationRef.current = requestAnimationFrame(animate);
};

const useLoopingVideoFade = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.style.opacity = "0";

    const fadeIn = () => {
      fadingOutRef.current = false;
      fadeVideo(video, 1, 500, animationRef);
    };

    const fadeOutBeforeLoop = () => {
      if (!video.duration || fadingOutRef.current) return;

      if (video.duration - video.currentTime <= 0.55) {
        fadingOutRef.current = true;
        fadeVideo(video, 0, 500, animationRef);
      }
    };

    const restartAfterFade = () => {
      video.style.opacity = "0";
      window.setTimeout(() => {
        video.currentTime = 0;
        void video.play();
        fadeIn();
      }, 100);
    };

    video.addEventListener("loadeddata", fadeIn);
    video.addEventListener("timeupdate", fadeOutBeforeLoop);
    video.addEventListener("ended", restartAfterFade);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      video.removeEventListener("loadeddata", fadeIn);
      video.removeEventListener("timeupdate", fadeOutBeforeLoop);
      video.removeEventListener("ended", restartAfterFade);
    };
  }, []);

  return videoRef;
};

const useVoiceResume = () => {
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("Say: set role product designer, add skill React, or analyze resume.");
  const [resume, setResume] = useState({
    name: "Dhruv",
    role: "AI Resume Builder",
    skills: ["React", "TypeScript", "Career AI"],
    experience: ["Built a voice-guided resume workflow with cinematic onboarding."],
    score: 82,
  });
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const applyCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    const lowerCommand = command.toLowerCase();

    if (!command) return;
    setMessage(`Heard: "${command}"`);

    if (lowerCommand.startsWith("set name ")) {
      const name = command.slice(9).trim();
      setResume((current) => ({ ...current, name: name || current.name }));
      return;
    }

    if (lowerCommand.startsWith("set role ")) {
      const role = command.slice(9).trim();
      setResume((current) => ({ ...current, role: role || current.role }));
      return;
    }

    if (lowerCommand.startsWith("add skill ")) {
      const skill = command.slice(10).trim();
      setResume((current) => ({
        ...current,
        skills: skill ? Array.from(new Set([...current.skills, skill])) : current.skills,
        score: Math.min(current.score + 3, 99),
      }));
      return;
    }

    if (lowerCommand.startsWith("add experience ")) {
      const experience = command.slice(15).trim();
      setResume((current) => ({
        ...current,
        experience: experience ? [experience, ...current.experience].slice(0, 3) : current.experience,
        score: Math.min(current.score + 5, 99),
      }));
      return;
    }

    if (lowerCommand.includes("analyze resume") || lowerCommand.includes("improve resume")) {
      setResume((current) => ({ ...current, score: Math.min(current.score + 8, 99) }));
      setMessage("AI pass complete: strengthened keywords, impact language, and ATS clarity.");
      return;
    }

    setMessage("Try: set name, set role, add skill, add experience, or analyze resume.");
  };

  const toggleListening = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setMessage("Voice commands need Chrome, Edge, or another browser with Web Speech support.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const latest = event.results[event.results.length - 1];
      if (latest?.isFinal) {
        applyCommand(latest[0].transcript);
      }
    };
    recognition.onerror = (event) => {
      setListening(false);
      setMessage(
        event.error === "not-allowed"
          ? "Microphone permission is blocked. Allow microphone access in the browser and try again."
          : `Voice command stopped: ${event.error}.`,
      );
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setMessage("Listening. Try: add skill leadership, set role product manager, analyze resume.");
  };

  return { applyCommand, listening, message, resume, toggleListening };
};

export default function Landing() {
  const videoRef = useLoopingVideoFade();
  const { applyCommand, listening, message, resume, toggleListening } = useVoiceResume();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyCommand("analyze resume");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full translate-y-[17%] object-cover"
        src={VIDEO_URL}
        muted
        autoPlay
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/85 to-transparent" />

      <div className="relative flex min-h-screen flex-col">
        <nav className="relative z-20 px-6 py-6">
          <div className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white" aria-label="ResumeIQ home">
                <Globe size={24} />
                <span>ResumeIQ</span>
              </Link>
              <div className="hidden items-center gap-8 md:flex">
                {[
                  { label: "Features", to: "/dashboard" },
                  { label: "Pricing", to: "/benchmark" },
                  { label: "About", to: "/copilot" },
                ].map((item) => (
                  <Link
                    className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                    key={item.label}
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link className="text-sm font-medium text-white" to="/dashboard">
                Sign Up
              </Link>
              <Link className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white" to="/dashboard">
                Login
              </Link>
            </div>
          </div>
        </nav>

        <section className="relative z-10 flex flex-1 -translate-y-[20%] flex-col items-center justify-center px-6 py-12 text-center">
          <h1
            className="mb-8 whitespace-nowrap text-5xl tracking-tight text-white md:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Built for the curious
          </h1>

          <div className="w-full max-w-xl space-y-4">
            <form className="liquid-glass flex items-center gap-3 rounded-full py-2 pl-6 pr-2" onSubmit={onSubmit}>
              <input
                className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40"
                placeholder="Enter your email"
                type="email"
                aria-label="Email address"
              />
              <button className="rounded-full bg-white p-3 text-black" type="submit" aria-label="Submit email">
                <ArrowRight size={20} />
              </button>
            </form>
            <p className="px-4 text-sm leading-relaxed text-white">
              Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on
              exciting updates.
            </p>
            <Link
              className="liquid-glass inline-flex rounded-full px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
              to="/voice-builder"
            >
              Build with voice
            </Link>
          </div>
        </section>

        <aside className="absolute bottom-24 right-6 z-20 hidden w-80 text-left lg:block">
          <div className="liquid-glass rounded-[28px] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/45">Voice Resume AI</p>
                <h2 className="text-lg font-semibold text-white">{resume.name}</h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-black">{resume.score}</span>
            </div>
            <p className="text-sm text-white/70">{resume.role}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {resume.experience[0] || "Add experience by voice."}
            </p>
            <p className="mt-4 text-xs text-white/45">{message}</p>
            <button
              aria-pressed={listening}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black"
              onClick={toggleListening}
              type="button"
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
              {listening ? "Stop listening" : "Start voice build"}
            </button>
          </div>
        </aside>

        <footer className="relative z-10 flex justify-center gap-4 pb-12">
          {[
            { icon: Instagram, label: "Instagram" },
            { icon: Twitter, label: "Twitter" },
            { icon: Globe, label: "Website" },
          ].map(({ icon: Icon, label }) => (
            <button
              aria-label={label}
              className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
              key={label}
              type="button"
            >
              <Icon size={20} />
            </button>
          ))}
        </footer>
      </div>
    </main>
  );
}
