"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SessionUser } from "@/types";
import {
  Recycle,
  LayoutDashboard,
  Layers,
  Cpu,
  GitBranch,
  Search,
  Store,
  Calculator,
  BarChart3,
  ShieldCheck,
  LogOut,
  Sparkles,
  PackageCheck,
  User as UserIcon,
} from "lucide-react";

interface NavbarProps {
  user: SessionUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Overview", href: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Demo Journey", href: "/journey", icon: <Sparkles className="w-4 h-4 text-emerald-400" />, highlight: true },
    { label: "Assessment", href: "/assessment", icon: <Layers className="w-4 h-4" /> },
    { label: "Conversion Matrix", href: "/conversion", icon: <Cpu className="w-4 h-4" /> },
    { label: "Process Graph", href: "/process", icon: <GitBranch className="w-4 h-4" /> },
    { label: "Provenance Ledger", href: "/tracking", icon: <Search className="w-4 h-4" /> },
    { label: "Marketplace", href: "/marketplace", icon: <Store className="w-4 h-4" /> },
    { label: "ROI Calculator", href: "/calculator", icon: <Calculator className="w-4 h-4" /> },
    { label: "Impact", href: "/impact", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "RE-FORM Paver", href: "/product", icon: <PackageCheck className="w-4 h-4 text-teal-400" /> },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({
      label: "Admin",
      href: "/admin",
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
      highlight: false,
    });
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      router.push("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:bg-emerald-500 transition-colors">
            <Recycle className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white leading-none font-sans">
                RE-FORM
              </span>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                B2B PROTOTYPE
              </span>
            </div>
            <span className="text-[9px] uppercase font-mono text-slate-400 tracking-widest font-semibold mt-0.5">
              Industrial Waste to Wealth
            </span>
          </div>
        </Link>

        {/* Navigation Router Links */}
        <nav className="hidden 2xl:flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  item.highlight
                    ? isActive
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Launch CTA & User Account */}
        <div className="flex items-center gap-3">
          <Link href="/journey" className="hidden sm:inline-flex">
            <Button size="sm" variant="primary" className="shadow-[0_0_20px_rgba(16,185,129,0.35)]">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
              <span>3-Min Demo Journey</span>
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-white leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]">
                  {user.organizationName}
                </span>
              </div>
              <Badge variant={user.role === "ADMIN" ? "purple" : user.role === "PROCESSOR" ? "blue" : "emerald"}>
                {user.role}
              </Badge>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Subnav for Tablet/Mobile */}
      <div className="2xl:hidden flex items-center gap-2 px-4 py-2 bg-slate-900/90 border-t border-slate-800 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
