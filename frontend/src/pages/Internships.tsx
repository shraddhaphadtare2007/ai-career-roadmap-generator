import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, CheckCircle2, Loader2, MapPin, Building, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MatchDonut } from "@/components/Progress";
import { apiGet, apiPost } from "@/lib/api";
import { toast } from "sonner";
import type { ReadinessResponse } from "@/lib/types";

export default function Internships() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ReadinessResponse>({
    queryKey: ["readiness"],
    queryFn: () => apiGet<ReadinessResponse>("/readiness"),
  });

  const toggle = useMutation({
    mutationFn: ({ key, done }: { key: string; done: boolean }) =>
      apiPost(`/readiness/${key}/toggle`, { done }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readiness"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Could not save. Please try again."),
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
        <CardContent className="p-10 text-center">
          <p className="text-slate-400">Readiness data could not load.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Internship & Job Preparation
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Complete the readiness checklist to boost your job score, and explore target roles.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Readiness Checklist & Donut */}
        <Card className="border-slate-800 bg-slate-900/60 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-white">Job Readiness Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <MatchDonut
                percentage={data.percentage}
                size={160}
                label="Job Readiness"
              />
            </div>

            <ul className="space-y-2.5">
              {data.items.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center gap-3 rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-2.5"
                >
                  <Checkbox
                    checked={item.done}
                    onCheckedChange={(v) =>
                      toggle.mutate({ key: item.key, done: Boolean(v) })
                    }
                    disabled={toggle.isPending}
                  />
                  <span
                    className={`text-sm ${
                      item.done ? "text-emerald-300 font-medium" : "text-slate-300"
                    }`}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Sample Opportunities */}
        <Card className="border-slate-800 bg-slate-900/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white">Sample Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-300">
              Sample opportunities for roadmap planning & skill targeting.
            </div>

            <div className="space-y-3.5">
              {data.opportunities.map((o) => (
                <div
                  key={o.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800/70 bg-slate-950/40 p-5 transition-colors hover:border-slate-700"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-base font-bold text-white">
                          {o.role}
                        </span>
                        <Badge variant="secondary" className="bg-sky-500/15 text-sky-300 text-xs">
                          {o.type}
                        </Badge>
                      </div>
                      {o.stipend && (
                        <span className="text-xs font-semibold text-emerald-400">
                          {o.stipend}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" /> {o.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {o.location}
                      </span>
                      <span>Target: <strong className="text-slate-300">{o.career}</strong></span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {o.requirements.map((req) => (
                        <span
                          key={req}
                          className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 border border-slate-700/60"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
