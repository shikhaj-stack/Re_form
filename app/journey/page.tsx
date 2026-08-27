"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import { PathwayModal, PathwayDetail } from "@/components/conversion/pathway-modal";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Calculator,
  Layers,
  Search,
  Store,
  PackageCheck,
  Clock,
  Building2,
  MapPin,
  Leaf,
  Activity,
  Cpu,
  RefreshCw,
  Droplets,
  Globe2,
} from "lucide-react";

export default function GuidedJourneyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Step 1 State: Assessment
  const [wasteForm, setWasteForm] = useState({
    wasteType: "Foundry Sand",
    quantity: 10000,
    unit: "KG",
    location: "Indore, Madhya Pradesh",
    frequency: "Monthly",
    contamination: "Medium",
    disposalMethod: "Landfill / External Disposal",
  });
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any>({
    material: "Foundry Sand",
    recoverabilityPercent: 82,
    recommendedPathway: "Construction Material",
    potentialProduct: "Interlocking Paver Blocks",
    paversCount: 2450,
    disclaimer:
      "Prototype estimate only. This assessment is not a laboratory result and requires material testing and engineering validation.",
  });

  // Step 2 State: Pathway Modal
  const [selectedPathwayModal, setSelectedPathwayModal] = useState<PathwayDetail | null>(null);

  // Step 3 State: Economic Calculator
  const [econParams, setEconParams] = useState({
    wasteQuantity: 10000,
    currentDisposalCost: 15,
    processingCost: 8,
    expectedProductOutput: 8500,
    productSellingPrice: 45,
  });
  const [econResults, setEconResults] = useState({
    currentWasteCost: 150000,
    processingCostTotal: 80000,
    potentialProductRevenue: 382500,
    estimatedNetValue: 302500,
    potentialValueRecovered: 452500,
  });

  // Step 4 State: Batch Creation
  const [createdBatch, setCreatedBatch] = useState<any>({
    batchCode: "RF-2026-001",
    quantity: 10000,
    unit: "KG",
    targetProduct: "RE-FORM Paver",
    status: "GENERATED",
    shaSignature: "8f4a...9c2e...prototype",
    timestamp: new Date().toISOString(),
  });

  // Step 7 State: Marketplace action trigger
  const [marketplaceNotif, setMarketplaceNotif] = useState<string | null>(null);

  // Recalculate economics whenever inputs change
  useEffect(() => {
    const currentWasteCost = Math.round(econParams.wasteQuantity * econParams.currentDisposalCost);
    const processingCostTotal = Math.round(econParams.wasteQuantity * econParams.processingCost);
    const potentialProductRevenue = Math.round(econParams.expectedProductOutput * econParams.productSellingPrice);
    const estimatedNetValue = potentialProductRevenue - processingCostTotal;
    const potentialValueRecovered = estimatedNetValue + currentWasteCost;

    setEconResults({
      currentWasteCost,
      processingCostTotal,
      potentialProductRevenue,
      estimatedNetValue,
      potentialValueRecovered,
    });
  }, [econParams]);

  const handleQuickAutofill = () => {
    setWasteForm({
      wasteType: "Foundry Sand",
      quantity: 10000,
      unit: "KG",
      location: "Indore, Madhya Pradesh",
      frequency: "Monthly",
      contamination: "Medium",
      disposalMethod: "Landfill / External Disposal",
    });
  };

  const handleRunAssessment = () => {
    setIsAssessing(true);
    setTimeout(() => {
      setIsAssessing(false);
      setAssessmentData({
        material: wasteForm.wasteType,
        recoverabilityPercent: wasteForm.wasteType === "Foundry Sand" ? 82 : 88,
        recommendedPathway: "Construction Material (Composite Paver)",
        potentialProduct: "Interlocking Paver Blocks (IS 15658)",
        paversCount: Math.round((wasteForm.quantity * 0.82) / 3.5),
        disclaimer:
          "Prototype estimate only. This assessment is not a laboratory result and requires material testing and engineering validation.",
      });
    }, 900);
  };

  const handleCreateBatch = () => {
    setCreatedBatch({
      batchCode: "RF-2026-001",
      quantity: wasteForm.quantity,
      unit: wasteForm.unit,
      targetProduct: "RE-FORM Paver",
      status: "PROCESSED",
      shaSignature: "8f4a39b2c1d0...9c2e4f7a...prototype",
      timestamp: new Date().toISOString(),
    });
    setCurrentStep(5);
  };

  const journeySteps = [
    { num: 1, label: "Assessment", icon: <Layers className="w-4 h-4" /> },
    { num: 2, label: "Conversion", icon: <Cpu className="w-4 h-4" /> },
    { num: 3, label: "Economic ROI", icon: <Calculator className="w-4 h-4" /> },
    { num: 4, label: "Create Batch", icon: <ShieldCheck className="w-4 h-4" /> },
    { num: 5, label: "Provenance", icon: <Search className="w-4 h-4" /> },
    { num: 6, label: "Impact", icon: <Leaf className="w-4 h-4" /> },
    { num: 7, label: "Final Product", icon: <PackageCheck className="w-4 h-4" /> },
  ];

  const expansionPathways: PathwayDetail[] = [
    {
      id: "p1",
      name: "Foundry Sand + Waste Plastic → Recycled Construction Pavers",
      inputMaterial: "Foundry Sand (75%)",
      secondaryMaterial: "HDPE/PP Waste Plastic (25%)",
      outputProduct: "RE-FORM Interlocking Construction Pavers",
      processingStages: [
        "Hopper intake & magnetic tramp separation",
        "Non-aqueous mechanical abrasive scrubbing",
        "Polymer micro-granulation (2mm)",
        "Twin-screw thermal compounding at 185°C",
        "Hydraulic compression moulding at 45 MPa",
        "IS 15658 compressive strength validation",
      ],
      potentialMarket: "National Highway Authority & Urban Paving",
      estimatedValueMin: 350000,
      estimatedValueMax: 420000,
      environmentalBenefitDescription: "Avoids 0.42 kg CO2e per kg concrete displaced; zero water consumption.",
      validationStatus: "PROTOTYPE",
    },
    {
      id: "p2",
      name: "Plastic Scrap → Composite Structural Lumber",
      inputMaterial: "PET/HDPE Plastic Scrap",
      secondaryMaterial: "Mineral aggregate filler",
      outputProduct: "Composite Structural Profiles & Sleepers",
      processingStages: "Optical sorting, shredding, twin-screw profile extrusion, water-bath calibration.",
      potentialMarket: "Civil Infrastructure & Rail",
      estimatedValueMin: 120000,
      estimatedValueMax: 150000,
      environmentalBenefitDescription: "Offsets 2.1 kg CO2e per kg virgin plastic displaced.",
      validationStatus: "PROTOTYPE",
    },
    {
      id: "p3",
      name: "Textile Waste → Acoustic Panels",
      inputMaterial: "Industrial Cotton & Synthetic Offcuts",
      secondaryMaterial: "Thermoset bonding resin",
      outputProduct: "High-Density Acoustic Insulation Panels",
      processingStages: "Mechanical rotary shredding, dry air-laying, thermo-bonding compression.",
      potentialMarket: "Architecture & Automotive Interiors",
      estimatedValueMin: 400000,
      estimatedValueMax: 600000,
      environmentalBenefitDescription: "Zero-effluent mechanical dry reclamation.",
      validationStatus: "REQUIRES_VALIDATION",
    },
    {
      id: "p4",
      name: "Glass Waste → Construction Aggregate",
      inputMaterial: "Contaminated Glass Cullet",
      secondaryMaterial: null,
      outputProduct: "Engineered Sand Concrete Aggregate",
      processingStages: "Impact crushing, multi-deck vibratory screening, particulate dust aspiration.",
      potentialMarket: "Ready-Mix Commercial Concrete",
      estimatedValueMin: 80000,
      estimatedValueMax: 100000,
      environmentalBenefitDescription: "Conserves natural riverbed silica ecosystems.",
      validationStatus: "REQUIRES_VALIDATION",
    },
    {
      id: "p5",
      name: "Fly Ash → Building Materials & Green Cement",
      inputMaterial: "Class F Coal Fly Ash",
      secondaryMaterial: "Alkaline activator solution",
      outputProduct: "Zero-Clinker Low-Carbon Structural Cement",
      processingStages: "Alkaline activation, geopolymer slurry blending, accelerated curing.",
      potentialMarket: "Port & Heavy Infrastructure Concrete",
      estimatedValueMin: 200000,
      estimatedValueMax: 250000,
      environmentalBenefitDescription: "80% lower embodied carbon than Portland cement.",
      validationStatus: "REQUIRES_VALIDATION",
    },
    {
      id: "p6",
      name: "Metal Scrap → Recovered Raw Material",
      inputMaterial: "Foundry Slag & Ferrous Turnings",
      secondaryMaterial: null,
      outputProduct: "Secondary Foundry Raw Alloy Billets",
      processingStages: "High-gradient magnetic separation, electric induction melting, ingot casting.",
      potentialMarket: "Automotive Casting & Tooling",
      estimatedValueMin: 180000,
      estimatedValueMax: 220000,
      environmentalBenefitDescription: "95% energy reduction vs virgin ore smelting.",
      validationStatus: "PROTOTYPE",
    },
  ];

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Top Banner: Persistent Journey Stepper */}
      <Card className="p-6 border-emerald-500/30 bg-slate-900/90 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" pulse>
                GUIDED 3-MINUTE DEMONSTRATION
              </Badge>
              <DisclaimerBadge tag="DEMO_DATA" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              End-to-End Waste to Wealth Journey
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Trace: 10,000 kg Foundry Sand → Material Assessment → Conversion → Batch Provenance → Paver Asset.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              disabled={currentStep === totalSteps}
            >
              <span>Next Stage</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Horizontal Progress Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-4">
          {journeySteps.map((step) => {
            const isDone = step.num < currentStep;
            const isCurrent = step.num === currentStep;

            return (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? "bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : isDone
                    ? "bg-slate-950/80 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold">STAGE 0{step.num}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ) : null}
                </div>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-xs">
                  {step.icon}
                  <span className="truncate">{step.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* STAGE 1: WASTE ASSESSMENT JOURNEY */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Left Form (2 cols) */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-emerald-500/30 bg-slate-900/90">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-6 h-6 text-emerald-400" />
                    <span>Waste Registration & Intake</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Register active manufacturing byproducts to determine material recoverability.
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={handleQuickAutofill}>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  Pre-populate Demo Stream
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Select
                  label="Waste Type"
                  value={wasteForm.wasteType}
                  onChange={(e) => setWasteForm({ ...wasteForm, wasteType: e.target.value })}
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
                  <Input
                    type="number"
                    value={wasteForm.quantity}
                    onChange={(e) =>
                      setWasteForm({ ...wasteForm, quantity: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                <Input
                  label="Location"
                  value={wasteForm.location}
                  onChange={(e) => setWasteForm({ ...wasteForm, location: e.target.value })}
                />

                <Select
                  label="Generation Frequency"
                  value={wasteForm.frequency}
                  onChange={(e) => setWasteForm({ ...wasteForm, frequency: e.target.value })}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Continuous">Continuous</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Batch">Batch</option>
                </Select>

                <Select
                  label="Contamination Level"
                  value={wasteForm.contamination}
                  onChange={(e) => setWasteForm({ ...wasteForm, contamination: e.target.value })}
                >
                  <option value="Medium">Medium (Requires screening)</option>
                  <option value="Low">Low (Directly Recoverable)</option>
                  <option value="High">High (Requires thermal wash)</option>
                </Select>

                <Select
                  label="Current Disposal Method"
                  value={wasteForm.disposalMethod}
                  onChange={(e) => setWasteForm({ ...wasteForm, disposalMethod: e.target.value })}
                >
                  <option value="Landfill / External Disposal">Landfill / External Disposal</option>
                  <option value="Incineration">Incineration</option>
                  <option value="Outsourced Hauling">Outsourced Hauling</option>
                </Select>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                <Button size="lg" variant="primary" onClick={handleRunAssessment} isLoading={isAssessing}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run Assessment Engine
                </Button>
                <DisclaimerBadge tag="REQUIRES_LABORATORY_VALIDATION" />
              </div>
            </Card>
          </div>

          {/* Right Card: Assessment Result (1 col) */}
          <div className="lg:col-span-1">
            <Card className="h-full border-emerald-500/40 bg-slate-900/90 p-6 flex flex-col justify-between relative overflow-hidden">
              {isAssessing ? (
                <div className="py-24 text-center flex flex-col items-center justify-center">
                  <Activity className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                  <p className="text-sm font-bold text-white">Analyzing Material Recoverability...</p>
                  <span className="text-xs text-slate-400 font-mono mt-1">Cross-referencing CPCB standards</span>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <Badge variant="emerald" pulse>
                        ASSESSMENT COMPLETE
                      </Badge>
                      <DisclaimerBadge tag="PROTOTYPE_ESTIMATE" />
                    </div>

                    <div className="space-y-4 my-6">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                          Material
                        </span>
                        <h4 className="text-xl font-black text-white">{assessmentData.material}</h4>
                      </div>

                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                          Estimated Recoverability
                        </span>
                        <p className="text-4xl font-black text-emerald-400 font-sans mt-0.5">
                          {assessmentData.recoverabilityPercent}%
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                          Recommended Pathway
                        </span>
                        <p className="text-sm font-bold text-white mt-0.5">
                          {assessmentData.recommendedPathway}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                          Potential Product
                        </span>
                        <p className="text-base font-bold text-emerald-300 mt-0.5">
                          {assessmentData.potentialProduct}
                        </p>
                        <span className="text-[11px] font-mono text-slate-400 block mt-1">
                          Yield: ~{assessmentData.paversCount?.toLocaleString()} finished units
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono text-slate-400 leading-relaxed p-3 bg-slate-950/60 rounded-lg border border-slate-800 mb-6">
                      “{assessmentData.disclaimer}”
                    </p>

                    <Button
                      size="lg"
                      variant="primary"
                      className="w-full"
                      onClick={() => setCurrentStep(2)}
                    >
                      <span>View Conversion Pathway</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: CONVERSION ENGINE */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-8 animate-fade-in">
          {/* Active Conversion Banner */}
          <Card className="p-8 md:p-12 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20 shadow-2xl relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="emerald" className="mb-2">
                WHAT CAN YOUR WASTE BECOME?
              </Badge>
              <h3 className="text-3xl font-extrabold text-white">Active Conversion Matrix</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Primary Vector: 10,000 kg Foundry Sand + Suitable Waste Plastic → RE-FORM Paver.
              </p>
            </div>

            {/* 6 Step Linear Progression Diagram */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
              {[
                { title: "Foundry Sand + Plastic", sub: "Input Byproducts", icon: <Layers className="w-5 h-5 text-emerald-400" /> },
                { title: "Processing", sub: "Screening & Wash", icon: <Activity className="w-5 h-5 text-blue-400" /> },
                { title: "Mixing / Formulation", sub: "185°C Compounding", icon: <Cpu className="w-5 h-5 text-purple-400" /> },
                { title: "Moulding", sub: "45 MPa Compression", icon: <Zap className="w-5 h-5 text-amber-400" /> },
                { title: "Testing", sub: "IS 15658 Audit", icon: <ShieldCheck className="w-5 h-5 text-teal-400" /> },
                { title: "RE-FORM Paver", sub: "High-Margin Asset", icon: <PackageCheck className="w-5 h-5 text-emerald-400" /> },
              ].map((item, idx, arr) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between relative group hover:border-emerald-500/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">0{idx + 1}</span>
                    {item.icon}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span>
                “Conversion recommendations are prototype estimates and require laboratory validation and regulatory compliance before commercial deployment.”
              </span>
              <Button size="sm" variant="primary" onClick={() => setCurrentStep(3)}>
                <span>Calculate Economic Value</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Future Expansion Pathways Catalog */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800">
              <h4 className="text-xl font-bold text-white">Cross-Sector Expansion Pathways</h4>
              <span className="text-xs font-mono text-slate-400">Click any pathway to inspect stages</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expansionPathways.map((pathway) => (
                <Card
                  key={pathway.id}
                  className="p-6 border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex flex-col justify-between group"
                  onClick={() => setSelectedPathwayModal(pathway)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="slate">{pathway.validationStatus}</Badge>
                      <span className="text-[10px] font-mono text-emerald-400 group-hover:underline">
                        Inspect Specs →
                      </span>
                    </div>
                    <h5 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {pathway.name}
                    </h5>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {pathway.environmentalBenefitDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs font-mono">
                    <span className="text-slate-500">Valuation:</span>
                    <span className="text-emerald-400 font-bold">
                      ₹{pathway.estimatedValueMin.toLocaleString()} - ₹{pathway.estimatedValueMax.toLocaleString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: ECONOMIC VALUE CALCULATOR */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          <Card className="p-8 border-slate-800 bg-slate-900/90">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-emerald-400" />
                  <span>Interactive ROI Calculator</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Adjust parameter variables to simulate commercial value recapture.
                </p>
              </div>
              <DisclaimerBadge tag="ILLUSTRATIVE_CALCULATION" />
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label className="font-semibold text-slate-300">Waste Quantity (KG)</label>
                  <span className="text-emerald-400 font-bold">{econParams.wasteQuantity.toLocaleString()} kg</span>
                </div>
                <Input
                  type="number"
                  value={econParams.wasteQuantity}
                  onChange={(e) => setEconParams({ ...econParams, wasteQuantity: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label className="font-semibold text-slate-300">Current Disposal Cost (₹/kg)</label>
                  <span className="text-red-400 font-bold">₹{econParams.currentDisposalCost} / kg</span>
                </div>
                <Input
                  type="number"
                  value={econParams.currentDisposalCost}
                  onChange={(e) => setEconParams({ ...econParams, currentDisposalCost: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label className="font-semibold text-slate-300">Processing Cost (₹/kg)</label>
                  <span className="text-amber-400 font-bold">₹{econParams.processingCost} / kg</span>
                </div>
                <Input
                  type="number"
                  value={econParams.processingCost}
                  onChange={(e) => setEconParams({ ...econParams, processingCost: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label className="font-semibold text-slate-300">Expected Product Output (Units)</label>
                  <span className="text-blue-400 font-bold">{econParams.expectedProductOutput.toLocaleString()} units</span>
                </div>
                <Input
                  type="number"
                  value={econParams.expectedProductOutput}
                  onChange={(e) => setEconParams({ ...econParams, expectedProductOutput: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label className="font-semibold text-slate-300">Product Selling Price (₹/unit)</label>
                  <span className="text-emerald-400 font-bold">₹{econParams.productSellingPrice} / unit</span>
                </div>
                <Input
                  type="number"
                  value={econParams.productSellingPrice}
                  onChange={(e) => setEconParams({ ...econParams, productSellingPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </Card>

          {/* Right: Projected Yield Output */}
          <Card className="p-8 border-emerald-500/40 bg-slate-900/90 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <Badge variant="emerald" pulse>
                  SIMULATION TELEMETRY
                </Badge>
                <DisclaimerBadge tag="ILLUSTRATIVE_CALCULATION" />
              </div>

              <div className="space-y-4 my-6 font-mono text-xs">
                <div className="flex justify-between items-center p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <span className="text-red-400 font-semibold uppercase">Current Waste Cost (Landfill)</span>
                  <span className="text-lg font-bold text-red-400">₹{econResults.currentWasteCost.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl">
                  <span className="text-slate-300 font-semibold uppercase">Processing Cost</span>
                  <span className="text-lg font-bold text-amber-400">₹{econResults.processingCostTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl">
                  <span className="text-slate-300 font-semibold uppercase">Potential Product Revenue</span>
                  <span className="text-lg font-bold text-emerald-400">₹{econResults.potentialProductRevenue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <span className="text-emerald-300 font-semibold uppercase">Estimated Net Value</span>
                  <span className="text-lg font-bold text-emerald-300">₹{econResults.estimatedNetValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Big Recaptured Number */}
              <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.3)] text-white">
                <span className="text-xs font-mono uppercase font-bold tracking-widest text-emerald-100 block">
                  Potential Value Recovered
                </span>
                <p className="text-4xl sm:text-5xl font-black mt-1 font-sans">
                  ₹{econResults.potentialValueRecovered.toLocaleString()}
                </p>
                <p className="text-[10px] font-mono text-emerald-100/80 mt-1">
                  Formula: Net Value + Eliminated Landfill Disposal Liability
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800">
              <p className="text-[11px] font-mono text-slate-400 mb-4">
                “Illustrative prototype calculation — not a commercial quotation.”
              </p>
              <Button size="lg" variant="primary" className="w-full" onClick={() => setCurrentStep(4)}>
                <span>Create Traceable Batch</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: CREATE BATCH CONFIRMATION */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="max-w-3xl mx-auto w-full animate-fade-in">
          <Card className="p-8 sm:p-12 border-emerald-500/40 bg-slate-900/90 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>

            <Badge variant="emerald" className="mb-3">
              LEDGER INSCRIPTION INITIATED
            </Badge>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Create Traceable Material Batch
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-lg mx-auto">
              Serialize 10,000 kg Foundry Sand byproduct into an immutable digital provenance record.
            </p>

            <div className="my-8 p-6 bg-slate-950 rounded-2xl border border-slate-800 text-left font-mono text-xs space-y-3">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Assigned Batch Code</span>
                <span className="font-bold text-emerald-400 text-sm">RF-2026-001</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Origin Facility</span>
                <span className="font-bold text-white">Demo Foundry Pvt. Ltd. (Indore)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Verified Mass</span>
                <span className="font-bold text-white">10,000 KG Silica Sand</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Assigned Processor</span>
                <span className="font-bold text-blue-400">EcoMat Converters Ltd. (Bhopal)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Simulated Hash Digest</span>
                <span className="font-bold text-emerald-300">8f4a...9c2e...prototype</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400 mb-8 text-left">
              “Prototype digital provenance record. Blockchain or distributed ledger integration can be added for production traceability.”
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="outline" className="flex-1" onClick={() => setCurrentStep(3)}>
                Back to Valuation
              </Button>
              <Button size="lg" variant="primary" className="flex-1" onClick={handleCreateBatch}>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirm & Track Batch
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 5: BATCH TRACKING & PROVENANCE TIMELINE */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Left: Metadata */}
          <div className="lg:col-span-1">
            <Card className="h-full p-6 border-emerald-500/30 bg-slate-900/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      Batch Identifier
                    </span>
                    <h4 className="text-2xl font-black text-white font-mono">RF-2026-001</h4>
                  </div>
                  <Badge variant="emerald" pulse>
                    PROCESSED
                  </Badge>
                </div>

                <div className="space-y-3 my-6 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Source Industry</span>
                    <span className="text-white font-bold">Demo Foundry Pvt. Ltd.</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Waste Type</span>
                    <span className="text-emerald-400 font-bold">Foundry Sand</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Quantity</span>
                    <span className="text-white font-bold">10,000 KG</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Collection Date</span>
                    <span className="text-white">Aug 26, 2026</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Processing Unit</span>
                    <span className="text-blue-400 font-bold">EcoMat Converters</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Conversion Pathway</span>
                    <span className="text-white">Construction Paver</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Product Batch</span>
                    <span className="text-emerald-300 font-bold">RE-FORM Paver</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Testing Status</span>
                    <span className="text-emerald-400 font-bold">Passed IS 15658</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Destination</span>
                    <span className="text-white">NHAI Sector 4</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono">
                <span className="text-slate-500 uppercase block text-[10px] font-bold">Record Hash</span>
                <span className="text-emerald-400 font-bold break-all">8f4a...9c2e...prototype</span>
              </div>
            </Card>
          </div>

          {/* Right: 6-Stage Timeline */}
          <div className="lg:col-span-2">
            <Card className="h-full p-8 border-slate-800 bg-slate-900/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span>Material Provenance Timeline</span>
                  </h4>
                  <DisclaimerBadge tag="DEMO_DATA" />
                </div>

                <div className="relative pl-6 space-y-6">
                  <div className="absolute top-2 bottom-2 left-2.5 w-0.5 bg-emerald-500/20" />

                  {[
                    { stage: "Waste Generated", desc: "10,000 kg foundry silica sand generated from casting line 2.", hash: "0x8f4c...05c" },
                    { stage: "Collected", desc: "Hopper trailer sealed and dispatched under chain of custody.", hash: "0x1a2b...7a8" },
                    { stage: "Processed", desc: "Magnetic rare-earth screening & dry non-aqueous scrubbing.", hash: "0x9c8b...3c2" },
                    { stage: "Converted", desc: "2,450 interlocking paver blocks compressed at 45 MPa (185°C).", hash: "0x7e6d...1e0" },
                    { stage: "Tested", desc: "IS 15658 compression test: 48.2 MPa. Grade A cleared.", hash: "0x2c3d...8c9" },
                    { stage: "Sold", desc: "Dispatched to National Highway Authority Project Sector 4.", hash: "0x4f5e...b1c" },
                  ].map((ev, idx) => (
                    <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="absolute -left-6 w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] ring-4 ring-emerald-500/20" />
                      <div>
                        <span className="font-bold text-white text-sm uppercase font-mono">{ev.stage}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{ev.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 flex-shrink-0">
                        {ev.hash}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">All 6 custody stages validated</span>
                <Button size="sm" variant="primary" onClick={() => setCurrentStep(6)}>
                  <span>View Environmental Impact</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 6: ENVIRONMENTAL IMPACT */}
      {/* ========================================================================= */}
      {currentStep === 6 && (
        <div className="space-y-8 animate-fade-in">
          {/* Before vs After Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-red-500/30 bg-slate-900/90 relative overflow-hidden">
              <Badge variant="red" className="mb-4">
                BEFORE RE-FORM
              </Badge>
              <h4 className="text-2xl font-black text-white">Linear Disposal Baseline</h4>
              <p className="text-xs text-slate-400 font-mono mt-1 mb-8">
                Raw material dumped into open landfills; permanent resource dissipation.
              </p>

              <div className="flex items-center justify-center gap-4 py-8">
                <div className="px-6 py-4 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white">
                  Waste Byproduct
                </div>
                <ArrowRight className="w-6 h-6 text-red-400" />
                <div className="px-6 py-4 bg-red-500/20 border border-red-500/40 rounded-xl text-sm font-bold text-red-400">
                  Landfill Dumping
                </div>
              </div>
              <p className="text-xs text-red-400 font-mono text-center mt-4">
                100% Resource Lost • Ongoing Storage Surcharge
              </p>
            </Card>

            <Card className="p-8 border-emerald-500/40 bg-slate-900/90 relative overflow-hidden">
              <Badge variant="emerald" className="mb-4" pulse>
                AFTER RE-FORM
              </Badge>
              <h4 className="text-2xl font-black text-white">Closed-Loop Value Loop</h4>
              <p className="text-xs text-slate-400 font-mono mt-1 mb-8">
                Non-aqueous valorization converting silica sand into high-grade civil assets.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 py-4 text-xs font-bold font-mono">
                <span className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white">Waste</span>
                <span>→</span>
                <span className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-400">Recovery</span>
                <span>→</span>
                <span className="px-3 py-2 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-400">Product</span>
                <span>→</span>
                <span className="px-3 py-2 bg-teal-500/20 border border-teal-500/40 rounded-lg text-teal-300">Market</span>
              </div>
              <p className="text-xs text-emerald-400 font-mono text-center mt-4">
                82% Product Yield • High Margin Recapture
              </p>
            </Card>
          </div>

          {/* 4 Core Impact Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Waste Diverted</span>
                <Globe2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white mt-4 font-sans">10,000 kg</p>
              <span className="text-[10px] font-mono text-emerald-400 mt-1">Estimated Prototype Impact</span>
            </Card>

            <Card className="p-6 border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Material Recovered</span>
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-black text-emerald-400 mt-4 font-sans">8,200 kg</p>
              <span className="text-[10px] font-mono text-slate-400 mt-1">Estimated Prototype Impact</span>
            </Card>

            <Card className="p-6 border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Estimated CO₂ Reduction</span>
                <Leaf className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-3xl font-black text-white mt-4 font-sans">3,444 kg</p>
              <span className="text-[10px] font-mono text-emerald-400 mt-1">Estimated Prototype Impact</span>
            </Card>

            <Card className="p-6 border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Products Produced</span>
                <PackageCheck className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-white mt-4 font-sans">2,450 Units</p>
              <span className="text-[10px] font-mono text-slate-400 mt-1">Estimated Prototype Impact</span>
            </Card>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-slate-400">
              Methodology: Comparative Life Cycle Assessment (LCA) vs. Linear Landfill Baseline.
            </span>
            <Button size="sm" variant="primary" onClick={() => setCurrentStep(7)}>
              <span>View Final Product & Marketplace</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 7: FINAL PRODUCT VIEW & MARKETPLACE */}
      {/* ========================================================================= */}
      {currentStep === 7 && (
        <div className="space-y-10 animate-fade-in">
          {marketplaceNotif && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{marketplaceNotif}</span>
            </div>
          )}

          {/* Final Product Showcase Certificate Card */}
          <Card className="p-8 md:p-12 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/30 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="emerald" pulse>
                    FINAL CONVERTED PRODUCT
                  </Badge>
                  <Badge variant="blue">IS 15658 COMPLIANT</Badge>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  RE-FORM Interlocking Construction Paver
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  High-durability structural paving block manufactured from 75% recycled foundry sand and 25% polymer matrix.
                </p>
              </div>

              <div className="flex-shrink-0 text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Certified Batch Code
                </span>
                <p className="text-2xl font-black text-emerald-400 font-mono">RF-2026-001</p>
              </div>
            </div>

            {/* Clear Provenance Chain Flow */}
            <div className="my-8">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider block mb-4">
                Verified Provenance Chain
              </span>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
                <span className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white">
                  Foundry Sand + Waste Plastic
                </span>
                <span className="text-emerald-400">↓</span>
                <span className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                  Processing & Scrubbing
                </span>
                <span className="text-emerald-400">↓</span>
                <span className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                  Thermal Formulation
                </span>
                <span className="text-emerald-400">↓</span>
                <span className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                  Hydraulic Moulding
                </span>
                <span className="text-emerald-400">↓</span>
                <span className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                  Testing Audit
                </span>
                <span className="text-emerald-400">↓</span>
                <span className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 font-black">
                  RE-FORM Paver
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-mono">
              <div>
                <span className="text-slate-500 uppercase text-[10px] block">Source Waste</span>
                <span className="font-bold text-white mt-1 block">10,000 kg Foundry Sand</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] block">Testing Status</span>
                <span className="font-bold text-emerald-400 mt-1 block">Grade A (48.2 MPa)</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] block">Estimated Value</span>
                <span className="font-bold text-white mt-1 block">₹3,82,500 Gross</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] block">Estimated Impact</span>
                <span className="font-bold text-emerald-400 mt-1 block">3,444 kg CO₂e Saved</span>
              </div>
            </div>
          </Card>

          {/* Active Marketplace Directory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Waste Stream Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-lg font-bold text-white">Available Waste Listings</h4>
                <span className="text-xs font-mono text-slate-400">Active Trading Floor</span>
              </div>

              {[
                { type: "Foundry Sand", qty: "10,000 kg", loc: "Indore, MP", status: "Available" },
                { type: "PET Plastic Scrap", qty: "5,000 kg", loc: "Bhopal, MP", status: "Available" },
                { type: "Glass Waste", qty: "3,200 kg", loc: "Vidisha, MP", status: "Available" },
              ].map((w, idx) => (
                <Card key={idx} className="p-4 border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="emerald">{w.status}</Badge>
                      <span className="text-xs font-mono text-slate-400">{w.loc}</span>
                    </div>
                    <h5 className="font-bold text-white text-sm">{w.type}</h5>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{w.qty}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setMarketplaceNotif(`Procurement request submitted for ${w.type} (${w.qty}).`);
                        setTimeout(() => setMarketplaceNotif(null), 3500);
                      }}
                    >
                      Request Material
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Verified Buyers & Processors */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-lg font-bold text-white">Buyers / Processors</h4>
                <span className="text-xs font-mono text-slate-400">CPCB Verified</span>
              </div>

              {[
                {
                  name: "EcoMat Converters Ltd.",
                  accepted: "Foundry Sand, Plastic Scrap",
                  cap: "25,000 kg/mo",
                  loc: "Bhopal, MP",
                  verified: true,
                },
                {
                  name: "GreenTextile Upcycling Hub",
                  accepted: "Textile Waste, Glass Waste",
                  cap: "15,000 kg/mo",
                  loc: "Vidisha, MP",
                  verified: true,
                },
              ].map((p, idx) => (
                <Card key={idx} className="p-4 border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-white text-sm">{p.name}</h5>
                    <Badge variant="blue">CPCB VERIFIED</Badge>
                  </div>
                  <div className="text-xs font-mono text-slate-400 space-y-1 mb-3">
                    <p>Accepted: <span className="text-slate-200">{p.accepted}</span></p>
                    <p>Capacity: <span className="text-emerald-400 font-bold">{p.cap}</span> • Location: {p.loc}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMarketplaceNotif(`Direct communication channel established with ${p.name}.`);
                      setTimeout(() => setMarketplaceNotif(null), 3500);
                    }}
                  >
                    Contact Processor
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-slate-400">
              Demo journey finished in less than 3 minutes.
            </span>
            <Button size="lg" variant="primary" onClick={() => setCurrentStep(1)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Restart 3-Min Demo Journey
            </Button>
          </div>
        </div>
      )}

      {/* Conversion Pathway Detail Modal */}
      <PathwayModal
        pathway={selectedPathwayModal}
        onClose={() => setSelectedPathwayModal(null)}
      />
    </div>
  );
}
