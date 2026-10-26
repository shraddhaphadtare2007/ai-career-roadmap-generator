import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  ClipboardList,
  FolderKanban,
  Gauge,
  LineChart,
  ListChecks,
  Loader2,
  Map,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import { toast } from "sonner";

const CAREERS = [
  {
    name: "AI/ML Engineer",
    tagline: "Build intelligent systems that learn from data",
    skills: ["Python", "Machine Learning", "Deep Learning"],
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    name: "Data Scientist",
    tagline: "Turn raw data into decisions and predictions",
    skills: ["Python", "Statistics", "SQL"],
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    name: "Data Analyst",
    tagline: "Find the story hiding in spreadsheets and dashboards",
    skills: ["SQL", "Excel", "Dashboards"],
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    name: "Generative AI Developer",
    tagline: "Ship apps powered by LLMs and generative models",
    skills: ["Python", "LLMs", "RAG"],
    gradient: "from-indigo-600 to-violet-700",
  },
  {
    name: "Software Developer",
    tagline: "Design and build the software people use every day",
    skills: ["JavaScript", "Java", "SQL"],
    gradient: "from-blue-500 to-slate-700",
  },
  {
    name: "UI/UX Designer",
    tagline: "Craft interfaces people love to use",
    skills: ["Figma", "Prototyping", "Research"],
    gradient: "from-amber-500 to-orange-600",
  },
  {
    name: "Cybersecurity Analyst",
    tagline: "Defend systems and data against real attackers",
    skills: ["Networking", "Linux", "Cryptography"],
    gradient: "from-rose-600 to-red-800",
  },
];

const DEMO_PERSONAS = [
  {
    key: "alex",
    name: "Alex",
    persona: "AI Enthusiast",
    detail: "Interested in AI + Machine Learning + Python",
  },
  {
    key: "priya",
    name: "Priya",
    persona: "Data & Analytics",
    detail: "Interested in Data + Statistics + SQL",
  },
  {
    key: "rohan",
    name: "Rohan",
    persona: "Visual Designer",
    detail: "Interested in Design + Figma",
  },
  {
    key: "sam",
    name: "Sam",
    persona: "Future Defender",
    detail: "Interested in Security + systems",
  },
];

const HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    title: "1. Take the assessment",
    text: "8 quick questions about your education, interests, skills, study time and goals.",
  },
  {
    icon: Target,
    title: "2. Get your match",
    text: "A rule-based engine scores 7 AI/tech careers and recommends the best fit with a match %.",
  },
  {
    icon: Map,
    title: "3. Follow your roadmap",
    text: "A 7-stage plan from Foundation to Job Preparation, with projects at every milestone.",
  },
  {
    icon: LineChart,
    title: "4. Track progress",
    text: "Tick off skills, courses and projects — everything is saved and your readiness grows.",
  },
];

const FEATURES = [
  {
    icon: Gauge,
    title: "Skill Gap Analysis",
    text: "See exactly where you stand today versus what employers expect — per skill, with progress bars.",
  },
  {
    icon: FolderKanban,
    title: "Projects",
    text: "Portfolio-worthy projects picked for your career and level, from beginner to capstone.",
  },
  {
    icon: BookOpen,
    title: "Courses",
    text: "Curated courses for every stage — free and paid, tagged by skill and duration.",
  },
  {
    icon: Briefcase,
    title: "Internship Preparation",
    text: "A 7-factor readiness checklist, sample opportunities and a live job-readiness score.",
  },
  {
    icon: ListChecks,
    title: "Progress Tracking",
    text: "Every tick is saved in the database. Log out, log back in — your progress is still there.",
  },
  {
    icon: Sparkles,
    title: "AI Career Advice",
    text: "Optional AI-generated explanations and personalized learning tips based on your answers.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const runDemo = async (key: string) => {
    setDemoLoading(key);
    try {
      await apiPost(`/demo/${key}`);
      await beginSession();
      toast.success("Demo student ready — roadmap calculated!");
      navigate("/results");
    } catch {
      toast.error("Could not start demo. Please try again.");
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md">
              <Bot className="h-5 w-5 text-white" />
            </span>
            <span className="font-heading text-lg font-bold text-white tracking-tight">
              AI Career Roadmap
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/demo">
              <Button variant="ghost" className="text-slate-300">
                Try Demo
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-slate-700">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-sky-500 hover:bg-sky-400">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-4xl space-y-6">
          <Badge variant="default" className="gap-1.5 px-3 py-1 text-sm bg-sky-500/10 text-sky-300 border-sky-500/20">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            Personalized Career Pathways for Tech & AI
          </Badge>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-tight">
            Discover your path. Learn the skills.{" "}
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Build your future.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Take a smart 8-question assessment to identify your best-fit tech career, pinpoint your skill gaps, and follow a personalized step-by-step roadmap to job readiness.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" className="gap-2 bg-sky-500 px-8 text-base hover:bg-sky-400">
                Start Free Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-200">
                Explore Demo Students
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Instant Demo Personas Bar */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            Or test drive instantly with sample personas:
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DEMO_PERSONAS.map((p) => (
              <button
                key={p.key}
                disabled={Boolean(demoLoading)}
                onClick={() => runDemo(p.key)}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-left transition-all hover:border-sky-500/50 hover:bg-slate-900"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{p.name}</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                      {p.persona}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 truncate">{p.detail}</p>
                </div>
                {demoLoading === p.key ? (
                  <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Careers */}
      <section className="px-4 py-20 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">7 Supported Career Paths</h2>
          <p className="mt-2 text-slate-400">
            Tailored algorithms match your profile with detailed career roadmaps.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAREERS.map((c) => (
            <Card key={c.name} className="border-slate-800/80 bg-slate-900/50 transition-all hover:border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${c.gradient}`} />
                <h3 className="font-heading text-xl font-bold text-white">{c.name}</h3>
                <p className="text-sm text-slate-400">{c.tagline}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {c.skills.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs text-slate-300 border-slate-800 bg-slate-950/40">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-slate-800/80 bg-slate-900/30 px-4 py-20 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <h2 className="font-heading text-3xl font-bold text-white">How SkillJourney Works</h2>
            <p className="mt-2 text-slate-400">From self-assessment to job readiness in 4 clear steps.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((h, idx) => (
              <div key={idx} className="relative rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <h.icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-lg font-semibold text-white">{h.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">Everything You Need to Succeed</h2>
          <p className="mt-2 text-slate-400">Complete suite of tools for career planning and learning execution.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, idx) => (
            <div key={idx} className="flex gap-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sky-400">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-slate-800 px-4 py-12 sm:px-6 text-center bg-slate-950">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="font-heading text-3xl font-bold text-white">Ready to Map Your Tech Career?</h2>
          <p className="text-slate-400">Join thousands of students and career switchers building their roadmaps.</p>
          <Link to="/register">
            <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-white px-8">
              Take the Free Assessment Now
            </Button>
          </Link>
          <p className="pt-8 text-xs text-slate-600">
            © {new Date().getFullYear()} AI Career Roadmap Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
