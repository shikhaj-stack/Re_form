import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "emerald" | "blue" | "amber" | "slate" | "red" | "purple" | "teal" | "cyan";
  pulse?: boolean;
}

export function Badge({
  className,
  variant = "emerald",
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    slate: "bg-slate-800 text-slate-400 border-slate-700",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    teal: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };

  const dotColors = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    slate: "bg-slate-400",
    red: "bg-red-500",
    purple: "bg-purple-500",
    teal: "bg-teal-500",
    cyan: "bg-cyan-500",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border select-none tracking-wide",
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={twMerge(
              clsx(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                dotColors[variant]
              )
            )}
          />
          <span
            className={twMerge(
              clsx("relative inline-flex rounded-full h-2 w-2", dotColors[variant])
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
