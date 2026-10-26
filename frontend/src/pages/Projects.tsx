import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, FolderKanban, Loader2, PlayCircle, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiGet, apiPost } from "@/lib/api";
import { toast } from "sonner";
import type { CareerResult, ProjectsResponse, Project } from "@/lib/types";

const DIFFICULTY_STYLE = {
  Beginner: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  Intermediate: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  Advanced: "bg-rose-500/15 text-rose-300 border-rose-500/20",
};

const STATUS_LABEL = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

export default function Projects() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: () => apiGet<ProjectsResponse>("/projects"),
  });

  const { data: latest } = useQuery<{ result: CareerResult }>({
    queryKey: ["assessment-latest"],
    queryFn: () => apiGet<{ result: CareerResult }>("/assessment/latest"),
  });

  const recommended = latest?.result?.recommended_career ?? null;

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Project["status"] }) =>
      apiPost(`/projects/${id}/status`, { status }),
    onSuccess: (_d, vars) => {
      if (vars.status === "completed") {
        toast.success("Project completed — great portfolio piece!");
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["readiness"] });
    },
    onError: () => toast.error("Could not save. Please try again."),
  });

  const projects = useMemo(() => {
    if (!data) return [];
    return [...data.projects].sort((a, b) => {
      const aMine = a.career === recommended ? 0 : a.career === "All" ? 1 : 2;
      const bMine = b.career === recommended ? 0 : b.career === "All" ? 1 : 2;
      return aMine - bMine || a.title.localeCompare(b.title);
    });
  }, [data, recommended]);

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
          <p className="text-slate-400">Projects could not load.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Portfolio Projects</h1>
        <p className="mt-1 text-sm text-slate-400">
          Real-world applications to prove your skills and showcase on GitHub and resume.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((proj) => {
          const isTarget = proj.career === recommended;
          const isDone = proj.status === "completed";
          const inProgress = proj.status === "in_progress";

          return (
            <Card
              key={proj.id}
              className={`border transition-all flex flex-col justify-between ${
                isDone
                  ? "border-emerald-500/30 bg-slate-900/60"
                  : inProgress
                  ? "border-sky-500/40 bg-slate-900/80"
                  : "border-slate-800 bg-slate-900/40"
              }`}
            >
              <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs border ${DIFFICULTY_STYLE[proj.difficulty]}`}
                    >
                      {proj.difficulty}
                    </Badge>
                    <Badge
                      variant={isDone ? "success" : inProgress ? "default" : "outline"}
                      className="text-xs"
                    >
                      {STATUS_LABEL[proj.status]}
                    </Badge>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white">{proj.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{proj.description}</p>

                  <div className="text-xs text-slate-400">
                    Target: <strong className="text-slate-200">{proj.career}</strong>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.tech_stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                  {proj.status === "not_started" && (
                    <Button
                      size="sm"
                      className="w-full gap-1.5 bg-sky-600 hover:bg-sky-500 text-white"
                      onClick={() => setStatus.mutate({ id: proj.id, status: "in_progress" })}
                      disabled={setStatus.isPending}
                    >
                      <PlayCircle className="h-4 w-4" /> Start Project
                    </Button>
                  )}

                  {proj.status === "in_progress" && (
                    <>
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                        onClick={() => setStatus.mutate({ id: proj.id, status: "completed" })}
                        disabled={setStatus.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 text-slate-400"
                        onClick={() => setStatus.mutate({ id: proj.id, status: "not_started" })}
                        disabled={setStatus.isPending}
                      >
                        Reset
                      </Button>
                    </>
                  )}

                  {proj.status === "completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-1.5 border-emerald-500/40 text-emerald-300 hover:bg-slate-800"
                      onClick={() => setStatus.mutate({ id: proj.id, status: "in_progress" })}
                      disabled={setStatus.isPending}
                    >
                      <Undo2 className="h-4 w-4" /> Mark in Progress
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
