import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Dna,
  Eye,
  FileText,
  Layers,
  LayoutDashboard,
  Linkedin,
  LogOut,
  Menu,
  Mic,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; title: string; icon: LucideIcon };

/** The 9 authenticated app routes, in task order. `title` feeds the topbar. */
const APP_NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", title: "Dashboard", icon: LayoutDashboard },
  { to: "/recruiter-sim", label: "Recruiter Sim", title: "Recruiter Sim", icon: Eye },
  { to: "/dna", label: "Resume DNA", title: "Resume DNA", icon: Dna },
  { to: "/copilot", label: "Copilot", title: "Copilot", icon: Sparkles },
  { to: "/linkedin-sync", label: "LinkedIn Sync", title: "LinkedIn Sync", icon: Linkedin },
  { to: "/versions", label: "Versions", title: "Versions", icon: Layers },
  { to: "/voice-builder", label: "Voice Builder", title: "Voice Builder", icon: Mic },
  { to: "/cover-letter", label: "Cover Letter", title: "Cover Letter", icon: FileText },
  { to: "/benchmark", label: "Benchmark", title: "Benchmark", icon: TrendingUp },
];

/**
 * Real account menu (Phase 2, Step 5). AppShell only renders inside the
 * protected layout, so a user is always present; the null guard is
 * defensive only. Lives in the lazy protected chunk, so the Supabase
 * import behind useAuth never enters the main bundle.
 */
const AccountMenu = ({ compact = false }: { compact?: boolean }) => {
  const { user, displayName, signOut } = useAuth();
  const navigate = useNavigate();
  const initial = (displayName?.[0] ?? "A").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className={cn(
            "flex items-center gap-3 rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10",
            compact ? "p-1.5" : "w-full px-2 py-2 text-left"
          )}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-aurora text-sm font-semibold text-background">
            {initial}
          </span>
          {!compact && (
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-medium text-foreground">{displayName}</span>
              <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block truncate">{displayName}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SidebarNav = ({ inSheet = false }: { inSheet?: boolean }) => (
  <nav className="flex flex-col gap-1">
    {APP_NAV.map(({ to, label, icon: Icon }) => {
      const link = (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "group flex min-h-11 items-center gap-3 rounded-full px-2.5 py-2 text-base font-medium transition-colors lg:min-h-0 lg:text-sm",
              isActive
                ? "bg-white/10 text-foreground shadow-glass"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors",
                  isActive
                    ? "bg-gradient-aurora animate-aurora text-background"
                    : "bg-white/5 text-muted-foreground group-hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </>
          )}
        </NavLink>
      );
      // Inside the mobile Sheet, tapping a link must also close the sheet
      // (same SheetClose pattern the Phase 1 Navbar used).
      return inSheet ? (
        <SheetClose asChild key={to}>
          {link}
        </SheetClose>
      ) : (
        link
      );
    })}
  </nav>
);

/**
 * Layout for the 9 app routes (Landing and NotFound live outside it).
 * Desktop: fixed aurora-branded sidebar. Mobile: glass topbar + Sheet menu —
 * the same Sheet pattern Phase 1 established. Content keeps bottom clearance
 * for the global FABs rendered in App.tsx / pages (VoiceCommand, CopilotPanel).
 */
export const AppShell = () => {
  const { pathname } = useLocation();
  const title = APP_NAV.find((n) => n.to === pathname)?.title ?? "ResumeIQ";

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[hsl(220_18%_6%/0.72)] backdrop-blur-xl lg:flex">
        <div className="px-5 pb-2 pt-6">
          <NavLink to="/" aria-label="ResumeIQ home">
            <Logo />
          </NavLink>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav />
        </div>
        <div className="border-t border-white/10 p-4">
          <AccountMenu />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[hsl(220_18%_5%/0.72)] backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-[min(320px,85vw)] flex-col border-white/10 p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="p-4">
                  <Logo />
                </div>
                <div className="flex-1 overflow-y-auto px-3">
                  <SidebarNav inSheet />
                </div>
                <div className="border-t border-white/10 p-4">
                  <AccountMenu />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="font-display text-lg font-semibold tracking-tight">{title}</h1>
            <div className="ml-auto">
              <AccountMenu compact />
            </div>
          </div>
        </header>

        {/* Content — ambient aurora glows echo the Landing hero, kept subtle.
            pb keeps the fixed FABs (voice bottom-left, copilot bottom-right) clear. */}
        <div className="relative flex-1">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(var(--neon-violet)/0.13),transparent_70%)] blur-2xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,hsl(var(--neon-cyan)/0.09),transparent_70%)] blur-2xl" />
            <div className="absolute bottom-1/3 left-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(var(--neon-pink)/0.07),transparent_70%)] blur-2xl" />
          </div>
          <div className="relative pb-24">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
