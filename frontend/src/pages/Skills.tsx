import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, Gauge, Loader2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DualBar } from "@/components/Progress";
import { apiGet, ApiError } from "@/lib/api";
import type { SkillsGapResponse } from "@/lib/types";

export default function Skills() {
  const { data, isLoading, isError, error, refetch } = useQuery<SkillsGapResponse>({
    queryKey: ["skills-gap"],
    queryFn: () => apiGet<SkillsGapResponse>("/skills/gap"),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  if (isError || !data) {
    const empty = error instanceof ApiError && error.status === 404;
    return (
      <Card className="mx-auto max-w-xl border-slate-800 bg-slate-900/80">
        <CardContent className="flex flex-col items-center p-10 text-center space-y-4">
          <Gauge className="h-10 w-10 text-sky-400" />
          <h1 className="font-heading text-2xl font-bold text-white">
            {empty ? "No skill gap analysis yet" : "Could not load your skills"}
          </h1>
          <p className="text-sm text-slate-400">
            {empty
              ? "Complete the assessment and your skill gap matrix will appear here."
              : "Something went wrong. Please try again."}
          </p>
          {empty ? (
            <Link to="/assessment">
              <Button className="mt-2 bg-sky-500 hover:bg-sky-400">Take Assessment</Button>
            </Link>
          ) : (
            <Button onClick={() => refetch()} className="mt-2 bg-sky-500 hover:bg-sky-400">
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Skill Gap Analysis</h1>
        <p className="mt-1 text-sm text-slate-400">
          Your estimated proficiency vs the baseline required for a junior{" "}
          <span className="font-semibold text-sky-300">{data.career}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {data.skills.map((s) => {
          const gap = s.required - s.current;
          const statusVariant =
            s.status === "Proficient"
              ? "success"
              : s.status === "In Progress"
              ? "default"
              : "secondary";

          return (
            <Card
              key={s.skill}
              className="border-slate-800 bg-slate-900/60 transition-all hover:border-sky-500/30 hover:bg-slate-900/80"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base text-white">{s.skill}</CardTitle>
                  <p className="text-xs text-slate-400">{s.category}</p>
                </div>
                <Badge variant={statusVariant} className="text-xs">
                  {s.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <DualBar current={s.current} required={s.required} />

                <div className="flex items-center justify-between pt-1 text-xs text-slate-400 border-t border-slate-800/80">
                  <span>
                    Gap to close:{" "}
                    <strong className={gap > 0 ? "text-amber-400" : "text-emerald-400"}>
                      {gap > 0 ? `+${gap}%` : "Goal Achieved"}
                    </strong>
                  </span>
                  <Link
                    to="/courses"
                    className="flex items-center gap-1 text-sky-400 hover:underline"
                  >
                    <BookOpen className="h-3 w-3" /> Find Courses
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
