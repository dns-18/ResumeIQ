<div align="center">

# 📄 ResumeIQ

**AI-powered resume analysis platform with ATS scoring, recruiter simulation, and smart job matching.**

![React](https://img.shields.io/badge/React_18-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 **AI Analysis Dashboard** | Upload your resume and get an overall ATS score, radar chart breakdown, keyword gaps, and actionable insights |
| 🛡️ **ATS Battlefield** | See how your resume scores against 5 real ATS engines — Workday, Greenhouse, Lever, Taleo, and iCIMS |
| 🧬 **Resume Personality DNA** | Personality trait radar revealing how recruiters subconsciously perceive your communication style |
| 👁️ **Recruiter Simulation** | Animated 6-second eye-scan heatmap showing exactly where recruiters look — and what they skip |
| ✍️ **Smart Rewrite Studio** | AI-powered inline bullet point rewriter that turns weak lines into measurable, high-impact statements |
| 🎙️ **Voice Resume Builder** | Speak your career story out loud; the app transcribes and formats it into a polished resume |
| 📊 **Competitive Benchmark** | Compare your resume against 100 anonymized candidates applying for the same role |
| 🔗 **LinkedIn × Resume Sync** | Surface gaps and inconsistencies between your resume and LinkedIn profile with one-click imports |
| 📁 **Multi-Version Manager** | Maintain and compare multiple tailored resume versions with score, apply count, and callback tracking |
| 💌 **AI Cover Letter Generator** | Generate tone-matched cover letters (Professional, Conversational, Confident, Storytelling) from a JD paste |
| 🤖 **AI Copilot Panel** | Persistent sidebar assistant for real-time coaching and resume Q&A |
| 🏆 **Gamification** | XP, streaks, levels, and achievement badges to keep the job search motivating |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui + Radix UI |
| Routing | React Router DOM v6 |
| Data Fetching | TanStack React Query |
| Charts | Recharts |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Testing | Vitest + Testing Library |
| Linting | ESLint + TypeScript ESLint |

---

## 📁 Project Structure

```
resumeiq/
├── public/                   # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # shadcn/ui primitives
│   │   ├── Navbar.tsx
│   │   ├── GlassCard.tsx
│   │   ├── ScoreRing.tsx
│   │   ├── UploadZone.tsx
│   │   ├── CopilotPanel.tsx
│   │   ├── VoiceCommand.tsx
│   │   └── ...
│   ├── pages/                # Route-level page components
│   │   ├── Index.tsx         # Landing / home
│   │   ├── Dashboard.tsx     # AI analysis dashboard
│   │   ├── DnaPage.tsx       # Resume personality DNA
│   │   ├── RecruiterSim.tsx  # Recruiter eye-scan simulation
│   │   ├── CopilotPage.tsx   # Smart rewrite studio
│   │   ├── VoiceBuilder.tsx  # Voice resume builder
│   │   ├── Benchmark.tsx     # Competitive benchmarking
│   │   ├── LinkedInSync.tsx  # LinkedIn gap analysis
│   │   ├── ResumeVersions.tsx# Multi-version manager
│   │   └── CoverLetter.tsx   # AI cover letter generator
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── App.tsx               # Root component & routing
│   └── main.tsx              # App entry point
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/resumeiq.git
cd resumeiq

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:8080`.

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run test         # Run tests (Vitest)
npm run test:watch   # Run tests in watch mode
```

---

## 🗺️ Routes

| Path | Page |
|---|---|
| `/` | Landing page |
| `/dashboard` | AI analysis dashboard |
| `/dna` | Resume personality DNA |
| `/recruiter-sim` | Recruiter simulation |
| `/copilot` | Smart rewrite studio |
| `/voice-builder` | Voice resume builder |
| `/benchmark` | Competitive benchmark |
| `/linkedin-sync` | LinkedIn × resume sync |
| `/versions` | Multi-version manager |
| `/cover-letter` | AI cover letter generator |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add your feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Built to help job seekers land their dream roles. 🚀
</div>
