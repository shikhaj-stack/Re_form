"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import {
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Factory,
} from "lucide-react";

export default function AssessmentPage() {
  const [formData, setFormData] = useState({
    wasteType: "Foundry Sand",
    quantityMonthly: 10000,
    unit: "kg/month",
    location: "Indore, Madhya Pradesh",
    frequency: "Continuous",
    contamination: "Low",
    disposalMethod: "Landfill Storage",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || "Assessment computation failed.");
        setIsLoading(false);
        return;
      }

      setAssessmentResult(data.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to execute assessment engine request.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="emerald">FACTORY OPERATOR INTAKE</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Factory Byproduct Assessment Engine
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Register active manufacturing byproducts to determine material recoverability ratios and optimal circular conversion pathways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assessment Intake Form (Left 2 Cols) */}
        <div className="lg:col-span-2">
          <Card className="border-emerald-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Factory className="w-5 h-5 text-emerald-400" />
                  <span>Material Intake Parameters</span>
                </CardTitle>
                <CardDescription>
                  Strict client & server-side Zod validation applied.
                </CardDescription>
              </div>
              <DisclaimerBadge tag="REQUIRES_LABORATORY_VALIDATION" />
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Waste Type"
                  value={formData.wasteType}
                  onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                >
                  <option value="Foundry Sand">Foundry Sand</option>
                  <option value="Plastic Scrap">Plastic Scrap</option>
                  <option value="Textile Waste">Textile Waste</option>
                  <option value="Glass Waste">Glass Waste</option>
                  <option value="Fly Ash">Fly Ash</option>
                  <option value="Metal Scrap">Metal Scrap</option>
                </Select>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                    Quantity (kg/month)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={formData.quantityMonthly}
                      onChange={(e) =>
                        setFormData({ ...formData, quantityMonthly: parseFloat(e.target.value) || 0 })
                      }
                      required
                    />
                    <span className="px-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-400 flex items-center justify-center">
                      kg/mo
                    </span>
                  </div>
                </div>

                <Input
                  label="Facility Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Indore, Madhya Pradesh"
                  required
                />

                <Select
                  label="Generation Frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="Continuous">Continuous Output</option>
                  <option value="Batch">Batch Scheduled</option>
                  <option value="Weekly">Weekly Cycle</option>
                  <option value="Monthly">Monthly Cycle</option>
                </Select>

                <Select
                  label="Contamination Index"
                  value={formData.contamination}
                  onChange={(e) => setFormData({ ...formData, contamination: e.target.value })}
                >
                  <option value="Low">Low (Directly Recoverable)</option>
                  <option value="Moderate">Moderate (Requires Screening)</option>
                  <option value="High">High (Requires Thermal/Chemical Treatment)</option>
                  <option value="Highly Complex">Highly Complex</option>
                </Select>

                <Select
                  label="Current Disposal Methodology"
                  value={formData.disposalMethod}
                  onChange={(e) => setFormData({ ...formData, disposalMethod: e.target.value })}
                >
                  <option value="Landfill Storage">Landfill Storage</option>
                  <option value="Incineration">Incineration</option>
                  <option value="Outsourced Hauling">Outsourced Hauling</option>
                </Select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={isLoading}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run Material Assessment Engine
                </Button>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Secure Parameterized Processing</span>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Assessment Output Vector Card (Right 1 Col) */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col justify-between border-emerald-500/30 bg-slate-900/90 relative overflow-hidden">
            <div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald" pulse>
                    {assessmentResult ? "ASSESSMENT READY" : "TELEMETRY IDLE"}
                  </Badge>
                  <DisclaimerBadge tag="PROTOTYPE_ESTIMATE" />
                </div>
                <CardTitle className="text-lg mt-2">Conversion Recommendation</CardTitle>
              </CardHeader>

              {assessmentResult ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                      Material Tracked
                    </span>
                    <p className="text-xl font-bold text-white mt-0.5">{assessmentResult.wasteType}</p>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      Verified Recoverability Ratio
                    </span>
                    <p className="text-4xl font-extrabold text-emerald-400 mt-1 font-sans">
                      {assessmentResult.recoverabilityPercent}%{" "}
                      <span className="text-xs font-normal text-slate-400">(Estimated)</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                      Recommended Conversion Pathway
                    </span>
                    <p className="text-sm font-semibold text-slate-200 mt-1">
                      {assessmentResult.recommendedPathway}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                      Target Downstream Asset
                    </span>
                    <p className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      {assessmentResult.targetProduct}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                        Gross Potential Value
                      </span>
                      <p className="text-lg font-bold text-emerald-400 font-mono">
                        ₹{assessmentResult.estGrossValue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                        Avoided Carbon
                      </span>
                      <p className="text-lg font-bold text-slate-200 font-mono">
                        {assessmentResult.estCo2OffsetKg.toLocaleString()} kg CO2e
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                  <Layers className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="text-sm font-medium text-slate-400">
                    Submit the form to compute recoverability models.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500">
              Disclaimer: Illustrative estimation. All pathways require chemical laboratory certification before industrial manufacturing.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
