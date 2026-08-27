"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import {
  BarChart3,
  TrendingDown,
  Droplets,
  ShieldCheck,
  Leaf,
  Globe2,
  AlertTriangle,
} from "lucide-react";

export default function EnvironmentalImpactPage() {
  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="emerald">ECOLOGICAL LIFE-CYCLE TELEMETRY</Badge>
          <DisclaimerBadge tag="REQUIRES_REGULATORY_COMPLIANCE" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Environmental Impact Analytics
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Structural data models contrasting conventional linear disposal impacts against the circular RE-FORM upcycling ecosystem.
        </p>
      </div>

      {/* Headline Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="CO2 Emissions Avoided"
          value="42.8"
          unit="Kilo-Tons"
          change="84% reduction"
          disclaimer="PROTOTYPE_ESTIMATE"
          icon={<Leaf className="w-4 h-4" />}
        />
        <MetricCard
          label="Landfill Diversion Rate"
          value="94.2"
          unit="%"
          change="35,000+ MT diverted"
          disclaimer="DEMO_DATA"
          icon={<Globe2 className="w-4 h-4" />}
        />
        <MetricCard
          label="Industrial Water Preserved"
          value="2.4"
          unit="Million Liters"
          change="Zero-effluent washing"
          disclaimer="PROTOTYPE_ESTIMATE"
          icon={<Droplets className="w-4 h-4" />}
        />
        <MetricCard
          label="Virgin Aggregate Conserved"
          value="32.1"
          unit="Kilo-Tons"
          change="River sand protected"
          disclaimer="REQUIRES_LABORATORY_VALIDATION"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Destiny Trajectory Comparison Graphic */}
      <Card className="p-8 md:p-12 border-slate-800 bg-slate-900/90 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-slate-800 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              <span>Waste Destiny Trajectory Models</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Comparative resource degradation index: Linear Landfill Path vs RE-FORM Value Loop.
            </p>
          </div>
          <DisclaimerBadge tag="PROTOTYPE_ESTIMATE" />
        </div>

        <div className="space-y-8 my-6">
          {/* Baseline Path */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-red-400 font-bold uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Baseline Linear Path: Immediate Landfill Dumping
              </span>
              <span className="text-red-400 font-bold">-85% Ecosystem Degradation</span>
            </div>
            <div className="w-full h-10 bg-slate-950 rounded-xl overflow-hidden p-1 border border-slate-800">
              <div className="h-full w-[35%] bg-gradient-to-r from-red-600/30 to-red-600 rounded-lg flex items-center justify-end pr-3 text-[11px] font-mono text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                35% Value Dissipated
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Material trajectory: Factory Generation → Open Pit Landfill / Leaching Risk → Permanent Resource Loss.
            </p>
          </div>

          {/* RE-FORM Pathway */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                RE-FORM Ecosystem Loop: Multi-Stage Valorization
              </span>
              <span className="text-emerald-400 font-bold">+92% Material Transformation</span>
            </div>
            <div className="w-full h-12 bg-slate-950 rounded-xl overflow-hidden p-1 border border-emerald-500/30">
              <div className="h-full w-[100%] bg-gradient-to-r from-emerald-600/40 via-emerald-500 to-teal-400 rounded-lg flex items-center justify-end pr-4 text-xs font-mono text-slate-950 font-black shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                100% Closed Loop Circular Transition
              </div>
            </div>
            <p className="text-[11px] text-emerald-400/80 font-mono">
              Material trajectory: Factory Generation → Non-Aqueous Refining → Polymer Compounding → IS 15658 Construction Blocks → Commercial Infrastructure Deployment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 text-center font-mono text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 uppercase text-[10px] block">Baseline Landfill Loss</span>
            <span className="text-red-400 font-bold text-base mt-1 block">100% Mass Lost</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 uppercase text-[10px] block">RE-FORM Recovery</span>
            <span className="text-emerald-400 font-bold text-base mt-1 block">82% Product Yield</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 uppercase text-[10px] block">Carbon Displaced</span>
            <span className="text-blue-400 font-bold text-base mt-1 block">0.42 kg/kg</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 uppercase text-[10px] block">Audit Compliance</span>
            <span className="text-emerald-400 font-bold text-base mt-1 block">ISO 14001 Matrix</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
