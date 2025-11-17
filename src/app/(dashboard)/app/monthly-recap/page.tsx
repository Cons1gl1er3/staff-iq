import { SectionCard } from "@/components/ui/section-card";

const narrativeBullets = [
  "Revenue came in at $1.24M, −3.2% vs Sep-24, +5.8% vs T12 avg",
  "Gross profit reached $342K (27.6% margin), +9.1% vs same period LY",
  "Placements totaled 178 units, +8.2% vs Sep-24, +12.5% vs T12 avg",
  "Average bill rate increased to $68/hr (+2.1% vs prior month)",
  "New candidates added: 1247, with 892 qualified leads",
  "Time-to-fill improved to 12.3 days (−1.2 days vs prior month)",
];

const kpiGrid = [
  { label: "Revenue", value: "$1.24M", vsLY: "+5.8%", vsT12: "+3.2%" },
  { label: "Payments", value: "$1.05M", vsLY: "+7.3%", vsT12: "+4.1%" },
  { label: "Units", value: "178", vsLY: "+12.5%", vsT12: "+8.2%" },
  { label: "GP", value: "$342K", vsLY: "+9.1%", vsT12: "+5.4%" },
  { label: "ASP", value: "$68/hr", vsLY: "+2.1%", vsT12: "+1.8%" },
  { label: "New Candidates", value: "1,247", vsLY: "+15.2%", vsT12: "+8.7%" },
  { label: "Opportunities", value: "234", vsLY: "+8.9%", vsT12: "+5.3%" },
];

export default function MonthlyRecapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Monthly Recap</h1>
        <p className="mt-2 text-sm text-slate-500">
          Narrative summary and key performance indicators for the current period.
        </p>
      </div>

      {/* Context Pickers */}
      <div className="flex flex-wrap gap-3">
        <button className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600">
          Same Period LY
        </button>
        <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">
          T12 Baseline
        </button>
        <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">
          Prior Month
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Narrative Summary */}
        <SectionCard
          title="Executive Summary"
          description="Auto-generated narrative bullets highlighting key metrics and trends."
        >
          <ul className="space-y-3">
            {narrativeBullets.map((bullet, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-1 text-indigo-500">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Quick Stats */}
        <SectionCard title="Period Overview">
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">Current Period</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">October 2024</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">Comparison</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                vs Same Period Last Year
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* KPI Grid */}
      <SectionCard
        title="Key Performance Indicators"
        description="Revenue, payments, units, GP, ASP, new candidates, and opportunities."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiGrid.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
              <div className="mt-3 flex gap-4 text-xs">
                <div>
                  <p className="text-slate-400">vs LY</p>
                  <p className="mt-1 font-medium text-emerald-600">{kpi.vsLY}</p>
                </div>
                <div>
                  <p className="text-slate-400">vs T12</p>
                  <p className="mt-1 font-medium text-indigo-600">{kpi.vsT12}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

