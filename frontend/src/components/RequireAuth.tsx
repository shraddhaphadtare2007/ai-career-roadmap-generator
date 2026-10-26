import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useMe } from "@/lib/auth";

export default function RequireAuth() {
  const { data, isLoading, isError } = useMe();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        data-testid="auth-loading"
        className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-950 text-slate-400"
      >
        <Loader2 className="h-7 w-7 animate-spin text-sky-400" />
        <p className="text-sm">Checking your session…</p>
      </div>
    );
  }

  if (isError || !data) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
