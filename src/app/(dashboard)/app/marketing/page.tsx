import { SectionCard } from "@/components/ui/section-card";

const sourceMetrics = [
  {
    source: "Job Boards",
    candidates: 1247,
    leads: 892,
    placements: 178,
    conversion: "14.3%",
    costPerPlacement: "$245",
  },
  {
    source: "Referrals",
    candidates: 634,
    leads: 512,
    placements: 142,
    conversion: "22.4%",
    costPerPlacement: "$0",
  },
  {
    source: "Social Media",
    candidates: 387,
    leads: 234,
    placements: 89,
    conversion: "23.0%",
    costPerPlacement: "$189",
  },
  {
    source: "Direct Apply",
    candidates: 234,
    leads: 198,
    placements: 67,
    conversion: "28.6%",
    costPerPlacement: "$0",
  },
  {
    source: "Unknown",
    candidates: 156,
    leads: 98,
    placements: 23,
    conversion: "14.7%",
    costPerPlacement: "N/A",
  },
];

export default function MarketingPage() {
  const unknownPercentage = (
    (sourceMetrics.find((s) => s.source === "Unknown")?.candidates || 0) /
    sourceMetrics.reduce((sum, s) => sum + s.candidates, 0)
  ) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Marketing</h1>
        <p className="mt-2 text-sm text-slate-500">
          Track candidate sources, conversion rates, and marketing effectiveness.
        </p>
      </div>

      {/* Unknown Source Flag */}
      {unknownPercentage > 10 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                High Unknown Source Percentage
              </p>
              <p className="text-xs text-amber-700 mt-1">
                {unknownPercentage.toFixed(1)}% of candidates have unknown source. Consider
                implementing source tracking improvements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Source Performance Table */}
      <SectionCard
        title="Performance by Source"
        description="Candidates, leads, placements, conversion rates, and cost per placement."
      >
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Candidates</th>
                <th className="px-4 py-3 font-medium">Leads</th>
                <th className="px-4 py-3 font-medium">Placements</th>
                <th className="px-4 py-3 font-medium">Conversion</th>
                <th className="px-4 py-3 font-medium">Cost/Placement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {sourceMetrics.map((source) => (
                <tr key={source.source}>
                  <td className="px-4 py-3 font-medium text-slate-900">{source.source}</td>
                  <td className="px-4 py-3 text-slate-900">{source.candidates.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-900">{source.leads.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-900">{source.placements.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        parseFloat(source.conversion) > 20
                          ? "text-emerald-600"
                          : parseFloat(source.conversion) > 15
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {source.conversion}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{source.costPerPlacement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Source Mix Trend */}
      <SectionCard
        title="Source Mix Over Time"
        description="Trend analysis of candidate source distribution."
      >
        <div className="h-80 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
          <div className="text-center">
            <p className="text-lg font-medium">Source Mix Trend Chart</p>
            <p className="text-sm mt-2">Stacked area or line chart showing source distribution over time</p>
            <p className="text-xs mt-1 text-slate-400">Power BI embedded chart placeholder</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

