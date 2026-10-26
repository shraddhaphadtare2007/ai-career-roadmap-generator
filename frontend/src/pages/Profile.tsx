import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Bot, ClipboardList, LogOut, Sparkles, User, Mail, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api";
import { useMe } from "@/lib/auth";
import { endSession } from "@/lib/session";
import { toast } from "sonner";
import type { CareerResult } from "@/lib/types";

export default function Profile() {
  const navigate = useNavigate();
  const { data: user } = useMe();
  const { data: latest } = useQuery<{ result: CareerResult }>({
    queryKey: ["assessment-latest"],
    queryFn: () => apiGet<{ result: CareerResult }>("/assessment/latest"),
  });

  const handleLogout = async () => {
    await endSession();
    toast.success("Logged out — see you soon!");
    navigate("/", { replace: true });
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const result = latest?.result ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <h1 className="font-heading text-3xl font-bold text-white">Student Profile</h1>

      {/* Profile Card */}
      <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
        <CardContent className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 font-heading text-xl font-bold text-white shadow-lg">
            {initials}
          </span>
          <div className="flex-1 space-y-1">
            <h2 className="font-heading text-2xl font-bold text-white">{user.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> {user.email}
              </span>
              {user.education && (
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" /> {user.education}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-500/30 text-red-300 hover:bg-red-500/10 gap-2"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Target Career Info */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader>
          <CardTitle className="text-lg text-white">Career Profile & Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Target Track:</span>
                  <h3 className="font-heading text-xl font-bold text-sky-400">
                    {result.recommended_career}
                  </h3>
                </div>
                <Badge variant="default" className="text-sm">
                  {result.match_percentage}% Match
                </Badge>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400">Skills Identified:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {result.skills_you_have.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs border-emerald-500/30 text-emerald-300">
                      {s}
                    </Badge>
                  ))}
                  {result.skills_to_learn.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs border-sky-500/30 text-sky-300">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No assessment taken yet. Head over to the Assessment tab to discover your target career path.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
