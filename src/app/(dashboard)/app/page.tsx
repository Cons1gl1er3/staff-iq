import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";

const kpiMetrics = [
  {
    label: "Yesterday",
    value: "$42.3K",
    delta: { value: "+8.2% vs LY", trend: "up" as const },
    icon: "📅",
  },
  {
    label: "This Week",
    value: "$287K",
    delta: { value: "+12.5% vs LY", trend: "up" as const },
    icon: "📊",
  },
  {
    label: "MTD",
    value: "$1.24M",
    delta: { value: "+5.8% vs LY", trend: "up" as const },
    icon: "💰",
  },
  {
    label: "GP MTD",
    value: "$342K",
    delta: { value: "+9.1% vs LY", trend: "up" as const },
    icon: "📈",
  },
];

const topClients = [
  { name: "Mercy General", revenue: "$245K", gp: "$68K", gpPercent: "27.8%" },
  { name: "Regional Medical", revenue: "$198K", gp: "$54K", gpPercent: "27.3%" },
  { name: "City Hospital", revenue: "$156K", gp: "$42K", gpPercent: "26.9%" },
  { name: "Community Health", revenue: "$134K", gp: "$35K", gpPercent: "26.1%" },
];

const topSpecialties = [
  { specialty: "Critical Care", revenue: "$312K", gp: "$89K" },
  { specialty: "Travel Nursing", revenue: "$278K", gp: "$76K" },
  { specialty: "Therapy", revenue: "$198K", gp: "$52K" },
  { specialty: "Allied", revenue: "$156K", gp: "$41K" },
];

const topMovers = [
  { name: "Mercy General", change: "+$28K", trend: "up" as const, type: "Client" },
  { name: "Sasha Nguyen", change: "+$12K", trend: "up" as const, type: "Recruiter" },
  { name: "City Hospital", change: "-$8K", trend: "down" as const, type: "Client" },
  { name: "Priya Patel", change: "+$9K", trend: "up" as const, type: "Recruiter" },
];

const riskFlags = [
  { title: "Expiring credentials", count: 11, severity: "medium" as const },
  { title: "Fall-off risk (30 days)", count: 3, severity: "high" as const },
  { name: "Low fill rate clients", count: 2, severity: "medium" as const },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Executive Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Key performance indicators and strategic insights at a glance.
        </p>
      </div>

      {/* KPI Band */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpiMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Revenue Forecast Trend */}
        <SectionCard
          title="Revenue Forecast"
          description="Actual vs goal with daily tracking points."
        >
          <div className="h-64 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-center text-slate-500">
              <p className="text-lg font-medium">Revenue Forecast Chart</p>
              <p className="text-sm mt-2">Line chart: Actual vs Goal by day</p>
              <p className="text-xs mt-1 text-slate-400">Power BI embedded chart placeholder</p>
            </div>
          </div>
        </SectionCard>

        {/* Top Movers & Risk Flags */}
        <div className="space-y-6">
          <SectionCard title="Top Movers" description="Clients and recruiters with significant changes.">
            <div className="space-y-3">
              {topMovers.map((mover) => (
                <div
                  key={mover.name}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{mover.name}</p>
                    <p className="text-xs text-slate-500">{mover.type}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      mover.trend === "up" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {mover.change}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Risk Flags" description="Items requiring attention.">
            <div className="space-y-3">
              {riskFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {flag.title || flag.name}
                  </p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      flag.severity === "high"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {flag.count}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Revenue & GP by Top Clients"
          description="Top performing clients by revenue and gross profit."
        >
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Revenue</th>
                  <th className="px-4 py-3 font-medium">GP</th>
                  <th className="px-4 py-3 font-medium">GP %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {topClients.map((client) => (
                  <tr key={client.name}>
                    <td className="px-4 py-3 font-medium text-slate-900">{client.name}</td>
                    <td className="px-4 py-3 text-slate-900">{client.revenue}</td>
                    <td className="px-4 py-3 text-slate-900">{client.gp}</td>
                    <td className="px-4 py-3 text-slate-600">{client.gpPercent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Revenue & GP by Specialty"
          description="Performance breakdown by clinical specialty."
        >
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Specialty</th>
                  <th className="px-4 py-3 font-medium">Revenue</th>
                  <th className="px-4 py-3 font-medium">GP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {topSpecialties.map((spec) => (
                  <tr key={spec.specialty}>
                    <td className="px-4 py-3 font-medium text-slate-900">{spec.specialty}</td>
                    <td className="px-4 py-3 text-slate-900">{spec.revenue}</td>
                    <td className="px-4 py-3 text-slate-900">{spec.gp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
