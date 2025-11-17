"use client";

import { useState } from "react";
import { SectionCard } from "@/components/ui/section-card";
import { MetricCard } from "@/components/ui/metric-card";

type KPIDelta = {
  value: string;
  trend: "up" | "down";
};

type KPI = {
  label: string;
  value: string;
  delta?: KPIDelta;
  percentage?: string;
  icon?: string;
};

const tabs = [
  { id: "flash", label: "Flash" },
  { id: "sales", label: "Sales" },
  { id: "effectiveness", label: "Effectiveness" },
  { id: "operations", label: "Operations" },
  { id: "other", label: "Other KPIs" },
];

const flashKPIs: KPI[] = [
  { label: "Revenue", value: "$287K", delta: { value: "+12.5%", trend: "up" as const }, icon: "💰" },
  { label: "Units (Placements)", value: "178", delta: { value: "+8.2%", trend: "up" as const }, icon: "👥" },
  { label: "Payments", value: "$245K", delta: { value: "+15.3%", trend: "up" as const }, icon: "💵" },
  { label: "GP", value: "$78K", delta: { value: "+9.1%", trend: "up" as const }, icon: "📈" },
  { label: "ASP (Avg Bill Rate)", value: "$68/hr", delta: { value: "+2.1%", trend: "up" as const }, icon: "📊" },
  { label: "GP/hr", value: "$18.50", delta: { value: "+1.8%", trend: "up" as const }, icon: "⚡" },
];

const salesKPIs: KPI[] = [
  { label: "New Client Revenue", value: "$124K", percentage: "43.2%" },
  { label: "Existing Client Revenue", value: "$163K", percentage: "56.8%" },
  { label: "New Placements", value: "89", percentage: "50.0%" },
  { label: "Redeploy Placements", value: "89", percentage: "50.0%" },
  { label: "Offer→Start %", value: "76.1%", delta: { value: "+2.3%", trend: "up" as const } },
];

const effectivenessKPIs: KPI[] = [
  { label: "Submittal→Interview %", value: "61.0%", delta: { value: "+3.2%", trend: "up" as const } },
  { label: "Interview→Offer %", value: "60.5%", delta: { value: "-1.8%", trend: "down" as const } },
  { label: "Offer→Start %", value: "76.1%", delta: { value: "+2.3%", trend: "up" as const } },
  { label: "Time-to-Fill", value: "12.3 days", delta: { value: "-1.2 days", trend: "up" as const } },
];

const operationsKPIs: KPI[] = [
  { label: "Cancellation Rate", value: "4.2%", delta: { value: "-0.8%", trend: "up" as const } },
  { label: "No-show Rate", value: "2.1%", delta: { value: "-0.3%", trend: "up" as const } },
  { label: "Early Term 30d", value: "8.4%", delta: { value: "+1.2%", trend: "down" as const } },
  { label: "Early Term 60d", value: "12.8%", delta: { value: "+0.5%", trend: "down" as const } },
  { label: "Early Term 90d", value: "18.2%", delta: { value: "-0.9%", trend: "up" as const } },
  { label: "Credentialing Cycle", value: "5.2 days", delta: { value: "-0.4 days", trend: "up" as const } },
];

export default function KPICenterPage() {
  const [activeTab, setActiveTab] = useState("flash");

  const getKPIsForTab = (): KPI[] => {
    switch (activeTab) {
      case "flash":
        return flashKPIs;
      case "sales":
        return salesKPIs;
      case "effectiveness":
        return effectivenessKPIs;
      case "operations":
        return operationsKPIs;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">KPI Center</h1>
        <p className="mt-2 text-sm text-slate-500">
          Comprehensive key performance indicators across all business areas.
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

      {/* KPI Grid */}
      <SectionCard title={tabs.find((t) => t.id === activeTab)?.label || "KPIs"}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {getKPIsForTab().map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                {kpi.icon && <span className="text-xl">{kpi.icon}</span>}
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{kpi.value}</p>
              {kpi.delta && (
                <p
                  className={`mt-2 text-xs font-medium ${
                    kpi.delta.trend === "up" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {kpi.delta.value}
                </p>
              )}
              {kpi.percentage && (
                <p className="mt-2 text-xs text-slate-500">{kpi.percentage} of total</p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

