import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Loader2,
  Map,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchDonut } from "@/components/Progress";
import { apiGet, apiStream } from "@/lib/api";
import { toast } from "sonner";
import type { CareerResult } from "@/lib/types";

export default function Results() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<{ result: CareerResult }>({
    queryKey: ["assessment-latest"],
    queryFn: () => apiGet<{ result: CareerResult }>("/assessment/latest"),
  });

  const [advice, setAdvice] = useState("");
  const [streaming, setStreaming] = useState(false);

  const generateAdvice = async () => {
    setStreaming(true);
    setAdvice("");
    try {
      await apiStream("/ai/advice", {}, (chunk) => setAdvice((a) => a + chunk));
      await queryClient.invalidateQueries({ queryKey: ["ai-advice"] });
    } catch {
      toast.error("AI advice unavailable. Your rule-based roadmap is ready!");
    } finally {
      setStreaming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  if (isError || !data?.result) {
    return (
      <Card className="mx-auto max-w-xl border-slate-800 bg-slate-900/80">
        <CardContent className="flex flex-col items-center p-10 text-center space-y-4">
          <Sparkles className="h-10 w-10 text-sky-400" />
          <h1 className="font-heading text-2xl font-bold text-white">No assessment yet</h1>
          <p className="text-slate-400 text-sm">
            Complete the 8-question assessment and your personalized career match will appear here.
          </p>
          <Link to="/assessment">
            <Button className="mt-4 bg-sky-500 hover:bg-sky-400">Take the Assessment</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const { result } = data;
  const alternatives = result.top_matches.filter((m) => m.career !== result.recommended_career);

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      {/* Primary Recommended Career Card */}
      <Card className="overflow-hidden border-slate-800 bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-900 shadow-2xl">
        <CardContent className="flex flex-col items-center gap-8 p-8 md:flex-row md:p-10">
          <MatchDonut
            percentage={result.match_percentage}
            size={170}
            label="Match"
          />
          <div className="flex-1 text-center md:text-left space-y-3">
            <Badge variant="secondary" className="bg-sky-500/15 text-sky-300">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Your Recommended Career
            </Badge>
            <h1 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
              {result.recommended_career}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Matched based on your skills, preferred problem solving, study time, and goals.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2 md:justify-start">
              <Link to="/roadmap">
                <Button className="gap-2 bg-sky-500 hover:bg-sky-400">
                  <Map className="h-4 w-4" /> View My Roadmap
                </Button>
              </Link>
              <Link to="/skills">
                <Button variant="outline" className="gap-2 border-slate-700 text-slate-200">
                  See Skill Gaps <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why This Career */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader>
          <CardTitle className="text-xl text-white">Why this career?</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {result.reasons.map((reason, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3.5 text-sm text-slate-300"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>{reason}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top 3 Career Matches */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader>
          <CardTitle className="text-xl text-white">Top Career Matches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {result.top_matches.map((m, idx) => (
              <div
                key={m.career}
                className={`rounded-xl border p-4 space-y-2 ${
                  m.career === result.recommended_career
                    ? "border-sky-500 bg-sky-500/10"
                    : "border-slate-800 bg-slate-950/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">#{idx + 1} Fit</span>
                  <span className="font-heading font-bold text-sky-400">{m.percentage}%</span>
                </div>
                <h4 className="font-heading font-bold text-white">{m.career}</h4>
                {m.tagline && <p className="text-xs text-slate-400">{m.tagline}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Breakdown */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-400">Skills You Already Have</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {result.skills_you_have.length > 0 ? (
              result.skills_you_have.map((s) => (
                <Badge key={s} variant="success" className="px-3 py-1">
                  {s}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400">You are starting fresh with foundational learning.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg text-sky-400">Key Skills to Learn</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {result.skills_to_learn.map((s) => (
              <Badge key={s} variant="default" className="px-3 py-1">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Career Advice Generator */}
      <Card className="border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-sky-400" /> AI Career Guidance
            </CardTitle>
            <p className="text-xs text-slate-400 mt-1">
              Get an on-demand AI assessment breakdown tailored to your learning style.
            </p>
          </div>
          <Button
            size="sm"
            onClick={generateAdvice}
            disabled={streaming}
            className="gap-2 bg-indigo-600 hover:bg-indigo-500"
          >
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {advice ? "Regenerate Advice" : "Generate Advice"}
          </Button>
        </CardHeader>
        {advice && (
          <CardContent>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap font-sans">
              {advice}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
