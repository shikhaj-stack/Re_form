"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import { Button } from "@/components/ui/button";
import {
  GitBranch,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Database,
} from "lucide-react";

export default function ProcessPipelinePage() {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);

  const pipelineStages = [
    {
      num: "01",
      title: "Collection & Logistics",
      subtitle: "Material Intake & Inspection",
      desc: "Foundry sand and segregated polymer wastes are collected via sealed hopper trailers from partnered foundry nodes under strict chain-of-custody protocols.",
      metrics: { temp: "Ambient", throughput: "10,000 kg/run", cycleTime: "4.5 hrs" },
    },
    {
      num: "02",
      title: "Automated Screening",
      subtitle: "Contaminant Elimination",
      desc: "High-intensity rare-earth magnetic separators and multi-deck vibratory screens purge tramp iron, oversize slag particulates, and non-compliant debris.",
      metrics: { temp: "Ambient", throughput: "2,500 kg/hr", separationRate: "99.8%" },
    },
    {
      num: "03",
      title: "Non-Aqueous Scrubbing",
      subtitle: "Surface Decontamination",
      desc: "Dry mechanical scrubbing with counter-flow air classification removes carbonaceous binders and organic coatings from sand surfaces without water consumption.",
      metrics: { effluent: "0 Liters", efficiency: "94.5%", powerDraw: "18 kW" },
    },
    {
      num: "04",
      title: "Micro-Granulation",
      subtitle: "Polymer Matrix Preparation",
      desc: "Waste plastic (HDPE/PP scrap) is pulverized into 2mm micro-granules to optimize surface-area contact with dry silica particles during compounding.",
      metrics: { grainSize: "1.5 - 2.0 mm", moisture: "<0.2%", yield: "98.2%" },
    },
    {
      num: "05",
      title: "Thermal Compounding",
      subtitle: "Fluidized Composite Mixing",
      desc: "Foundry sand (75%) and polymer micro-granules (25%) enter a twin-screw thermal compounder at 185°C to form a homogeneous molten composite slurry.",
      metrics: { temp: "185°C ± 3°C", blendRatio: "75:25 Sand/Polymer", residence: "90 sec" },
    },
    {
      num: "06",
      title: "Hydraulic Compression Moulding",
      subtitle: "Interlocking Paver Geometry",
      desc: "The composite matrix is injected into high-durability steel moulds and compressed at 45 MPa under rapid-chill hydraulic tooling.",
      metrics: { pressure: "45 MPa", cycleRate: "12 units/min", mouldTemp: "35°C" },
    },
    {
      num: "07",
      title: "Quality Assurance & Testing",
      subtitle: "IS 15658 Compliance Audit",
      desc: "Finished pavers undergo automated compressive load testing (min. 40 N/mm²), abrasion resistance verification, and water-absorption analysis.",
      metrics: { compressiveStrength: "48.2 MPa", waterAbsorption: "<1.2%", passRate: "99.4%" },
    },
    {
      num: "08",
      title: "Cryptographic Batch Inscription",
      subtitle: "Dispatch to Infrastructure Projects",
      desc: "Cleared pavers are serialized with tamper-resistant QR identifiers and dispatched to infrastructure clients (e.g. NHAI highway developments).",
      metrics: { batchLedger: "Logged", certification: "Grade A", dispatch: "Ready" },
    },
  ];

  const activeStage = pipelineStages[activeStageIdx];

  const blueprintFlow = [
    "Factory Floor Node",
    "Web Ingestion API",
    "Validation Engine (Zod)",
    "Matching AI Logic",
    "Processor Network",
    "Finished Paver Valuation",
    "Commercial Outlets",
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="emerald" className="mb-3">
          INDUSTRIAL PROCESS GRAPH
        </Badge>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Waste-to-Product Process Pipeline
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Interactive 8-stage industrial processing architecture converting 10,000 kg Foundry Sand and Plastic Scrap into certified construction assets.
        </p>
      </div>

      {/* Main Interactive Stage Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: 8 Stages Visual Graph (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="p-8 border-slate-800 bg-slate-900/90 relative">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                Industrial Pipeline Nodes (Click to Inspect)
              </span>
              <DisclaimerBadge tag="PROTOTYPE_ESTIMATE" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {pipelineStages.map((stage, idx) => {
                const isSelected = idx === activeStageIdx;
                return (
                  <button
                    key={stage.num}
                    onClick={() => setActiveStageIdx(idx)}
                    className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[140px] relative group ${
                      isSelected
                        ? "bg-emerald-600/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          isSelected
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-800 text-slate-400 group-hover:text-emerald-400"
                        }`}
                      >
                        STAGE {stage.num}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold leading-tight ${
                          isSelected ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {stage.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1 truncate">
                        {stage.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right: Active Stage Telemetry (1 col) */}
        <div className="lg:col-span-1">
          <Card className="h-full border-emerald-500/40 bg-slate-900/90 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="emerald" pulse>
                  STAGE 0{activeStageIdx + 1} TELEMETRY
                </Badge>
                <span className="text-[10px] font-mono text-slate-400">LATENCY: 12ms</span>
              </div>

              <h3 className="text-2xl font-extrabold text-white">{activeStage.title}</h3>
              <p className="text-xs text-emerald-400 font-mono font-semibold mt-1">
                {activeStage.subtitle}
              </p>

              <div className="my-6 p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                  Operational Standard Operating Procedure (SOP)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeStage.desc}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                  Sensor Telemetry & Parameters
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(activeStage.metrics).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs"
                    >
                      <span className="text-[9px] font-mono text-slate-400 uppercase block truncate">
                        {key}
                      </span>
                      <span className="font-mono font-bold text-white text-sm">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <DisclaimerBadge tag="REQUIRES_LABORATORY_VALIDATION" />
            </div>
          </Card>
        </div>
      </div>

      {/* Startup Technology Blueprint */}
      <Card className="p-8 border-slate-800 bg-slate-900/60">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="blue" className="mb-2">
            DIGITAL INGESTION & MATCHMAKING BLUEPRINT
          </Badge>
          <h3 className="text-2xl font-bold text-white">Startup Architecture Topology</h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Data transmission pipeline connecting physical factory floor sensors to commercial marketplace nodes.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
          {blueprintFlow.map((node, i, arr) => (
            <div
              key={node}
              className="flex flex-col items-center flex-1 w-full xl:w-auto min-w-[120px]"
            >
              <div className="w-full text-center px-4 py-3 bg-slate-800/90 rounded-xl border border-emerald-500/30 text-xs font-bold text-slate-200 shadow-sm">
                {node}
              </div>
              {i !== arr.length - 1 && (
                <div className="h-4 xl:h-0 xl:w-4 border-l-2 xl:border-l-0 xl:border-t-2 border-dashed border-emerald-500/50 my-1 xl:my-0" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-emerald-300">
              Role of the Cryptographic Provenance Ledger
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            The ledger layer functions strictly as a data-integrity verification node to generate immutable audit trails and verify chain-of-custody handoffs. It guarantees supply-chain transparency and compliance without performing the physical mechanical recycling operations.
          </p>
        </div>
      </Card>
    </div>
  );
}
