import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Search,
  ShieldCheck,
  Zap,
  Leaf,
  BarChart3,
  Factory,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";

export default function LandingPage() {
  const visualFlowSteps = [
    {
      num: "01",
      title: "Industrial Waste",
      subtitle: "Byproduct Intake",
      desc: "Foundry silica sand & industrial polymers ingested under custody protocols.",
      icon: <Factory className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: "02",
      title: "Material Analysis",
      subtitle: "82% Recoverability",
      desc: "Composition profiling and non-aqueous decontamination diagnostics.",
      icon: <Layers className="w-5 h-5 text-blue-400" />,
    },
    {
      num: "03",
      title: "Conversion Pathway",
      subtitle: "Compounding Matrix",
      desc: "75:25 Sand-Polymer thermal compounding formulation at 185°C.",
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
    },
    {
      num: "04",
      title: "New Product",
      subtitle: "RE-FORM Paver",
      desc: "Hydraulic compression (45 MPa) into IS 15658 certified construction pavers.",
      icon: <PackageCheck className="w-5 h-5 text-teal-400" />,
    },
    {
      num: "05",
      title: "Market",
      subtitle: "Infrastructure Nodes",
      desc: "Commercial deployment into national highways and municipal paving.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-16">
      {/* ---------------------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative pt-8 pb-12 text-center flex flex-col items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="emerald" pulse>
            INDUSTRIAL CIRCULAR ECONOMY ENGINE
          </Badge>
          <DisclaimerBadge tag="DEMO_DATA" />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
          Turn Industrial Waste Into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            Industrial Value.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mt-6 leading-relaxed">
          A waste-to-wealth platform that helps industries discover, recover, track and monetize the hidden value in their waste streams.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
          <Link href="/journey" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto text-base shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Start Waste Assessment</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <Link href="/process" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
              Explore the Process
            </Button>
          </Link>
        </div>

        {/* Core Philosophical Statement */}
        <div className="mt-12 p-5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl max-w-2xl mx-auto shadow-inner">
          <p className="text-sm sm:text-base font-bold text-emerald-300 italic tracking-wide">
            “RE-FORM doesn&apos;t manage waste. It discovers what waste can become.”
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* VISUAL FLOW BANNER */}
      {/* ---------------------------------------------------------------- */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            THE CIRCULAR VALUE TRANSFORMATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Industrial Waste to Wealth Pathway
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {visualFlowSteps.map((step, idx) => (
            <Card
              key={step.num}
              className="p-6 border-slate-800 bg-slate-900/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-bold text-xs text-slate-500 group-hover:text-emerald-400 transition-colors">
                    STAGE {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {step.title}
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold block mt-0.5">
                  {step.subtitle}
                </span>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>VERIFIED</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* PROTOTYPE DEMO METRICS */}
      {/* ---------------------------------------------------------------- */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Ecosystem Macro Telemetry
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Aggregated circular recovery run-rates across verified pilot facilities.
            </p>
          </div>
          <DisclaimerBadge tag="DEMO_DATA" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Waste Recovery"
            value="82.4"
            unit="%"
            change="Verified conversion yield"
            disclaimer="PROTOTYPE_ESTIMATE"
            icon={<Layers className="w-4 h-4 text-emerald-400" />}
          />
          <MetricCard
            label="Material Reused"
            value="35,290"
            unit="Metric Tons"
            change="Landfill diversion"
            disclaimer="DEMO_DATA"
            icon={<Zap className="w-4 h-4 text-blue-400" />}
          />
          <MetricCard
            label="Potential Value Generated"
            value="14.8"
            unit="Crore INR"
            change="Economic recapture"
            disclaimer="ILLUSTRATIVE_CALCULATION"
            icon={<BarChart3 className="w-4 h-4 text-emerald-400" />}
          />
          <MetricCard
            label="Estimated CO2 Reduction"
            value="42.8"
            unit="Kilo-Tons"
            change="Avoided emissions"
            disclaimer="REQUIRES_LABORATORY_VALIDATION"
            icon={<Leaf className="w-4 h-4 text-teal-400" />}
          />
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* PRIMARY ACTIVE DEMONSTRATION CALLOUT */}
      {/* ---------------------------------------------------------------- */}
      <Card className="p-8 md:p-12 border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/20 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="emerald">ACTIVE RECOVERY VECTOR</Badge>
            <h3 className="text-3xl font-extrabold text-white">
              Foundry Sand + Suitable Waste Plastic → Construction Pavers
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Watch 10,000 kg of foundry sand byproduct transform into 2,450 certified IS 15658 interlocking pavers in under 3 minutes with real-time economic ROI and cryptographic provenance serialization.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold">✓ 82% Recovery Ratio</span>
              <span className="text-blue-400 font-bold">✓ 3,444 kg CO₂e Offset</span>
              <span className="text-amber-400 font-bold">✓ ₹3.82L Gross Value</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
            <Link href="/journey">
              <Button size="lg" variant="primary" className="w-full text-base shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                <Sparkles className="w-4 h-4 mr-2" />
                Launch 3-Min Demo Journey
              </Button>
            </Link>
            <Link href="/product">
              <Button size="lg" variant="secondary" className="w-full text-base">
                View Finished Paver Asset
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
