import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";

const auditEvents = [
  {
    actor: "Tony Tran",
    role: "Owner",
    action: "Issued embed token",
    target: "Margin Intelligence",
    context: "Service principal: staff-iq-sp",
    time: "Today · 9:14 AM",
    status: "connected" as const,
  },
  {
    actor: "Sasha Nguyen",
    role: "Admin",
    action: "Validated data source",
    target: "Bullhorn connection",
    context: "Rows synced: 18,402",
    time: "Today · 8:52 AM",
    status: "connected" as const,
  },
  {
    actor: "Priya Patel",
    role: "Member",
    action: "Invited user",
    target: "ethan@northwindstaffing.com",
    context: "Role: Viewer",
    time: "Yesterday · 4:28 PM",
    status: "pending" as const,
  },
  {
    actor: "System",
    role: "Automation",
    action: "Gateway health alert",
    target: "On-premises Gateway 01",
    context: "Latency spike 4.2s → resolved",
    time: "Yesterday · 3:57 PM",
    status: "warning" as const,
  },
];

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Audit Log</h1>
        <p className="mt-2 text-sm text-slate-500">
          Track sensitive actions across datasets, embeds, and organization
          configuration. Export logs to your SIEM in a later phase.
        </p>
      </div>

      <SectionCard
        title="Filters"
        description="Scope audit events by time range, actor, or resource."
      >
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
          {["Last 24 hours", "All actors", "All actions", "All resources"].map(
            (filter) => (
              <button
                key={filter}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-indigo-200 hover:text-indigo-600"
              >
                {filter}
              </button>
            ),
          )}
          <button className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-indigo-600">
            Save view
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Recent activity"
        description="Each event is tenant-isolated and stored in Supabase with RLS."
        action={
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600">
            Export JSON
          </button>
        }
      >
        <div className="space-y-4">
          {auditEvents.map((event) => (
            <div
              key={`${event.actor}-${event.time}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {event.actor}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {event.role}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    {event.action} · <span className="font-medium text-slate-900">{event.target}</span>
                  </p>
                </div>
                <div className="text-xs text-slate-400">{event.time}</div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <p>{event.context}</p>
                <StatusBadge status={event.status} label={event.status} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Integrations"
        description="Planned exports for SIEM, Slack alerts, and webhook delivery."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Slack",
              value: "Incident channel · planned",
              status: "pending" as const,
            },
            {
              label: "Vanta",
              value: "Compliance sync · future roadmap",
              status: "pending" as const,
            },
            {
              label: "Webhooks",
              value: "Custom POST endpoints",
              status: "warning" as const,
            },
          ].map((integration) => (
            <div
              key={integration.label}
              className="rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm"
            >
              <p className="text-slate-400">{integration.label}</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {integration.value}
              </p>
              <div className="mt-3">
                <StatusBadge
                  status={integration.status}
                  label={integration.status}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

