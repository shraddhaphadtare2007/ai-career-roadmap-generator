import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bot,
  Briefcase,
  ClipboardList,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useMe } from "@/lib/auth";
import { endSession } from "@/lib/session";
import { toast } from "sonner";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, testid: "nav-dashboard" },
  { to: "/assessment", label: "Assessment", icon: ClipboardList, testid: "nav-assessment" },
  { to: "/roadmap", label: "My Roadmap", icon: Map, testid: "nav-roadmap" },
  { to: "/skills", label: "Skills", icon: Gauge, testid: "nav-skills" },
  { to: "/courses", label: "Courses", icon: BookOpen, testid: "nav-courses" },
  { to: "/projects", label: "Projects", icon: FolderKanban, testid: "nav-projects" },
  { to: "/internships", label: "Internships", icon: Briefcase, testid: "nav-internships" },
  { to: "/profile", label: "Profile", icon: UserRound, testid: "nav-profile" },
];

export default function AppShell() {
  const { data: user } = useMe();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await endSession();
    toast.success("Logged out — see you soon!");
    navigate("/login", { replace: true });
  };

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const renderNavLinks = (onNavigate?: () => void) =>
    NAV_ITEMS.map(({ to, label, icon: Icon, testid }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onNavigate}
        data-testid={testid}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
            isActive
              ? "bg-sky-500/15 text-sky-300 border border-sky-500/20"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
          }`
        }
      >
        <Icon className="h-4 w-4" />
        {label}
      </NavLink>
    ));

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/80 p-4 md:flex">
        <Link to="/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md">
            <Bot className="h-5 w-5 text-white" />
          </span>
          <span className="font-heading text-lg font-bold text-white tracking-tight">
            SkillJourney
          </span>
        </Link>

        <nav className="flex-1 space-y-1.5">{renderNavLinks()}</nav>

        <div className="mt-auto border-t border-slate-800/80 pt-4">
          <div className="flex items-center justify-between px-2">
            <Link to="/profile" className="flex items-center gap-3 overflow-hidden">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-xs font-semibold text-sky-300">
                {initials}
              </span>
              <div className="truncate">
                <p className="truncate text-sm font-medium text-slate-200">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur md:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-sky-500">
              <Bot className="h-4 w-4 text-white" />
            </span>
            <span className="font-heading text-base font-bold text-white">SkillJourney</span>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle className="mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-sky-500">
                  <Bot className="h-4 w-4 text-white" />
                </span>
                <span>SkillJourney</span>
              </SheetTitle>
              <nav className="space-y-1.5">{renderNavLinks(() => setMobileOpen(false))}</nav>
              <div className="mt-auto border-t border-slate-800 pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-red-500/30 text-red-300 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
