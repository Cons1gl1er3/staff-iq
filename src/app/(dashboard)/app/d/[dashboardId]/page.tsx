import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";

const filters = ["All regions", "Travel nursing", "Past 90 days", "Bill vs pay"];

const keyTakeaways = [
  "Margin improved 6% in the last refresh due to higher bill rates in the Southeast region.",
  "Top leakage driver: cancelled shifts at Mercy General (-$18K impact).",
  "Recruiters in the Critical Care pod delivered 42% of total margin."
];

const metadata = [
  { label: "Dataset", value: "AHS_Margin_MVP" },
  { label: "Last refresh", value: "Today · 9:12 AM" },
  { label: "Gateway", value: "On-premises Gateway 01" },
  { label: "Owner", value: "Van Tran" },
];

export default function DashboardDetailPage({
  params,
}: {
  params: { dashboardId: string };
}) {
  const title = params.dashboardId === "pipeline" ? "Pipeline Efficiency" : "Margin Intelligence";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Power BI Embedded · Report
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            {title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <StatusBadge status="connected" label="Refresh healthy" />
          <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600">
            Share link
          </button>
          <button className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500">
            Export PDF
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 text-xs text-slate-400">
            <span>Embedded report</span>
            <span>Viewport 1280×720</span>
          </div>
          <div className="flex h-[520px] items-center justify-center bg-slate-950 text-slate-300">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-4xl">📊</span>
              <p className="text-base font-medium text-slate-100">
                Power BI iframe placeholder
              </p>
              <p className="max-w-sm text-sm text-slate-400">
                Embed token issued server-side. Replace with live `powerbi-client-react`
                component once service principal wiring and dataset provisioning are ready.
              </p>
            </div>
          </div>
        </section>

        <SectionCard
          title="Key takeaways"
          description="Narrative summary for operators and execs."
          className="bg-white"
        >
          <ul className="space-y-4 text-sm text-slate-600">
            {keyTakeaways.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 text-indigo-500">●</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">Dataset metadata</p>
            <dl className="mt-3 space-y-2">
              {metadata.map((entry) => (
                <div key={entry.label} className="flex justify-between gap-4">
                  <dt className="text-slate-400">{entry.label}</dt>
                  <dd className="font-medium text-slate-700">{entry.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent annotations"
        description="Comments and decisions captured for this dashboard."
        action={
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600">
            Add note
          </button>
        }
      >
        <div className="space-y-4">
          {[
            {
              author: "Sasha Nguyen",
              time: "1 hour ago",
              text: "Shift cancellations at Mercy General triggered compliance review. Assign to ops to renegotiate contracts.",
            },
            {
              author: "Priya Patel",
              time: "Yesterday · 4:36 PM",
              text: "Margin uplift correlated with new managed service agreements. Track in next exec standup.",
            },
          ].map((note) => (
            <div
              key={note.text}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-600">{note.author}</span>
                <span>{note.time}</span>
              </div>
              <p className="mt-2 leading-relaxed">{note.text}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

