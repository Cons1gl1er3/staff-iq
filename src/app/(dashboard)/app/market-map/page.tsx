import { SectionCard } from "@/components/ui/section-card";

export default function MarketMapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Market Map</h1>
        <p className="mt-2 text-sm text-slate-500">
          Geographic visualization of client facilities and talent distribution.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {["Specialty", "Radius", "Client Type", "Facility Size"].map((filter) => (
          <button
            key={filter}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Map Visualization */}
      <SectionCard
        title="Geographic Distribution"
        description="Choropleth or bubble map showing client facilities and talent locations."
      >
        <div className="h-[600px] flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
          <div className="text-center">
            <p className="text-lg font-medium">Market Map</p>
            <p className="text-sm mt-2">Interactive map with facility and talent markers</p>
            <p className="text-sm mt-1">Filter by specialty, radius, client type</p>
            <p className="text-xs mt-1 text-slate-400">Power BI embedded map or custom map component placeholder</p>
          </div>
        </div>
      </SectionCard>

      {/* Map Legend/Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Total Facilities</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">47</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Active Placements</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">178</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Coverage Radius</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">250 mi</p>
        </div>
      </div>
    </div>
  );
}

