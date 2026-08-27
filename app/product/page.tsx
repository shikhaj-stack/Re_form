"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import {
  PackageCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  Leaf,
  BarChart3,
  Search,
  Building2,
} from "lucide-react";

export default function FinalProductPage() {
  const specs = [
    { param: "Compressive Strength", spec: "48.2 N/mm² (MPa)", requirement: "Min 40.0 N/mm² (IS 15658)", status: "PASSED (Grade A)" },
    { param: "Water Absorption", spec: "1.12% by weight", requirement: "Max 6.0% (IS 15658)", status: "PASSED" },
    { param: "Abrasion Resistance", spec: "1.4 mm loss", requirement: "Max 2.0 mm (IS 15658)", status: "PASSED" },
    { param: "Composite Density", spec: "2,240 kg/m³", requirement: "Standard structural paver", status: "VERIFIED" },
    { param: "Polymer Matrix Ratio", spec: "75% Silica : 25% Waste Polymer", requirement: "Thermo-mechanical blend", status: "CERTIFIED" },
  ];

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald" pulse>
              CIRCULAR COMMERCIAL ASSET
            </Badge>
            <Badge variant="blue">IS 15658 COMPLIANT</Badge>
            <DisclaimerBadge tag="DEMO_DATA" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            RE-FORM Interlocking Construction Paver
          </h1>
          <p className="text-sm text-slate-400 font-mono mt-1">
            Downstream finished commercial paver asset converted from industrial byproduct streams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/tracking">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-1.5" />
              Verify Batch In Ledger
            </Button>
          </Link>
          <Link href="/journey">
            <Button variant="primary" size="sm">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Launch Demo Journey
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Certificate Showcase Card */}
      <Card className="p-8 md:p-12 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-widest block mb-1">
              Finished Product Provenance Card
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              IS 15658 Heavy-Duty Composite Paver Block
            </h2>
            <p className="text-xs text-slate-300 font-sans mt-2 max-w-2xl leading-relaxed">
              Formulated via twin-screw thermal compounding at 185°C using 75% recycled foundry sand and 25% post-industrial polypropylene / HDPE scrap, pressed at 45 MPa under rapid-chill hydraulic tooling.
            </p>
          </div>

          <div className="p-6 bg-slate-950/80 rounded-2xl border border-emerald-500/30 flex-shrink-0 text-left font-mono text-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Batch Identifier</span>
            <p className="text-2xl font-black text-emerald-400 font-mono">RF-2026-001</p>
            <span className="text-[10px] text-slate-400 block">Inspection Status: Grade A Cleared</span>
          </div>
        </div>

        {/* Clear Provenance Chain Flow */}
        <div className="my-8">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider block mb-4">
            End-to-End Asset Provenance Journey
          </span>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
            <span className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white">
              Foundry Sand (10,000 kg) + Waste Plastic
            </span>
            <span className="text-emerald-400">↓</span>
            <span className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
              Non-Aqueous Scrubbing
            </span>
            <span className="text-emerald-400">↓</span>
            <span className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
              185°C Compounding Formulation
            </span>
            <span className="text-emerald-400">↓</span>
            <span className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
              45 MPa Compression Moulding
            </span>
            <span className="text-emerald-400">↓</span>
            <span className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
              IS 15658 Mechanical Audit
            </span>
            <span className="text-emerald-400">↓</span>
            <span className="px-3.5 py-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              RE-FORM Paver (2,450 Units)
            </span>
          </div>
        </div>

        {/* Macro Card Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-mono">
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Source Industry</span>
            <span className="font-bold text-white mt-1 block">Demo Foundry Pvt. Ltd.</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Processing Node</span>
            <span className="font-bold text-blue-400 mt-1 block">EcoMat Converters Ltd.</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Estimated Gross Value</span>
            <span className="font-bold text-emerald-400 mt-1 block">₹3,82,500 INR</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Avoided Carbon Offset</span>
            <span className="font-bold text-teal-400 mt-1 block">3,444 kg CO₂e</span>
          </div>
        </div>
      </Card>

      {/* Technical Specifications Audit Table */}
      <Card className="p-8 border-slate-800 bg-slate-900/90">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>IS 15658 Standard Mechanical Audit Specifications</span>
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Automated laboratory compliance audit for civil highway & municipal installations.
            </p>
          </div>
          <DisclaimerBadge tag="REQUIRES_LABORATORY_VALIDATION" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4">Test Result</th>
                <th className="py-3 px-4">IS 15658 Benchmark</th>
                <th className="py-3 px-4 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {specs.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40">
                  <td className="py-3 px-4 font-bold text-white">{row.param}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{row.spec}</td>
                  <td className="py-3 px-4 text-slate-400">{row.requirement}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
