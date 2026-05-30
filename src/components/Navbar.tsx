import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/versions", label: "Versions" },
  { to: "/voice-builder", label: "Voice Build" },
  { to: "/cover-letter", label: "Cover Letter" },
  { to: "/linkedin-sync", label: "LinkedIn" },
  { to: "/benchmark", label: "Benchmark" },
  { to: "/copilot", label: "Copilot" },
];

export const Navbar = () => {
  const { pathname } = useLocation();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="glass rounded-full px-4 py-2.5 flex items-center justify-between shadow-glass">
          <Link to="/"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`relative px-3 py-1.5 text-sm rounded-full transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{n.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/dashboard">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-aurora animate-aurora text-background font-semibold hover:opacity-90">
              <Link to="/dashboard">Launch app</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
