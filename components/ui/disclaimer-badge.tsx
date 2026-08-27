import * as React from "react";
import { DisclaimerTag } from "@/types";
import { AlertTriangle, Info } from "lucide-react";

export interface DisclaimerBadgeProps {
  tag?: DisclaimerTag | string;
  className?: string;
}

export function DisclaimerBadge({
  tag = "PROTOTYPE_ESTIMATE",
  className = "",
}: DisclaimerBadgeProps) {
  const labels: Record<string, { text: string; icon: React.ReactNode }> = {
    DEMO_DATA: {
      text: "Demo Data",
      icon: <Info className="w-3 h-3" />,
    },
    PROTOTYPE_ESTIMATE: {
      text: "Prototype Estimate",
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    ILLUSTRATIVE_CALCULATION: {
      text: "Illustrative Calculation",
      icon: <Info className="w-3 h-3" />,
    },
    REQUIRES_LABORATORY_VALIDATION: {
      text: "Requires Laboratory Validation",
      icon: <AlertTriangle className="w-3 h-3 text-amber-400" />,
    },
    REQUIRES_REGULATORY_COMPLIANCE: {
      text: "Requires Regulatory Compliance",
      icon: <AlertTriangle className="w-3 h-3 text-amber-400" />,
    },
  };

  const item = labels[tag] || {
    text: tag.replace(/_/g, " "),
    icon: <AlertTriangle className="w-3 h-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider select-none ${className}`}
    >
      {item.icon}
      <span>{item.text}</span>
    </span>
  );
}
