import * as React from "react";
import { DisclaimerBadge } from "./disclaimer-badge";
import { DisclaimerTag } from "@/types";

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  prefix?: string;
  change?: string;
  isPositive?: boolean;
  disclaimer?: DisclaimerTag | string;
  icon?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  unit,
  prefix,
  change,
  isPositive = true,
  disclaimer = "PROTOTYPE_ESTIMATE",
  icon,
}: MetricCardProps) {
  return (
    <div className="bg-surface-dark/90 border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-emerald-500/30 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-1">
          {prefix && (
            <span className="text-2xl font-bold text-emerald-500">{prefix}</span>
          )}
          <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
            {value}
          </span>
          {unit && (
            <span className="text-xs text-slate-400 font-mono ml-1.5">{unit}</span>
          )}
        </div>

        {change && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-mono">
            <span
              className={isPositive ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}
            >
              {isPositive ? "↑ " : "↓ "}
              {change}
            </span>
            <span className="text-slate-500">vs linear disposal baseline</span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <DisclaimerBadge tag={disclaimer} />
      </div>
    </div>
  );
}
