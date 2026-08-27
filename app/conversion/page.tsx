import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";

export default function ConversionEnginePage() {
  const pathways = [
    {
      num: "01",
      input: "Waste Plastic Scrap (HDPE/PP)",
      process: "Thermal Compounding & Structural Profile Extrusion",
      output: "Composite Structural Lumber & Paving Beams",
      sector: "Civil Infrastructure & Rail",
      valuation: "₹120 - 150 / kg",
      eco: "Avoids 2.1 kg CO2e per kg virgin plastic displaced",
      disclaimer: "PROTOTYPE_ESTIMATE",
    },
    {
      num: "02",
      input: "Industrial Textile Offcuts",
      process: "Mechanical Shredding & Non-Woven Resin Bonding",
      output: "High-Density Acoustic & Thermal Insulation Panels",
      sector: "Architecture & Automotive Interior",
      valuation: "₹400 - 600 / sq.m",
      eco: "Zero-effluent mechanical dry process",
      disclaimer: "PROTOTYPE_ESTIMATE",
    },
    {
      num: "03",
      input: "Contaminated Glass Cullet",
      process: "Impact Crushing & Aerodynamic Particulate Sifting",
      output: "Engineered Sand Substitute for High-Performance Concrete",
      sector: "Commercial Construction",
      valuation: "₹80 - 100 / ton",
      eco: "Conserves natural riverbed ecosystems",
      disclaimer: "REQUIRES_LABORATORY_VALIDATION",
    },
    {
      num: "04",
      input: "Coal Fly Ash (Class F)",
      process: "Alkaline Activation & Geopolymerization",
      output: "Zero-Clinker Low Carbon Structural Green Cement",
      sector: "Heavy Infrastructure & Ports",
      valuation: "₹200 - 250 / bag",
      eco: "80% lower embodied carbon than OPC cement",
      disclaimer: "REQUIRES_REGULATORY_COMPLIANCE",
    },
    {
      num: "05",
      input: "Foundry Slag & Metal Turnings",
      process: "Magnetic Separation & Electric Induction Refining",
      output: "High-Purity Secondary Alloy Billets",
      sector: "Automotive & Industrial Casting",
      valuation: "Market Indexed (LME Linked)",
      eco: "95% energy reduction vs virgin bauxite/iron smelting",
      disclaimer: "DEMO_DATA",
    },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="emerald" className="mb-3">
          CIRCULAR CONVERSION MATRIX
        </Badge>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          RE-FORM Conversion Engine
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          What Can Your Waste Become? A matrix matching industrial waste streams to high-value circular functional products.
        </p>
      </div>

      {/* Primary Active Loop Banner */}
      <Card className="border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/20 p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left: Input */}
          <div className="w-full md:w-5/12 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center flex flex-col items-center">
            <Badge variant="emerald" className="mb-3">
              PRIMARY DEMO INPUT VECTOR
            </Badge>
            <h3 className="text-2xl font-black text-white">
              Foundry Sand + Waste Plastic
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              10,000 kg/month abundant manufacturing byproduct
            </p>
          </div>

          {/* Center: Transform Arrow */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] border-2 border-emerald-400">
              <Zap className="w-7 h-7 text-white animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold mt-2">
              82% Yield
            </span>
          </div>

          {/* Right: Output */}
          <div className="w-full md:w-5/12 bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 text-center flex flex-col items-center">
            <Badge variant="blue" className="mb-3">
              COMMERCIAL STRUCTURAL ASSET
            </Badge>
            <h3 className="text-2xl font-black text-white">
              Recycled Construction Pavers
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              IS 15658 Compliant Interlocking Blocks
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <DisclaimerBadge tag="PROTOTYPE_ESTIMATE" />
            <span className="text-xs font-mono text-slate-400">
              Tested at regional partner node (EcoMat Converters Ltd.)
            </span>
          </div>
          <Link href="/process">
            <Button size="sm" variant="primary">
              View 8-Stage Processing Graph
            </Button>
          </Link>
        </div>
      </Card>

      {/* Expansion Catalog Grid */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-6 h-6 text-emerald-400" />
              <span>Future Expansion Pathways Catalog</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Industrial cross-sector conversion specifications for planned platform stages.
            </p>
          </div>
          <DisclaimerBadge tag="REQUIRES_LABORATORY_VALIDATION" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pathways.map((item) => (
            <Card
              key={item.num}
              className="p-6 border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                      {item.num}
                    </span>
                    <Badge variant="slate">{item.sector}</Badge>
                  </div>
                  <DisclaimerBadge tag={item.disclaimer} />
                </div>

                <div className="my-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                    Input Byproduct
                  </span>
                  <h4 className="text-lg font-bold text-white">{item.input}</h4>
                </div>

                <div className="my-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                    Processing Stage
                  </span>
                  <p className="text-xs text-slate-300 font-medium">{item.process}</p>
                </div>

                <div className="my-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    Target Functional Product
                  </span>
                  <p className="text-sm font-bold text-emerald-300">{item.output}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">
                    Estimated Valuation
                  </span>
                  <span className="text-white font-bold">{item.valuation}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">
                    Ecological Benefit
                  </span>
                  <span className="text-emerald-400 font-medium">{item.eco}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
