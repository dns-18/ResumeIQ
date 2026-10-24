import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import RecruiterSim from "./pages/RecruiterSim.tsx";
import DnaPage from "./pages/DnaPage.tsx";
import CopilotPage from "./pages/CopilotPage.tsx";
import LinkedInSync from "./pages/LinkedInSync.tsx";
import ResumeVersions from "./pages/ResumeVersions.tsx";
import VoiceBuilder from "./pages/VoiceBuilder.tsx";
import CoverLetter from "./pages/CoverLetter.tsx";
import Benchmark from "./pages/Benchmark.tsx";
// Auth pages are lazy-loaded so the Supabase client (~240 kB) ships in its
// own chunk, fetched only when visiting /login or /signup — not in the
// main bundle every visitor downloads. The protected layout is lazy for
// the same reason: it owns the session (AuthProvider) and the shell.
const Login = lazy(() => import("./pages/Login.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const ProtectedLayout = lazy(() => import("./components/auth/ProtectedLayout.tsx"));
import VoiceCommand from "./components/VoiceCommand";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VoiceCommand />
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Auth pages: shell-free, landing-style layout (route protection is Step 5). */}
          <Route
            path="/login"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
                    Loading…
                  </div>
                }
              >
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
                    Loading…
                  </div>
                }
              >
                <Signup />
              </Suspense>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
                    Loading…
                  </div>
                }
              >
                <ForgotPassword />
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
                    Loading…
                  </div>
                }
              >
                <ResetPassword />
              </Suspense>
            }
          />
          {/* The 9 app routes render inside the protected layout (session
              gate + shared AppShell) — guests are redirected to /login. */}
          <Route
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
                    Loading…
                  </div>
                }
              >
                <ProtectedLayout />
              </Suspense>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recruiter-sim" element={<RecruiterSim />} />
            <Route path="/dna" element={<DnaPage />} />
            <Route path="/copilot" element={<CopilotPage />} />
            <Route path="/linkedin-sync" element={<LinkedInSync />} />
            <Route path="/versions" element={<ResumeVersions />} />
            <Route path="/voice-builder" element={<VoiceBuilder />} />
            <Route path="/cover-letter" element={<CoverLetter />} />
            <Route path="/benchmark" element={<Benchmark />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
