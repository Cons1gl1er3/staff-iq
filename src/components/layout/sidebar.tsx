"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  section?: "main" | "admin";
};

const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Home", icon: "🏠" },
  { href: "/app/talent-flow", label: "Talent Flow", icon: "👥" },
  { href: "/app/kpi-center", label: "KPI Center", icon: "📊" },
  { href: "/app/goals", label: "Goals", icon: "🎯" },
  { href: "/app/clients", label: "Clients", icon: "🏢" },
  { href: "/app/marketing", label: "Marketing", icon: "📈" },
  { href: "/app/monthly-recap", label: "Monthly Recap", icon: "📅" },
  { href: "/app/benchmarks", label: "Benchmarks", icon: "📉" },
  { href: "/app/market-map", label: "Market Map", icon: "🗺️" },
  { href: "/app/settings", label: "Settings", icon: "⚙️", section: "admin" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white px-5 py-6">
      <div className="mb-8">
        <Link href="/app" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-semibold">
            IQ
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Staff IQ</p>
            <p className="text-xs text-slate-500">Analytics Control Center</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 text-sm font-medium text-slate-600">
        <div className="space-y-1">
          {NAV_ITEMS.filter((item) => item.section !== "admin").map((item) => (
            <SidebarLink key={item.href} item={item} activePath={pathname} />
          ))}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Admin
          </p>
          <div className="space-y-1">
            {NAV_ITEMS.filter((item) => item.section === "admin").map((item) => (
              <SidebarLink key={item.href} item={item} activePath={pathname} />
            ))}
          </div>
        </div>
      </nav>

    </aside>
  );
}

function SidebarLink({
  item,
  activePath,
}: {
  item: NavItem;
  activePath: string | null;
}) {
  const isActive = activePath === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
        isActive
          ? "bg-indigo-50 text-indigo-600"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      <span className="text-lg">{item.icon}</span>
      {item.label}
    </Link>
  );
}

