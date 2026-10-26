import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  FolderKanban,
  Loader2,
  Lock,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { apiGet, apiPatch, apiPost, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { RoadmapStep } from "@/lib/types";

export default function Roadmap() {
  const queryClient = useQueryClient();
  const { data: steps, isLoading, isError, refetch } = useQuery<RoadmapStep[]>({
    queryKey: ["roadmap"],
    queryFn: () => apiGet<RoadmapStep[]>("/roadmap"),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const toggleItem = useMutation({
    mutationFn: ({ stepId, label, done }: { stepId: string; label: string; done: boolean }) =>
      apiPatch(`/roadmap/steps/${stepId}/items`, { label, done }),
    onSuccess: invalidate,
    onError: (err) => {
      if (err instanceof ApiError && err.status === 400) {
        toast.error("This stage is still locked! Complete previous stages first.");
      } else {
        toast.error("Could not save progress. Please try again.");
      }
    },
  });

  const completeStep = useMutation({
    mutationFn: (stepId: string) => apiPost(`/roadmap/steps/${stepId}/complete`),
    onSuccess: () => {
      toast.success("Stage marked complete — next stage unlocked!");
      invalidate();
    },
    onError: () => toast.error("Could not complete stage. Please try again."),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="mx-auto max-w-xl border-slate-800 bg-slate-900/80">
        <CardContent className="p-10 text-center space-y-4">
          <p className="text-slate-400">Roadmap could not load.</p>
          <Button onClick={() => refetch()} className="bg-sky-500 hover:bg-sky-400">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <Card className="mx-auto max-w-xl border-slate-800 bg-slate-900/80">
        <CardContent className="flex flex-col items-center p-10 text-center space-y-4">
          <Map className="h-10 w-10 text-sky-400" />
          <h2 className="font-heading text-xl font-bold text-white">No Roadmap Generated Yet</h2>
          <p className="text-sm text-slate-400">
            Take the career assessment to generate your personalized step-by-step roadmap.
          </p>
          <Link to="/assessment">
            <Button className="mt-2 bg-sky-500 hover:bg-sky-400">Take Assessment</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Your 7-Stage Career Roadmap</h1>
        <p className="mt-1 text-sm text-slate-400">
          Work through each stage in order. Complete checklist tasks and build milestone projects to unlock each subsequent stage.
        </p>
      </div>

      <div className="relative space-y-6">
        {/* Continuous vertical timeline connector */}
        <div className="absolute left-[31px] top-6 bottom-6 hidden w-0.5 bg-slate-800 md:block" />

        {steps.map((step) => {
          const isDone = step.status === "done";
          const isInProgress = step.status === "in_progress";
          const isLocked = step.status === "locked";
          const allItemsDone = step.items.every((it) => it.done);

          return (
            <div key={step.id} className="relative flex flex-col gap-6 md:flex-row">
              {/* Timeline Stage Indicator */}
              <div className="hidden shrink-0 items-start pt-4 md:flex">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-sm font-bold shadow-md ${
                    isDone
                      ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                      : isInProgress
                      ? "border-sky-500 bg-sky-500/20 text-sky-300 ring-4 ring-sky-500/20"
                      : "border-slate-800 bg-slate-900 text-slate-600"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : isLocked ? (
                    <Lock className="h-6 w-6" />
                  ) : (
                    <span>S{step.stage}</span>
                  )}
                </span>
              </div>

              {/* Stage Card */}
              <Card
                className={`flex-1 border transition-all ${
                  isInProgress
                    ? "border-sky-500/40 bg-slate-900/90 shadow-xl"
                    : isDone
                    ? "border-emerald-500/30 bg-slate-900/60"
                    : "border-slate-800/60 bg-slate-950/40 opacity-75"
                }`}
              >
                <CardContent className="p-6 md:p-8 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-semibold text-slate-400 text-sm">
                        Stage {step.stage}:
                      </span>
                      <h2 className="font-heading text-xl font-bold text-white">{step.title}</h2>
                    </div>

                    <Badge
                      variant={isDone ? "success" : isInProgress ? "default" : "outline"}
                      className="text-xs"
                    >
                      {isDone ? "Completed" : isInProgress ? "In Progress" : "Locked"}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>

                  {/* Checklist Items */}
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Core Milestones & Checklist:
                    </h4>
                    <div className="space-y-2">
                      {step.items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                            item.done
                              ? "border-emerald-500/20 bg-emerald-950/10 text-slate-300"
                              : "border-slate-800 bg-slate-950/40 text-slate-300"
                          } ${isLocked ? "pointer-events-none opacity-60" : ""}`}
                        >
                          <Checkbox
                            checked={item.done}
                            disabled={isLocked || toggleItem.isPending}
                            onCheckedChange={(checked) =>
                              toggleItem.mutate({
                                stepId: step.id,
                                label: item.label,
                                done: Boolean(checked),
                              })
                            }
                            className="mt-0.5"
                          />
                          <span className={`text-sm ${item.done ? "line-through text-slate-400" : ""}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stage Recommended Project */}
                  {step.project && (
                    <div className="flex items-center gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 p-3.5 text-sm text-sky-200">
                      <FolderKanban className="h-5 w-5 shrink-0 text-sky-400" />
                      <div>
                        <span className="font-semibold text-sky-300">Milestone Project: </span>
                        <span>{step.project}</span>
                      </div>
                    </div>
                  )}

                  {/* Stage completion trigger */}
                  {isInProgress && (
                    <div className="flex justify-end pt-4 border-t border-slate-800">
                      <Button
                        onClick={() => completeStep.mutate(step.id)}
                        disabled={completeStep.isPending}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        {completeStep.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Complete Stage {step.stage} & Unlock Next
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
