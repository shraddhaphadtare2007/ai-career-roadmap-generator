import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  testid?: string;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({
  value,
  max = 100,
  testid,
  className = "",
  barClassName = "bg-sky-500",
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div
      data-testid={testid}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-slate-800", className)}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export interface MatchDonutProps {
  percentage: number;
  size?: number;
  stroke?: number;
  label?: string;
  testid?: string;
}

export function MatchDonut({
  percentage,
  size = 150,
  stroke = 12,
  label = "Match",
  testid,
}: MatchDonutProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const offset = circumference * (1 - clampedPct / 100);

  return (
    <div data-testid={testid} className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-sky-400 transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-heading text-2xl font-bold text-white">{clampedPct}%</span>
        {label && <span className="text-xs font-medium text-slate-400">{label}</span>}
      </div>
    </div>
  );
}

export interface DualBarProps {
  current: number;
  required: number;
  max?: number;
  className?: string;
}

export function DualBar({ current, required, max = 100, className }: DualBarProps) {
  const currentPct = Math.min(100, Math.max(0, Math.round((current / max) * 100)));
  const requiredPct = Math.min(100, Math.max(0, Math.round((required / max) * 100)));

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between text-xs text-slate-400">
        <span>Current: <strong className="text-sky-300">{currentPct}%</strong></span>
        <span>Target: <strong className="text-slate-200">{requiredPct}%</strong></span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="absolute h-full rounded-full bg-slate-700"
          style={{ width: `${requiredPct}%` }}
        />
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-500"
          style={{ width: `${currentPct}%` }}
        />
      </div>
    </div>
  );
}
