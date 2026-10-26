import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, CheckCircle2, Clock, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiGet, apiPost } from "@/lib/api";
import { toast } from "sonner";
import type { CareerResult, CoursesResponse } from "@/lib/types";

export default function Courses() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("mine");

  const { data, isLoading, isError } = useQuery<CoursesResponse>({
    queryKey: ["courses"],
    queryFn: () => apiGet<CoursesResponse>("/courses"),
  });

  const { data: latest } = useQuery<{ result: CareerResult }>({
    queryKey: ["assessment-latest"],
    queryFn: () => apiGet<{ result: CareerResult }>("/assessment/latest"),
  });

  const recommended = latest?.result?.recommended_career ?? null;

  const toggle = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      apiPost(`/courses/${id}/complete`, { completed }),
    onSuccess: (_d, vars) => {
      toast.success(
        vars.completed ? "Course marked complete — nice job!" : "Course marked uncompleted."
      );
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Could not save. Please try again."),
  });

  const courses = useMemo(() => {
    if (!data) return [];
    const mine = data.courses.filter(
      (c) => recommended && (c.career === recommended || c.career === "All")
    );
    const list = tab === "mine" && mine.length > 0 ? mine : data.courses;
    return [...list].sort((a, b) => {
      const aMine = a.career === recommended ? 0 : a.career === "All" ? 1 : 2;
      const bMine = b.career === recommended ? 0 : b.career === "All" ? 1 : 2;
      return aMine - bMine || a.title.localeCompare(b.title);
    });
  }, [data, tab, recommended]);

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
        <CardContent className="p-10 text-center">
          <p className="text-slate-400">Courses could not load.</p>
        </CardContent>
      </Card>
    );
  }

  const completed = new Set(data.completed_ids);

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Recommended Courses</h1>
          <p className="mt-1 text-sm text-slate-400">
            High-quality learning material curated for each stage and technical skill.
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="mine">For My Career</TabsTrigger>
            <TabsTrigger value="all">All Courses</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const isDone = completed.has(course.id);
          const isTargetCareer = course.career === recommended;

          return (
            <Card
              key={course.id}
              className={`border transition-all flex flex-col justify-between ${
                isDone
                  ? "border-emerald-500/30 bg-slate-900/60"
                  : isTargetCareer
                  ? "border-sky-500/40 bg-slate-900/80"
                  : "border-slate-800 bg-slate-900/40"
              }`}
            >
              <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {course.platform}
                    </Badge>
                    <div className="flex gap-1.5">
                      {course.free && (
                        <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-300">
                          Free
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                        {course.level}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-heading text-base font-semibold text-white leading-snug">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {course.duration}
                    </span>
                    <span>Career: <strong className="text-slate-300">{course.career}</strong></span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {course.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <Button
                    size="sm"
                    variant={isDone ? "outline" : "default"}
                    className={
                      isDone
                        ? "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                        : "bg-sky-600 hover:bg-sky-500 text-white"
                    }
                    onClick={() => toggle.mutate({ id: course.id, completed: !isDone })}
                    disabled={toggle.isPending}
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    {isDone ? "Completed ✓" : "Mark Complete"}
                  </Button>

                  <a
                    href={course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-sky-400 hover:underline"
                  >
                    Open Resource <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
