 "use client";

import { useEffect, useState } from "react";
import { SectionCard } from "@/components/ui/section-card";

type GoalsState = {
  revenueYTD: number;
  unitsYTD: number;
  gpYTD: number;
  revenueQTD: number;
  unitsQTD: number;
  gpQTD: number;
  revenueMTD: number;
  unitsMTD: number;
  gpMTD: number;
};

const defaultGoals: GoalsState = {
  revenueYTD: 1500000,
  unitsYTD: 1500,
  gpYTD: 420000,
  revenueQTD: 500000,
  unitsQTD: 375,
  gpQTD: 140000,
  revenueMTD: 300000,
  unitsMTD: 120,
  gpMTD: 80000,
};

const currentActuals: GoalsState = {
  revenueYTD: 1240000,
  unitsYTD: 1247,
  gpYTD: 342000,
  revenueQTD: 420000,
  unitsQTD: 312,
  gpQTD: 118000,
  revenueMTD: 1240000,
  unitsMTD: 124,
  gpMTD: 76000,
};

const underPerformers = [
  { name: "City Hospital", metric: "Revenue", gap: "-$8K", percentage: "87%" },
  { name: "Ethan Lee", metric: "Placements", gap: "-3", percentage: "82%" },
  { name: "Community Health", metric: "Fill Rate", gap: "-12%", percentage: "68%" },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalsState>(defaultGoals);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/goals");
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.goals) {
          setGoals((prev) => ({ ...prev, ...data.goals }));
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleChange =
    (field: keyof GoalsState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value.replace(/[^0-9.]/g, ""));
      setGoals((prev) => ({ ...prev, [field]: isNaN(value) ? 0 : value }));
    };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goals),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save goals");
        setSaving(false);
        return;
      }

      setSuccess(true);
      setSaving(false);
    } catch {
      setError("Unexpected error while saving goals");
      setSaving(false);
    }
  };

  const goalGauges = [
    {
      label: "Revenue YTD",
      current: currentActuals.revenueYTD,
      target: goals.revenueYTD,
      period: "YTD",
    },
    {
      label: "Units YTD",
      current: currentActuals.unitsYTD,
      target: goals.unitsYTD,
      period: "YTD",
    },
    {
      label: "GP YTD",
      current: currentActuals.gpYTD,
      target: goals.gpYTD,
      period: "YTD",
    },
    {
      label: "Revenue QTD",
      current: currentActuals.revenueQTD,
      target: goals.revenueQTD,
      period: "QTD",
    },
    {
      label: "Units QTD",
      current: currentActuals.unitsQTD,
      target: goals.unitsQTD,
      period: "QTD",
    },
    {
      label: "Revenue MTD",
      current: currentActuals.revenueMTD,
      target: goals.revenueMTD,
      period: "MTD",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Goals</h1>
        <p className="mt-2 text-sm text-slate-500">
          Track progress against revenue, units, and gross profit targets.
        </p>
      </div>

      {/* Goals editor */}
      <SectionCard
        title="Set targets"
        description="Define your revenue, units, and GP targets. These will be used to calculate % to goal."
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save goals"}
          </button>
        }
      >
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Goals saved successfully.
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">YTD Targets</p>
            <label className="block text-xs text-slate-500">
              Revenue YTD
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none ring-indigo-200 transition focus:ring-2"
                value={goals.revenueYTD}
                onChange={handleChange("revenueYTD")}
              />
            </label>
            <label className="mt-2 block text-xs text-slate-500">
              Units YTD
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none ring-indigo-200 transition focus:ring-2"
                value={goals.unitsYTD}
                onChange={handleChange("unitsYTD")}
              />
            </label>
            <label className="mt-2 block text-xs text-slate-500">
              GP YTD
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none ring-indigo-200 transition focus:ring-2"
                value={goals.gpYTD}
                onChange={handleChange("gpYTD")}
              />
            </label>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">QTD Targets</p>
            <label className="block text-xs text-slate-500">
              Revenue QTD
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none ring-indigo-200 transition focus:ring-2"
                value={goals.revenueQTD}
                onChange={handleChange("revenueQTD")}
              />
            </label>
            <label className="mt-2 block text-xs text-slate-500">
              Units QTD
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none ring-indigo-200 transition focus:ring-2"
                value={goals.unitsQTD}
                onChange={handleChange("unitsQTD")}
              />
            </label>
            <label className="mt-2 block text-xs text-slate-500">
              GP QTD
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none ring-indigo-200 transition focus:ring-2"
                value={goals.gpQTD}
                onChange={handleChange("gpQTD")}
              />
            </label>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">MTD Targets</p>
            <label className="block text-xs text-slate-500">
              Revenue MTD
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none ring-indigo-200 transition focus:ring-2"
                value={goals.revenueMTD}
                onChange={handleChange("revenueMTD")}
              />
            </label>
            <label className="mt-2 block text-xs text-slate-500">
              Units MTD
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none ring-indigo-200 transition focus:ring-2"
                value={goals.unitsMTD}
                onChange={handleChange("unitsMTD")}
              />
            </label>
            <label className="mt-2 block text-xs text-slate-500">
              GP MTD
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none ring-indigo-200 transition focus:ring-2"
                value={goals.gpMTD}
                onChange={handleChange("gpMTD")}
              />
            </label>
          </div>
        </div>
      </SectionCard>

      {/* Goal Gauges */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {goalGauges.map((goal) => {
          const percentage =
            goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 999) : 0;
          const isOnTrack = percentage >= 90;
          return (
            <div
              key={`${goal.label}-${goal.period}`}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{goal.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{goal.period}</p>
                </div>
                <span
                  className={`text-2xl font-semibold ${
                    isOnTrack ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    ${(goal.current / 1000).toFixed(0)}K / ${(goal.target / 1000).toFixed(0)}K
                  </span>
                  <span className="text-slate-500">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full ${
                      isOnTrack ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Revenue vs Goal Trend */}
        <SectionCard
          title="Revenue vs Goal by Month"
          description="Monthly performance with cumulative trend line."
        >
          <div className="h-64 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-center text-slate-500">
              <p className="text-lg font-medium">Revenue vs Goal Chart</p>
              <p className="text-sm mt-2">Column chart: Monthly revenue vs goal</p>
              <p className="text-sm mt-1">Line overlay: Cumulative trend</p>
              <p className="text-xs mt-1 text-slate-400">Power BI embedded chart placeholder</p>
            </div>
          </div>
        </SectionCard>

        {/* Under Performers */}
        <SectionCard
          title="Under Performers"
          description="Clients and recruiters below target thresholds."
        >
          <div className="space-y-3">
            {underPerformers.map((performer) => (
              <div
                key={performer.name}
                className="rounded-lg border border-amber-200 bg-amber-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{performer.name}</p>
                    <p className="text-xs text-slate-500">{performer.metric}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">{performer.gap}</p>
                    <p className="text-xs text-slate-500">{performer.percentage} of goal</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Breakdowns */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Goals by Client"
          description="Revenue and placement targets by client."
        >
          <div className="h-64 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
            <p>Client goals breakdown chart</p>
          </div>
        </SectionCard>

        <SectionCard
          title="Goals by Recruiter"
          description="Individual recruiter performance vs targets."
        >
          <div className="h-64 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
            <p>Recruiter goals breakdown chart</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

