import { SectionCard } from "@/components/ui/section-card";

const clientPerformance = [
  {
    name: "Mercy General",
    revenue: "$245K",
    gpPercent: "27.8%",
    fillRate: "94.2%",
    ttf: "10.3 days",
    cancelRate: "2.1%",
    status: "excellent" as const,
  },
  {
    name: "Regional Medical",
    revenue: "$198K",
    gpPercent: "27.3%",
    fillRate: "91.5%",
    ttf: "11.2 days",
    cancelRate: "3.2%",
    status: "excellent" as const,
  },
  {
    name: "City Hospital",
    revenue: "$156K",
    gpPercent: "26.9%",
    fillRate: "68.3%",
    ttf: "18.7 days",
    cancelRate: "8.4%",
    status: "needs_attention" as const,
  },
  {
    name: "Community Health",
    revenue: "$134K",
    gpPercent: "26.1%",
    fillRate: "72.1%",
    ttf: "15.4 days",
    cancelRate: "5.8%",
    status: "needs_attention" as const,
  },
  {
    name: "Metro Health",
    revenue: "$98K",
    gpPercent: "24.2%",
    fillRate: "58.9%",
    ttf: "22.1 days",
    cancelRate: "12.3%",
    status: "critical" as const,
  },
];

const fixList = [
  {
    client: "Metro Health",
    issue: "Below margin floor (24.2% < 25%)",
    action: "Review contract terms",
  },
  {
    client: "City Hospital",
    issue: "SLA violation: TTF > 15 days",
    action: "Escalate to account manager",
  },
  {
    client: "Metro Health",
    issue: "High cancellation rate (12.3%)",
    action: "Review scheduling process",
  },
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Clients</h1>
        <p className="mt-2 text-sm text-slate-500">
          Client performance metrics and actionable insights.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Client Performance Table */}
        <SectionCard
          title="Client Performance"
          description="Revenue, GP%, fill rate, time-to-fill, and cancellation metrics."
        >
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Revenue</th>
                  <th className="px-4 py-3 font-medium">GP %</th>
                  <th className="px-4 py-3 font-medium">Fill Rate</th>
                  <th className="px-4 py-3 font-medium">TTF</th>
                  <th className="px-4 py-3 font-medium">Cancel %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {clientPerformance.map((client) => {
                  const rowColor =
                    client.status === "excellent"
                      ? "bg-emerald-50"
                      : client.status === "needs_attention"
                        ? "bg-amber-50"
                        : "bg-red-50";
                  return (
                    <tr key={client.name} className={rowColor}>
                      <td className="px-4 py-3 font-medium text-slate-900">{client.name}</td>
                      <td className="px-4 py-3 text-slate-900">{client.revenue}</td>
                      <td className="px-4 py-3 text-slate-900">{client.gpPercent}</td>
                      <td className="px-4 py-3 text-slate-900">{client.fillRate}</td>
                      <td className="px-4 py-3 text-slate-600">{client.ttf}</td>
                      <td className="px-4 py-3 text-slate-900">{client.cancelRate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Fix List */}
        <SectionCard
          title="Fix List"
          description="Clients below margin floor or SLA thresholds requiring action."
        >
          <div className="space-y-3">
            {fixList.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">{item.client}</p>
                <p className="mt-1 text-xs text-slate-600">{item.issue}</p>
                <p className="mt-2 text-xs font-medium text-indigo-600">{item.action}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Revenue/GP by Client Chart */}
      <SectionCard
        title="Revenue & GP by Client"
        description="Sortable visualization of client performance."
      >
        <div className="h-80 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
          <div className="text-center">
            <p className="text-lg font-medium">Revenue & GP Chart</p>
            <p className="text-sm mt-2">Bar chart: Sortable by revenue or GP</p>
            <p className="text-xs mt-1 text-slate-400">Power BI embedded chart placeholder</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

