import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";

const connectors = [
  {
    name: "Bullhorn",
    description: "ATS – jobs, placements, recruiters.",
    status: "connected" as const,
    lastSync: "9:05 AM · 18K rows",
    actions: ["Validate", "View mapping"],
  },
  {
    name: "HubSpot",
    description: "CRM – clients, contacts, activities.",
    status: "warning" as const,
    lastSync: "8:47 AM · stale 45 min",
    actions: ["Retry", "View logs"],
  },
  {
    name: "CSV Uploads",
    description: "Ad-hoc clinician credential imports.",
    status: "pending" as const,
    lastSync: "Waiting for first upload",
    actions: ["Upload sample"],
  },
];

const transformations = [
  {
    name: "dbt source freshness",
    schedule: "Every 30 minutes",
    status: "connected" as const,
    lastRun: "9:15 AM · success",
  },
  {
    name: "fact_margin incremental refresh",
    schedule: "Hourly · aligned to gateway",
    status: "connected" as const,
    lastRun: "9:12 AM · 12 partitions",
  },
  {
    name: "dim_candidate enrichment",
    schedule: "Daily at 6 AM",
    status: "warning" as const,
    lastRun: "Pending upstream HubSpot sync",
  },
];

export default function DataSourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Data Sources</h1>
        <p className="mt-2 text-sm text-slate-500">
          Configure ingest pipelines, credentials, and refresh cadence for your
          organization&apos;s analytics.
        </p>
      </div>

      <SectionCard
        title="Connected systems"
        description="Each data source lands in Supabase staging tables with organization-level isolation."
        action={
          <button className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500">
            Add data source
          </button>
        }
      >
        <div className="space-y-4">
          {connectors.map((connector) => (
            <div
              key={connector.name}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {connector.name}
                  </h2>
                  <StatusBadge status={connector.status} label={connector.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {connector.description}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Last sync: {connector.lastSync}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {connector.actions.map((action) => (
                  <button
                    key={action}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Transformations"
        description="Core dbt jobs powering the modeled star schema."
      >
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Schedule</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {transformations.map((row) => (
                <tr key={row.name}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.schedule}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} label={row.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.lastRun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="Gateway health"
        description="Monitor the Power BI On-premises Data Gateway hosting Supabase connections."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Current status",
              value: "Online",
              badge: <StatusBadge status="connected" label="Healthy" />,
            },
            {
              label: "Refresh queue",
              value: "0 pending",
              note: "Next at 10:15 AM",
            },
            {
              label: "Throughput (last 24h)",
              value: "142K rows",
              note: "Dataset: fact_shift, fact_margin",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm"
            >
              <p className="text-slate-500">{item.label}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {item.value}
              </p>
              {item.badge && <div className="mt-2">{item.badge}</div>}
              {item.note && (
                <p className="mt-2 text-xs text-slate-400">{item.note}</p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

