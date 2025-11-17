"use client";

import { useState } from "react";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";

const members = [
  { name: "Tony Tran", email: "tony@staffiq.com", role: "Owner", status: "Active" },
  { name: "Sasha Nguyen", email: "sasha@advancedhospitalstaffing.com", role: "Admin", status: "Active" },
  { name: "Priya Patel", email: "priya@advancedhospitalstaffing.com", role: "Member", status: "Active" },
  { name: "Ethan Lee", email: "ethan@advancedhospitalstaffing.com", role: "Viewer", status: "Invited" },
];

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
    target: "ethan@advancedhospitalstaffing.com",
    context: "Role: Viewer",
    time: "Yesterday · 4:28 PM",
    status: "pending" as const,
  },
];

const auditHighlights = [
  { label: "Last login", value: "Today · 8:57 AM" },
  { label: "Power BI embeds", value: "16 issued this week" },
  { label: "Pending invites", value: "3 outstanding" },
  { label: "RLS policies", value: "Enforced via organization_id" },
];

const tabs = [
  { id: "org", label: "Organization" },
  { id: "data", label: "Data Sources" },
  { id: "audit", label: "Audit Log" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("org");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage organization, data sources, and view audit logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Organization Tab */}
      {activeTab === "org" && (
        <>
          <SectionCard
            title="Org profile"
            description="Update legal name, slug, and region defaults."
            action={
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600">
                Edit details
              </button>
            }
          >
            <dl className="grid gap-4 md:grid-cols-2 text-sm text-slate-600">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Organization
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  Advanced Hospital Staffing
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">Slug</dt>
                <dd className="mt-1 font-medium text-slate-900">
                  advanced-hospital-staffing
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Timezone
                </dt>
                <dd className="mt-1 font-medium text-slate-900">Central (GMT-6)</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Created
                </dt>
                <dd className="mt-1 font-medium text-slate-900">Feb 2, 2025</dd>
              </div>
            </dl>
          </SectionCard>

          <SectionCard
            title="Members & roles"
            description="Invite teammates and enforce least-privilege access with Supabase RLS policies."
            action={
              <button className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500">
                Invite member
              </button>
            }
          >
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {members.map((member) => (
                    <tr key={member.email}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{member.role}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={
                            member.status === "Active" ? "connected" : "pending"
                          }
                          label={member.status}
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-indigo-600">
                        <button className="rounded-lg border border-transparent px-2 py-1 font-semibold transition hover:border-indigo-100">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard
            title="Security controls"
            description="Track authentication posture, token expiry, and audit highlights."
          >
            <div className="grid gap-4 md:grid-cols-4">
              {auditHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm"
                >
                  <p className="text-slate-400">{item.label}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-500">
              <p className="font-semibold text-slate-600">RLS policy blueprint</p>
              <p className="mt-2 leading-relaxed">
                Each tenant table enforces `organization_id = auth.uid()` membership
                checks. Service role keys stay in Supabase Vault. Audit logs capture
                role changes, embed token issuance, and data source credential access.
              </p>
            </div>
          </SectionCard>
        </>
      )}

      {/* Data Sources Tab */}
      {activeTab === "data" && (
        <>
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
                      <StatusBadge
                        status={connector.status}
                        label={connector.status}
                      />
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
        </>
      )}

      {/* Audit Log Tab */}
      {activeTab === "audit" && (
        <>
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
                        {event.action} ·{" "}
                        <span className="font-medium text-slate-900">
                          {event.target}
                        </span>
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
        </>
      )}
    </div>
  );
}
