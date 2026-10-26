import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock,
  FolderKanban,
  Loader2,
  Lock,
  Map,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchDonut, ProgressBar } from "@/components/Progress";
import { apiGet } from "@/lib/api";
import type { DashboardData } from "@/lib/types";

const STAGE_STAT = {
  done: { icon: CheckCircle2, classes: "text-emerald-400" },
  in_progress: { icon: Clock, classes: "text-sky-400" },
  locked: { icon: Lock, classes: "text-slate-600" },
};

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => apiGet<DashboardData>("/dashboard"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="mx-auto max-w-xl border-slate-800 bg-slate-900/80">
        <CardContent className="flex flex-col items-center p-10 text-center space-y-4">
          <p className="text-slate-400">Dashboard could not load.</p>
          <Button onClick={() => refetch()} className="bg-sky-500 hover:bg-sky-400">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { user, career_result, roadmap } = data;
  const firstName = user.name.split(" ")[0];

  const statCards = [
    {
      label: "Skills Mastered",
      value: `${data.skills_completed}/${data.skills_total}`,
      icon: ClipboardList,
      link: "/skills",
    },
    {
      label: "Courses Completed",
      value: `${data.courses_completed}/${data.courses_total}`,
      icon: BookOpen,
      link: "/courses",
    },
    {
      label: "Projects Completed",
      value: `${data.projects_completed}/${data.projects_total}`,
      icon: FolderKanban,
      link: "/projects",
    },
    {
      label: "Job Readiness",
      value: `${data.job_readiness}%`,
      icon: Briefcase,
      link: "/internships",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {career_result ? (
              <>
                Target Career:{" "}
                <span className="font-semibold text-sky-300">
                  {career_result.recommended_career}
                </span>{" "}
                ({career_result.match_percentage}% match)
              </>
            ) : (
              "Take the assessment to unlock your personalized roadmap."
            )}
          </p>
        </div>

        <div className="flex gap-3">
          {career_result ? (
            <Link to="/roadmap">
              <Button className="gap-2 bg-sky-500 hover:bg-sky-400">
                <Map className="h-4 w-4" /> Continue Roadmap
              </Button>
            </Link>
          ) : (
            <Link to="/assessment">
              <Button className="gap-2 bg-sky-500 hover:bg-sky-400">
                <Sparkles className="h-4 w-4" /> Start Assessment
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} to={stat.link}>
              <Card className="border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700 hover:bg-slate-900">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                    <p className="font-heading text-2xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <span className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                    <Icon className="h-5 w-5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Active Stage & Next Step */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Next Step Action */}
        <Card className="border-slate-800 bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-900 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-sky-400" /> Current Milestone Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              {data.next_step ||
                "Your next recommended step will populate as you complete your current roadmap milestones."}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link to="/roadmap">
                <Button size="sm" className="gap-1.5 bg-sky-600 hover:bg-sky-500">
                  Jump into Roadmap <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="sm" variant="outline" className="border-slate-700">
                  Build Projects
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Readiness Donut Card */}
        <Card className="border-slate-800 bg-slate-900/60 flex flex-col items-center justify-center p-6 text-center">
          <MatchDonut
            percentage={data.job_readiness}
            size={140}
            label="Job Ready"
          />
          <h4 className="font-heading font-semibold text-white mt-4">Readiness Level</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
            Based on completed skills, projects, and interview checklist factors.
          </p>
        </Card>
      </div>

      {/* Roadmap Stages Snapshot */}
      {roadmap && roadmap.length > 0 && (
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-white">7-Stage Roadmap Progress</CardTitle>
            <Link to="/roadmap" className="text-xs text-sky-400 hover:underline">
              View details →
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {roadmap.map((s) => {
                const conf = STAGE_STAT[s.status] || STAGE_STAT.locked;
                const Icon = conf.icon;
                const doneCount = s.items.filter((it) => it.done).length;
                return (
                  <div
                    key={s.id}
                    className={`rounded-xl border p-4 space-y-2 ${
                      s.status === "in_progress"
                        ? "border-sky-500/50 bg-sky-950/20"
                        : "border-slate-800 bg-slate-950/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Stage {s.stage}</span>
                      <Icon className={`h-4 w-4 ${conf.classes}`} />
                    </div>
                    <h5 className="font-heading text-sm font-semibold text-white truncate">
                      {s.title}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {doneCount}/{s.items.length} Tasks
                    </p>
                    <ProgressBar value={doneCount} max={s.items.length} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
