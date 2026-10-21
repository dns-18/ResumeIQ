import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-10 w-10" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[min(320px,85vw)] flex-col border-white/10 p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="p-4">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-1 px-3">
                  {nav.map((n) => {
                    const active = pathname === n.to;
                    return (
                      <SheetClose asChild key={n.to}>
                        <Link
                          to={n.to}
                          className={`flex min-h-11 items-center rounded-xl px-3 text-base font-medium ${
                            active
                              ? "bg-white/10 text-foreground"
                              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                          }`}
                        >
                          {n.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
                <div className="mt-auto flex flex-col gap-2 border-t border-white/10 p-4">
                  <SheetClose asChild>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/dashboard">Sign in</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild className="w-full bg-gradient-aurora animate-aurora text-background font-semibold hover:opacity-90">
                      <Link to="/dashboard">Launch app</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
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
