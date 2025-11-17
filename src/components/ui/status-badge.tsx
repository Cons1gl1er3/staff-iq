import { cn } from "@/lib/utils";

type Status = "connected" | "warning" | "error" | "pending";

const STYLES: Record<Status, string> = {
  connected: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  error: "bg-rose-50 text-rose-600",
  pending: "bg-slate-100 text-slate-600",
};

export function StatusBadge({
  status,
  label,
}: {
  status: Status;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        STYLES[status],
      )}
    >
      <span className="text-[10px]">●</span>
      {label}
    </span>
  );
}

