"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";

const DARK_TOOLTIP_STYLE = {
  backgroundColor: "#0b1329",
  borderColor: "#1e293b",
  borderRadius: "0.75rem",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
  color: "#f8fafc",
  fontSize: "0.75rem",
  fontFamily: "var(--font-jetbrains), monospace",
  padding: "8px 12px",
};

interface ChartsProps {
  chartsData: {
    wasteByType: Array<{ key: string; name: string; quantityKg: number; quantityMt: number; count: number; color: string }>;
    processingTrend: Array<{ period: string; trackedKg: number; processedKg: number; convertedKg: number }>;
    pathwayUsage: Array<{ id: string; name: string; fullName: string; outputProduct: string; batchesCount: number; isActive: boolean; validationStatus: string; estimatedValueLakhs: number }>;
    batchStatusDistribution: Array<{ status: string; label: string; count: number }>;
    marketplaceActivity: Array<{ category: string; count: number; fill: string }>;
    valueGeneratedByPathway: Array<{ name: string; valueMinLakhs: number; valueMaxLakhs: number; status: string }>;
    environmentalImpactComparison: Array<{ metric: string; linearBaseline: number; reformCircular: number; avoided: number }>;
  };
}

export function AdminChartsGrid({ chartsData }: ChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-80 bg-slate-900/50 rounded-2xl border border-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Operational & Ecological Analytics Intelligence</span>
            <Badge variant="blue">RECHARTS ENGINE</Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated real-time analytics across material types, conversion pathways, batches, and circular ROI.
          </p>
        </div>
        <DisclaimerBadge tag="DEMO_DATA" />
      </div>

      {/* Row 1: Waste by Material Type & Waste Processing Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Waste by Material Type */}
        <Card className="p-6 border-slate-800 bg-slate-900/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <span>Waste by Material Type</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Total Tonnage
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Distribution of raw byproduct inventory across industrial streams.
              </CardDescription>
            </div>
            <span className="text-[10px] font-mono text-slate-500">KG / MT Units</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartsData.wasteByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="quantityKg"
                  nameKey="name"
                >
                  {chartsData.wasteByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={DARK_TOOLTIP_STYLE}
                  formatter={(value: number) => [`${(value / 1000).toFixed(1)} MT (${value.toLocaleString()} KG)`, "Volume"]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                  formatter={(value) => <span className="text-slate-300 font-mono text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Waste Processing Trend */}
        <Card className="p-6 border-slate-800 bg-slate-900/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <span>Waste Processing Trend</span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Throughput Velocity
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Progression of tracked raw input vs converted functional commodity output.
              </CardDescription>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Cohort Evolution</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartsData.processingTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTracked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  contentStyle={DARK_TOOLTIP_STYLE}
                  formatter={(val: number) => [`${val.toLocaleString()} KG`, ""]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px" }}
                  formatter={(value) => (
                    <span className="text-slate-300 font-mono text-xs">
                      {value === "trackedKg" ? "Tracked Input" : value === "processedKg" ? "Processed In-Line" : "Finished Product"}
                    </span>
                  )}
                />
                <Area type="monotone" dataKey="trackedKg" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTracked)" name="trackedKg" />
                <Area type="monotone" dataKey="processedKg" stroke="#10b981" fillOpacity={1} fill="url(#colorProcessed)" name="processedKg" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Conversion Pathway Usage & Batch Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 3: Conversion Pathway Usage */}
        <Card className="p-6 border-slate-800 bg-slate-900/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <span>Conversion Pathway Usage</span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Active Routes
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Batches allocated per proprietary conversion pathway matrix.
              </CardDescription>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Batches Count</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartsData.pathwayUsage}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} width={120} />
                <Tooltip
                  contentStyle={DARK_TOOLTIP_STYLE}
                  formatter={(val: number) => [`${val} Batches Executed`, "Volume"]}
                />
                <Bar dataKey="batchesCount" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Batches Executed">
                  {chartsData.pathwayUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isActive ? "#8b5cf6" : "#475569"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Batch Status Distribution */}
        <Card className="p-6 border-slate-800 bg-slate-900/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <span>Batch Status Distribution</span>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  Lifecycle Stages
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Distribution across 8 immutable provenance milestones.
              </CardDescription>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Pipeline Flow</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData.batchStatusDistribution} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={45} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={DARK_TOOLTIP_STYLE}
                  formatter={(val: number) => [`${val} Batches`, "Count"]}
                />
                <Bar dataKey="count" fill="#14b8a6" radius={[6, 6, 0, 0]} name="Batch Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3: Marketplace Activity & Estimated Value Generated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 5: Marketplace Activity */}
        <Card className="p-6 border-slate-800 bg-slate-900/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <span>Marketplace Activity</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Liquidity & Bids
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Listings and allocation requests across the circular exchange.
              </CardDescription>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Orders & Offers</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData.marketplaceActivity} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={45} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={DARK_TOOLTIP_STYLE}
                  formatter={(val: number) => [`${val} Units`, "Quantity"]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartsData.marketplaceActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 6: Estimated Value Generated */}
        <Card className="p-6 border-slate-800 bg-slate-900/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <span>Estimated Value Generated</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Economic Net Yield
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Projected commercial value creation per conversion pathway category.
              </CardDescription>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">₹ Lakhs</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData.valueGeneratedByPathway} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={45} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={DARK_TOOLTIP_STYLE}
                  formatter={(val: number, name: string) => [
                    `₹${val} Lakhs`,
                    name === "valueMinLakhs" ? "Conservative Yield" : "Optimized Yield",
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px" }}
                  formatter={(value) => (
                    <span className="text-slate-300 font-mono text-xs">
                      {value === "valueMinLakhs" ? "Base Yield (₹ L)" : "Upper Ceiling (₹ L)"}
                    </span>
                  )}
                />
                <Bar dataKey="valueMinLakhs" fill="#059669" radius={[4, 4, 0, 0]} name="valueMinLakhs" />
                <Bar dataKey="valueMaxLakhs" fill="#10b981" radius={[4, 4, 0, 0]} name="valueMaxLakhs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 4: Chart 7: Estimated Environmental Impact Comparison */}
      <Card className="p-6 border-slate-800 bg-slate-900/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <span>Estimated Environmental Impact: Linear vs. RE-FORM Circular</span>
              <Badge variant="emerald">ECOLOGICAL LIFE-CYCLE AUDIT</Badge>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1">
              Direct LCA contrast comparing landfill disposal & virgin resource mining against upcycling.
            </CardDescription>
          </div>
          <DisclaimerBadge tag="REQUIRES_REGULATORY_COMPLIANCE" />
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartsData.environmentalImpactComparison}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={DARK_TOOLTIP_STYLE}
                formatter={(val: number, name: string) => [
                  val,
                  name === "linearBaseline"
                    ? "Conventional Linear Footprint"
                    : name === "reformCircular"
                    ? "RE-FORM Circular Footprint"
                    : "Net Resource Conserved",
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                formatter={(value) => (
                  <span className="text-slate-300 font-mono text-xs">
                    {value === "linearBaseline"
                      ? "Linear Baseline Impact (Landfill / Virgin Mining)"
                      : value === "reformCircular"
                      ? "RE-FORM Circular Impact (Controlled Upcycle)"
                      : "Net Environmental Benefit (Avoided)"}
                  </span>
                )}
              />
              <Bar dataKey="linearBaseline" fill="#ef4444" radius={[4, 4, 0, 0]} name="linearBaseline" />
              <Bar dataKey="reformCircular" fill="#f59e0b" radius={[4, 4, 0, 0]} name="reformCircular" />
              <Bar dataKey="avoided" fill="#10b981" radius={[4, 4, 0, 0]} name="avoided" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
