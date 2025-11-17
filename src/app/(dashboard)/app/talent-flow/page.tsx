import { SectionCard } from "@/components/ui/section-card";

const funnelStages = [
  { stage: "Applied", count: 1247, conversion: "100%" },
  { stage: "Qualified", count: 892, conversion: "71.5%" },
  { stage: "Submitted", count: 634, conversion: "50.8%" },
  { stage: "Interviewed", count: 387, conversion: "31.0%" },
  { stage: "Offered", count: 234, conversion: "18.8%" },
  { stage: "Placed", count: 178, conversion: "14.3%" },
  { stage: "Redeployed", count: 142, conversion: "11.4%" },
];

const utilization = [
  { metric: "Open Orders", value: "156", target: "180" },
  { metric: "Coverage", value: "142", percentage: "91.0%" },
  { metric: "Schedule Utilization", value: "87.3%" },
  { metric: "Order Utilization", value: "78.9%" },
];

export default function TalentFlowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Talent Flow</h1>
        <p className="mt-2 text-sm text-slate-500">
          Track candidate progression through the recruitment funnel.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {["Period", "Client/Facility", "Specialty", "Recruiter"].map((filter) => (
          <button
            key={filter}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Funnel Visualization */}
        <SectionCard
          title="Recruitment Funnel"
          description="Candidate progression with conversion rates at each stage."
        >
          <div className="space-y-4">
            {funnelStages.map((stage, idx) => {
              const widthPercent = (stage.count / funnelStages[0].count) * 100;
              return (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900">{stage.stage}</span>
                      <span className="text-slate-500">{stage.count}</span>
                    </div>
                    <span className="text-xs font-medium text-indigo-600">
                      {stage.conversion}
                    </span>
                  </div>
                  <div className="h-8 rounded-lg bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-end pr-3"
                      style={{ width: `${widthPercent}%` }}
                    >
                      {widthPercent > 15 && (
                        <span className="text-xs font-medium text-white">
                          {stage.count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Click any stage to view detailed records →
            </button>
          </div>
        </SectionCard>

        {/* Utilization Metrics */}
        <SectionCard
          title="Utilization Metrics"
          description="Open orders vs coverage and utilization rates."
        >
          <div className="space-y-4">
            {utilization.map((item) => (
              <div
                key={item.metric}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="text-sm font-medium text-slate-500">{item.metric}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                  {item.target && (
                    <span className="text-xs text-slate-400">/ {item.target}</span>
                  )}
                  {item.percentage && (
                    <span className="text-sm text-indigo-600">{item.percentage}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Drill-down placeholder */}
      <SectionCard
        title="Stage Details"
        description="Click a funnel stage above to view detailed records."
      >
        <div className="h-64 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
          <p>Select a stage from the funnel to view candidate records</p>
        </div>
      </SectionCard>
    </div>
  );
}

