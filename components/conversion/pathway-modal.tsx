"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import { X, CheckCircle2, ShieldCheck, ArrowRight, Layers, Sparkles } from "lucide-react";

export interface PathwayDetail {
  id: string;
  name: string;
  inputMaterial: string;
  secondaryMaterial?: string | null;
  outputProduct: string;
  processingStages: string[] | string;
  potentialMarket: string;
  estimatedValueMin: number;
  estimatedValueMax: number;
  environmentalBenefitDescription: string;
  validationStatus: string;
}

interface PathwayModalProps {
  pathway: PathwayDetail | null;
  onClose: () => void;
  onSelect?: (pathway: PathwayDetail) => void;
}

export function PathwayModal({ pathway, onClose, onSelect }: PathwayModalProps) {
  if (!pathway) return null;

  const stages = Array.isArray(pathway.processingStages)
    ? pathway.processingStages
    : typeof pathway.processingStages === "string" && pathway.processingStages.startsWith("[")
    ? JSON.parse(pathway.processingStages)
    : pathway.processingStages.split(",").map((s) => s.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="emerald">{pathway.validationStatus}</Badge>
          <DisclaimerBadge tag="REQUIRES_LABORATORY_VALIDATION" />
        </div>

        <h3 className="text-2xl font-bold text-white tracking-tight">{pathway.name}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              Primary Input Byproduct
            </span>
            <p className="text-base font-bold text-white mt-0.5">{pathway.inputMaterial}</p>
            {pathway.secondaryMaterial && (
              <p className="text-xs text-emerald-400 font-mono mt-1">
                + Matrix Additive: {pathway.secondaryMaterial}
              </p>
            )}
          </div>

          <div className="p-4 bg-slate-950/70 border border-emerald-500/30 rounded-xl">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
              Target Functional Asset
            </span>
            <p className="text-base font-bold text-emerald-300 mt-0.5">{pathway.outputProduct}</p>
            <p className="text-xs text-slate-400 font-sans mt-1">Market: {pathway.potentialMarket}</p>
          </div>
        </div>

        {/* Processing Stages */}
        <div className="my-6">
          <h4 className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider mb-3">
            Industrial Processing Stages
          </h4>
          <div className="space-y-2.5">
            {stages.map((stage: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-300 font-medium">{stage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono">
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Estimated Value Range</span>
            <p className="text-white font-bold text-sm mt-0.5">
              ₹{pathway.estimatedValueMin.toLocaleString()} - ₹{pathway.estimatedValueMax.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Ecological Lifecycle Benefit</span>
            <p className="text-emerald-400 font-medium mt-0.5">{pathway.environmentalBenefitDescription}</p>
          </div>
        </div>

        <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] font-mono text-amber-300">
          Conversion recommendations are prototype estimates and require laboratory validation and regulatory compliance before commercial deployment.
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {onSelect && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onSelect(pathway);
                onClose();
              }}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Select This Pathway
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
