import { SectionCard } from "@/components/ui/section-card";

const benchmarkMetrics = [
  { metric: "Revenue per Recruiter", current: "$245K", median: "$228K", percentile: "65th" },
  { metric: "Placements per Recruiter", current: "14.2", median: "12.8", percentile: "72nd" },
  { metric: "Time-to-Fill", current: "12.3 days", median: "14.1 days", percentile: "35th" },
  { metric: "Fill Rate", current: "87.3%", median: "82.5%", percentile: "68th" },
  { metric: "GP Margin", current: "27.6%", median: "25.2%", percentile: "75th" },
  { metric: "Offer Acceptance", current: "76.1%", median: "71.3%", percentile: "70th" },
];

export default function BenchmarksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Benchmarks</h1>
        <p className="mt-2 text-sm text-slate-500">
          Compare your performance against internal branches and industry standards.
        </p>
      </div>

      {/* Benchmark Metrics */}
      <SectionCard
        title="Performance Benchmarks"
        description="Current metrics vs median performance across internal branches."
      >
        <div className="space-y-4">
          {benchmarkMetrics.map((benchmark) => {
            const isAboveMedian = parseFloat(benchmark.current) > parseFloat(benchmark.median) ||
              (benchmark.current.includes("%") && parseFloat(benchmark.current) > parseFloat(benchmark.median));
            return (
              <div
                key={benchmark.metric}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-slate-900">{benchmark.metric}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isAboveMedian
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {benchmark.percentile} percentile
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Your Performance</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {benchmark.current}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Median (Internal)</p>
                    <p className="mt-1 text-lg font-medium text-slate-600">
                      {benchmark.median}
                    </p>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      isAboveMedian ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${parseInt(benchmark.percentile)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Comparison Chart */}
      <SectionCard
        title="Branch Comparison"
        description="Visual comparison across internal branches (when available)."
      >
        <div className="h-80 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
          <div className="text-center">
            <p className="text-lg font-medium">Branch Comparison Chart</p>
            <p className="text-sm mt-2">Bar or radar chart comparing branches</p>
            <p className="text-xs mt-1 text-slate-400">Power BI embedded chart placeholder</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

