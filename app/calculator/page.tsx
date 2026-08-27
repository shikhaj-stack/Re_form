"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import { calculateEconomicRoi } from "@/lib/calculations/economic-roi";
import { Calculator, Sparkles, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

export default function CalculatorPage() {
  const [params, setParams] = useState({
    wasteMassKg: 10000,
    baselineDisposalSurchargePerKg: 15,
    processingOverheadPerKg: 8,
    finishedProductYieldPercent: 85,
    targetAssetUnitResaleValue: 45,
  });

  const results = calculateEconomicRoi(params);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="emerald">ECONOMIC VALUATION ENGINE</Badge>
          <DisclaimerBadge tag="ILLUSTRATIVE_CALCULATION" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Interactive Economic ROI Calculator
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Simulate the financial economics of converting raw landfill disposal liabilities into monetizable high-margin commercial products.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input Parameters (1 Col) */}
        <Card className="p-8 border-slate-800 bg-slate-900/90">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span>Input Financial Parameters</span>
            </CardTitle>
            <CardDescription>
              Adjust baseline operational cost variables to calculate yield run-rates.
            </CardDescription>
          </CardHeader>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label className="font-semibold text-slate-300 uppercase">
                  Waste Mass Volume (kg)
                </label>
                <span className="text-emerald-400 font-bold">
                  {params.wasteMassKg.toLocaleString()} kg
                </span>
              </div>
              <Input
                type="number"
                value={params.wasteMassKg}
                onChange={(e) =>
                  setParams({ ...params, wasteMassKg: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label className="font-semibold text-slate-300 uppercase">
                  Baseline Disposal Surcharge (₹/kg)
                </label>
                <span className="text-red-400 font-bold">
                  ₹{params.baselineDisposalSurchargePerKg} / kg
                </span>
              </div>
              <Input
                type="number"
                value={params.baselineDisposalSurchargePerKg}
                onChange={(e) =>
                  setParams({
                    ...params,
                    baselineDisposalSurchargePerKg: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label className="font-semibold text-slate-300 uppercase">
                  Processing & Handling Overheads (₹/kg)
                </label>
                <span className="text-amber-400 font-bold">
                  ₹{params.processingOverheadPerKg} / kg
                </span>
              </div>
              <Input
                type="number"
                value={params.processingOverheadPerKg}
                onChange={(e) =>
                  setParams({
                    ...params,
                    processingOverheadPerKg: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label className="font-semibold text-slate-300 uppercase">
                  Finished Product Conversion Yield (%)
                </label>
                <span className="text-blue-400 font-bold">
                  {params.finishedProductYieldPercent}%
                </span>
              </div>
              <Input
                type="number"
                max={100}
                value={params.finishedProductYieldPercent}
                onChange={(e) =>
                  setParams({
                    ...params,
                    finishedProductYieldPercent: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label className="font-semibold text-slate-300 uppercase">
                  Target Asset Unit Resale Value (₹/kg)
                </label>
                <span className="text-emerald-400 font-bold">
                  ₹{params.targetAssetUnitResaleValue} / kg
                </span>
              </div>
              <Input
                type="number"
                value={params.targetAssetUnitResaleValue}
                onChange={(e) =>
                  setParams({
                    ...params,
                    targetAssetUnitResaleValue: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        </Card>

        {/* Right: Projected Yield Output Panel (1 Col) */}
        <Card className="p-8 border-emerald-500/40 bg-slate-900/90 flex flex-col justify-between shadow-2xl">
          <div>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="emerald" pulse>
                  LIVE FINANCIAL TELEMETRY
                </Badge>
                <DisclaimerBadge tag="ILLUSTRATIVE_CALCULATION" />
              </div>
              <CardTitle className="text-xl mt-2">Projected Economic Recapture</CardTitle>
            </CardHeader>

            <div className="space-y-4 my-4 font-mono text-xs">
              <div className="flex justify-between items-center p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                <span className="text-red-400 font-semibold uppercase">
                  Current Waste Cost Liability (Landfill)
                </span>
                <span className="text-lg font-bold text-red-400">
                  ₹{Math.round(results.currentWasteLiability).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl">
                <span className="text-slate-300 font-semibold uppercase">
                  Total Mechanical Processing Overheads
                </span>
                <span className="text-lg font-bold text-amber-400">
                  ₹{Math.round(results.totalProcessingCost).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl">
                <span className="text-slate-300 font-semibold uppercase">
                  Expected Gross Product Revenue
                </span>
                <span className="text-lg font-bold text-emerald-400">
                  ₹{Math.round(results.expectedGrossRevenue).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="text-emerald-300 font-semibold uppercase">
                  Projected Net Commercial Yield
                </span>
                <span className="text-lg font-bold text-emerald-300">
                  ₹{Math.round(results.netEconomicYield).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Big Headline Recaptured Metric */}
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] text-white mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold tracking-widest text-emerald-100">
                  Total Asset Value Recaptured
                </span>
                <Sparkles className="w-5 h-5 text-emerald-200" />
              </div>
              <p className="text-4xl sm:text-5xl font-black mt-2 font-sans tracking-tight">
                ₹{Math.round(results.totalValueRecaptured).toLocaleString()}
              </p>
              <p className="text-[10px] font-mono text-emerald-100/80 mt-1">
                Combines eliminated landfill surcharges + net finished paver product sales.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Formula: Net Yield = (Mass × Yield% × Resale) - (Mass × Overhead)</span>
            <DisclaimerBadge tag="DEMO_DATA" />
          </div>
        </Card>
      </div>
    </div>
  );
}
