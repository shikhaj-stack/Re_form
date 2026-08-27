import { AlertTriangle, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-850 py-8 px-6 mt-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              RE-FORM B2B Platform
            </span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="text-xs text-slate-500 font-mono">
            v1.0.0 Architecture Prototype
          </span>
        </div>

        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-center md:text-right max-w-2xl">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-[11px] text-amber-300/90 font-mono leading-tight">
            PROTOTYPE NOTICE: Operating in a simulated regulatory sandbox environment. Calculations, batch signatures, and pathway metrics are illustrative and require laboratory & regulatory certification before industrial deployment.
          </p>
        </div>
      </div>
    </footer>
  );
}
