import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  delta?: {
    value: string;
    trend: "up" | "down";
  };
  icon?: ReactNode;
  className?: string;
};

export function MetricCard({
  label,
  value,
  delta,
  icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <p className="text-3xl font-semibold text-slate-900">{value}</p>
        {delta && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              delta.trend === "up"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600",
            )}
          >
            <span>{delta.trend === "up" ? "↑" : "↓"}</span>
            {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}

