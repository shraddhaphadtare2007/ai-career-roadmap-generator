import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bot, Loader2, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import { toast } from "sonner";

const PERSONAS = [
  {
    key: "alex",
    name: "Alex",
    persona: "AI Enthusiast",
    recommended: "AI/ML Engineer",
    detail: "Interested in AI + Machine Learning + Python. Enjoys coding and problem solving. Can study 2 hours a day.",
    skills: ["Python", "Machine Learning", "Mathematics"],
  },
  {
    key: "priya",
    name: "Priya",
    persona: "Data & Analytics",
    recommended: "Data Scientist",
    detail: "Interested in Data Science. Knows SQL, Statistics, Python and Mathematics. Loves analysis. Aiming for a job.",
    skills: ["SQL", "Statistics", "Python"],
  },
  {
    key: "rohan",
    name: "Rohan",
    persona: "Visual Designer",
    recommended: "UI/UX Designer",
    detail: "Interested in Design. Knows Figma and HTML/CSS. Loves designing. Dreams of freelancing.",
    skills: ["Figma/UI Design", "HTML/CSS"],
  },
  {
    key: "sam",
    name: "Sam",
    persona: "Future Defender",
    recommended: "Cybersecurity Analyst",
    detail: "Interested in Cybersecurity + Programming. Knows C/C++ and JavaScript. Enjoys problem solving. 3+ hours a day.",
    skills: ["C/C++", "JavaScript", "Problem solving"],
  },
];

export default function Demo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const runDemo = async (key: string) => {
    setLoading(key);
    try {
      await apiPost(`/demo/${key}`);
      await beginSession();
      toast.success("Demo student ready — their roadmap was just calculated by the engine!");
      navigate("/results");
    } catch {
      toast.error("Could not start demo. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md">
              <Bot className="h-5 w-5 text-white" />
            </span>
            <span className="font-heading text-lg font-bold text-white tracking-tight">
              SkillJourney
            </span>
          </Link>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="border-slate-700">Register</Button>
            </Link>
          </div>
        </div>

        <div className="text-center space-y-3">
          <Badge variant="default" className="bg-sky-500/10 text-sky-300 border-sky-500/20">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Instant Live Demo
          </Badge>
          <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
            Experience the Roadmap Engine
          </h1>
          <p className="mx-auto max-w-2xl text-slate-400">
            Select a student persona below. Our algorithm instantly scores their background, identifies skill gaps, and populates a full 7-stage learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PERSONAS.map((p) => (
            <Card
              key={p.key}
              className="border-slate-800 bg-slate-900/60 transition-all hover:border-sky-500/40 hover:bg-slate-900/90"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-white">{p.name}</h2>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {p.persona}
                      </Badge>
                    </div>
                    <span className="rounded-lg bg-sky-500/10 p-2 text-sky-400">
                      <UserCheck className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{p.detail}</p>
                  <div className="pt-2">
                    <span className="text-xs text-slate-400 font-medium">Expected Target: </span>
                    <span className="text-xs font-semibold text-sky-300">{p.recommended}</span>
                  </div>
                </div>

                <Button
                  onClick={() => runDemo(p.key)}
                  disabled={Boolean(loading)}
                  className="w-full justify-between bg-sky-600 hover:bg-sky-500"
                >
                  {loading === p.key ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Simulating Student Answers...
                    </span>
                  ) : (
                    <>
                      <span>Launch as {p.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
