"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import { AdminChartsGrid } from "@/components/admin/admin-charts";
import {
  ShieldCheck,
  Building2,
  Users,
  Layers,
  Search,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  FileText,
  Lock,
  Cpu,
  Store,
  Boxes,
  ArrowUpRight,
  Filter,
  Check,
  X,
  Sliders,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Leaf,
  DollarSign,
  PackageCheck,
  Eye,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "analytics" | "organizations" | "pathways" | "marketplace_batches" | "audit_logs"
  >("analytics");

  // Filter and Search States
  const [orgSearch, setOrgSearch] = useState("");
  const [orgFilter, setOrgFilter] = useState("ALL");
  const [auditSearch, setAuditSearch] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("ALL");
  const [activityTypeFilter, setActivityTypeFilter] = useState("ALL");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message || "Admin authorization required to access this node.");
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }
      setData(json.data);
      setError(null);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (e) {
      setError("Failed to communicate with the administrative compliance cluster.");
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const showFeedback = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleAdminAction = async (action: string, targetId: string, payload: any) => {
    setActionLoadingId(`${action}-${targetId}`);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetId, payload }),
      });
      const json = await res.json();
      if (json.success) {
        showFeedback(json.message || "Administrative action executed and committed to audit log.");
        await fetchAdminData();
      } else {
        alert(json.error?.message || "Action failed");
      }
    } catch (e) {
      console.error("Admin action failed", e);
      alert("Network exception executing administrative change.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleQuickAdminLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@reform.eco",
          password: "Admin1234!",
        }),
      });
      const json = await res.json();
      if (json.success) {
        router.refresh();
        await fetchAdminData();
      } else {
        alert("Failed to authenticate demo admin account.");
        setIsLoading(false);
      }
    } catch {
      alert("Demo admin sign-in request failed.");
      setIsLoading(false);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-6 py-28 text-center flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Activity className="w-8 h-8 animate-spin text-purple-400" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-purple-500/20 blur-lg -z-10 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-white font-sans">Connecting to RE-FORM Admin Node</h2>
        <p className="text-xs text-slate-400 font-mono mt-2">
          Enforcing cryptographic RBAC verification & fetching audit telemetry...
        </p>
      </div>
    );
  }

  // 2. Unauthorized / Error State
  if (error || !data) {
    return (
      <div className="w-full max-w-xl mx-auto my-auto py-24 px-4">
        <Card className="border-red-500/40 bg-slate-950/90 text-center p-8 shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <Lock className="w-7 h-7" />
          </div>
          <Badge variant="red" className="mb-3">
            RESTRICTED ADMIN PRIVILEGE
          </Badge>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied (403 / 401)</h2>
          <p className="text-xs text-slate-400 font-mono mb-6 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            {error || "Only authorized ADMINISTRATOR accounts with network verification keys may access this node."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              variant="primary"
              size="md"
              onClick={handleQuickAdminLogin}
              className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] w-full sm:w-auto"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Sign In as Demo Admin
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto"
            >
              Standard Login
            </Button>
          </div>

          <p className="text-[11px] text-slate-500 mt-6">
            Demo Credentials: <span className="font-mono text-purple-400">admin@reform.eco</span> /{" "}
            <span className="font-mono text-purple-400">Admin1234!</span>
          </p>
        </Card>
      </div>
    );
  }

  // Filtered lists for Admin Tabs
  const filteredOrgs = (data.controls?.organizations || []).filter((org: any) => {
    const matchSearch =
      org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
      org.industryType.toLowerCase().includes(orgSearch.toLowerCase()) ||
      org.location.toLowerCase().includes(orgSearch.toLowerCase());
    const matchFilter =
      orgFilter === "ALL" ? true : org.verificationStatus === orgFilter;
    return matchSearch && matchFilter;
  });

  const filteredAuditLogs = (data.controls?.auditLogs || []).filter((log: any) => {
    const matchSearch =
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.actor?.name || "").toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.actor?.email || "").toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(auditSearch.toLowerCase());
    const matchAction =
      auditActionFilter === "ALL" ? true : log.action === auditActionFilter;
    return matchSearch && matchAction;
  });

  const filteredActivities = (data.recentActivities || []).filter((act: any) => {
    if (activityTypeFilter === "ALL") return true;
    return act.type === activityTypeFilter;
  });

  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
      {/* Action Success Toast Feedback */}
      {actionSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-mono font-medium">{actionSuccessMessage}</span>
        </div>
      )}

      {/* Top Header & Admin Privileged Identity */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="purple" className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SYSTEM AUDIT AUTHORITY</span>
            </Badge>
            <Badge variant="emerald">ADMIN PRIVILEGED</Badge>
            <Badge variant="blue">IMMUTABLE LEDGER</Badge>
            <DisclaimerBadge tag="DEMO_DATA" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Network Administration & Analytics Command Node
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Enterprise multi-tenant oversight, verification governance, lifecycle validation, and real-time security compliance telemetry.
          </p>
        </div>

        {/* Admin Node Badge & Quick Reload */}
        <div className="flex items-center gap-3 self-start lg:self-center">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-right hidden sm:block">
            <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
              Active Security Principal
            </span>
            <span className="text-xs font-bold text-white">
              {data.adminUser?.name} ({data.adminUser?.email})
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchAdminData}
            disabled={isRefreshing}
            className="border-slate-700 hover:border-slate-600"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync Node"}</span>
          </Button>
        </div>
      </div>

      {/* Prototype Metrics Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block font-mono">
              Demo / Prototype Metrics Notice
            </span>
            <p className="text-xs text-slate-300 mt-0.5">
              All macro aggregates, projected CO2 offsets, and economic valuations displayed across this dashboard are computed using baseline prototype algorithms for demonstration and simulation purposes.
            </p>
          </div>
        </div>
        <Badge variant="amber" className="whitespace-nowrap hidden md:inline-flex">
          Demo / Prototype Metrics
        </Badge>
      </div>

      {/* 8 Headline Dashboard Macro Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        {/* Metric 1: Total Registered Industries */}
        <Card className="p-4 border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Industries
            </span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white font-sans">
              {data.stats?.totalIndustries?.value || 0}
            </span>
            <span className="text-[9px] font-mono text-slate-500 block mt-1">
              Demo / Prototype Metrics
            </span>
          </div>
        </Card>

        {/* Metric 2: Total Waste Streams */}
        <Card className="p-4 border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-blue-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Streams
            </span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white font-sans">
              {data.stats?.totalWasteStreams?.value || 0}
            </span>
            <span className="text-[9px] font-mono text-slate-500 block mt-1">
              Demo / Prototype Metrics
            </span>
          </div>
        </Card>

        {/* Metric 3: Total Waste Processed */}
        <Card className="p-4 border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-teal-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Processed
            </span>
            <PackageCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-teal-400 font-sans">
              {data.stats?.totalWasteProcessed?.formatted || "35.0 MT"}
            </span>
            <span className="text-[9px] font-mono text-slate-500 block mt-1">
              Demo / Prototype Metrics
            </span>
          </div>
        </Card>

        {/* Metric 4: Active Pathways */}
        <Card className="p-4 border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-purple-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Pathways
            </span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white font-sans">
              {data.stats?.activePathways?.value || 0} / {data.stats?.activePathways?.total || 0}
            </span>
            <span className="text-[9px] font-mono text-slate-500 block mt-1">
              Demo / Prototype Metrics
            </span>
          </div>
        </Card>

        {/* Metric 5: Total Batches */}
        <Card className="p-4 border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Batches
            </span>
            <Boxes className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white font-sans">
              {data.stats?.totalBatches?.value || 0}
            </span>
            <span className="text-[9px] font-mono text-slate-500 block mt-1">
              Demo / Prototype Metrics
            </span>
          </div>
        </Card>

        {/* Metric 6: Marketplace Transactions */}
        <Card className="p-4 border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Deals
            </span>
            <Store className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white font-sans">
              {data.stats?.marketplaceTransactions?.value || 0}
            </span>
            <span className="text-[9px] font-mono text-slate-500 block mt-1">
              Demo / Prototype Metrics
            </span>
          </div>
        </Card>

        {/* Metric 7: Environmental Impact (CO2 Avoided) */}
        <Card className="p-4 border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
              CO2 Avoided
            </span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-400 font-sans">
              {data.stats?.environmentalImpact?.co2AvoidedTons || 14.8} MT
            </span>
            <span className="text-[9px] font-mono text-emerald-500/80 block mt-1">
              Demo / Prototype Metrics
            </span>
          </div>
        </Card>

        {/* Metric 8: Estimated Revenue / Value Generated */}
        <Card className="p-4 border-purple-500/30 bg-purple-950/20 flex flex-col justify-between hover:border-purple-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-300 uppercase font-bold">
              Ecosystem GMV
            </span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-purple-300 font-sans truncate">
              {data.stats?.revenueGenerated?.formatted || "₹1.48 Cr"}
            </span>
            <span className="text-[9px] font-mono text-purple-400/80 block mt-1">
              Demo / Prototype Metrics
            </span>
          </div>
        </Card>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "analytics"
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Analytics & Visualizations</span>
        </button>

        <button
          onClick={() => setActiveTab("organizations")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "organizations"
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Enterprise Directory ({data.controls?.organizations?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("pathways")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "pathways"
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Conversion Pathways ({data.controls?.pathways?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("marketplace_batches")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "marketplace_batches"
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Marketplace & Batches</span>
        </button>

        <button
          onClick={() => setActiveTab("audit_logs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "audit_logs"
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Audit Ledger & Privacy</span>
          <Badge variant="emerald" pulse className="ml-1 text-[9px] px-1 py-0">
            LIVE
          </Badge>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ANALYTICS & RECENT ACTIVITY                                        */}
      {/* ========================================================================= */}
      {activeTab === "analytics" && (
        <div className="space-y-12 animate-in fade-in-50 duration-300">
          {/* Charts Component */}
          {data.charts && <AdminChartsGrid chartsData={data.charts} />}

          {/* Recent Activity Telemetry Feed */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span>Real-Time Operational Activity Stream</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chronological event pipeline of waste registrations, batch milestones, assessments, and procurement requests.
                </p>
              </div>

              {/* Event Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {["ALL", "BATCH", "WASTE_STREAM", "MARKETPLACE", "AUDIT"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setActivityTypeFilter(type)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                      activityTypeFilter === type
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {filteredActivities.length === 0 ? (
              <Card className="p-8 text-center border-slate-800 bg-slate-900/50 text-slate-500 text-xs font-mono">
                No activity records matched the current filter.
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredActivities.map((act: any) => (
                  <Card
                    key={act.id}
                    className="p-4 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge
                          variant={
                            act.type === "BATCH"
                              ? "emerald"
                              : act.type === "WASTE_STREAM"
                              ? "blue"
                              : act.type === "MARKETPLACE"
                              ? "amber"
                              : "purple"
                          }
                        >
                          {act.badgeText || act.type}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-xs leading-snug">{act.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{act.description}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{act.organizationName || "System"}</span>
                      <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ENTERPRISE DIRECTORY & VERIFICATION CONTROLS                       */}
      {/* ========================================================================= */}
      {activeTab === "organizations" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>Enterprise Verification & Network Governance</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit, authorize, revoke, or suspend participating factories, processors, and municipal recycling nodes.
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input
                  placeholder="Search enterprises..."
                  value={orgSearch}
                  onChange={(e) => setOrgSearch(e.target.value)}
                  className="pl-8 py-1 text-xs h-9"
                />
              </div>
              <select
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-500 h-9"
              >
                <option value="ALL">All Statuses</option>
                <option value="VERIFIED">Verified Only</option>
                <option value="UNVERIFIED">Unverified</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          {/* Organizations Directory Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrgs.map((org: any) => {
              const isVerifying = actionLoadingId === `VERIFY_ORGANIZATION-${org.id}`;
              return (
                <Card
                  key={org.id}
                  className="p-6 border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-base font-bold text-white">{org.name}</h3>
                        <p className="text-xs text-slate-400">{org.industryType}</p>
                      </div>
                      <Badge
                        variant={
                          org.verificationStatus === "VERIFIED"
                            ? "emerald"
                            : org.verificationStatus === "SUSPENDED"
                            ? "red"
                            : "amber"
                        }
                      >
                        {org.verificationStatus}
                      </Badge>
                    </div>

                    <p className="text-xs font-mono text-slate-400 mb-4 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      📍 {org.location}
                    </p>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-4 gap-2 mb-6 text-center">
                      <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">Streams</span>
                        <span className="text-sm font-bold text-white font-mono">{org.stats.wasteStreams}</span>
                      </div>
                      <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">Batches</span>
                        <span className="text-sm font-bold text-white font-mono">{org.stats.batches}</span>
                      </div>
                      <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">Listings</span>
                        <span className="text-sm font-bold text-white font-mono">{org.stats.listings}</span>
                      </div>
                      <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">Users</span>
                        <span className="text-sm font-bold text-white font-mono">{org.stats.users}</span>
                      </div>
                    </div>
                  </div>

                  {/* Administrative Verification Action Controls */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      ID: {org.id.substring(0, 10)}...
                    </span>

                    <div className="flex items-center gap-2">
                      {org.verificationStatus !== "VERIFIED" && (
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={isVerifying}
                          onClick={() =>
                            handleAdminAction("VERIFY_ORGANIZATION", org.id, { status: "VERIFIED" })
                          }
                          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Authorize
                        </Button>
                      )}

                      {org.verificationStatus === "VERIFIED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isVerifying}
                          onClick={() =>
                            handleAdminAction("VERIFY_ORGANIZATION", org.id, { status: "UNVERIFIED" })
                          }
                          className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          Revoke
                        </Button>
                      )}

                      {org.verificationStatus !== "SUSPENDED" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isVerifying}
                          onClick={() =>
                            handleAdminAction("VERIFY_ORGANIZATION", org.id, { status: "SUSPENDED" })
                          }
                          className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isVerifying}
                          onClick={() =>
                            handleAdminAction("VERIFY_ORGANIZATION", org.id, { status: "UNVERIFIED" })
                          }
                          className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONVERSION PATHWAYS ENGINE CONTROLS                                */}
      {/* ========================================================================= */}
      {activeTab === "pathways" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>Conversion Pathways Catalog & Certification</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Enable or disable algorithmic pathways, adjust laboratory certification statuses, and view commercial economics.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="purple">
                {(data.controls?.pathways || []).filter((p: any) => p.isActive).length} Active Routes
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(data.controls?.pathways || []).map((pathway: any) => {
              const isToggling = actionLoadingId === `TOGGLE_PATHWAY-${pathway.id}`;
              const isUpdatingStatus = actionLoadingId === `UPDATE_PATHWAY_VALIDATION-${pathway.id}`;

              return (
                <Card
                  key={pathway.id}
                  className={`p-6 border-slate-800 bg-slate-900/90 flex flex-col justify-between transition-all ${
                    !pathway.isActive ? "opacity-60 border-dashed" : "hover:border-purple-500/40"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-white">{pathway.name}</h3>
                        </div>
                        <p className="text-xs text-purple-300 font-mono">
                          Target Output: <strong className="text-white">{pathway.outputProduct}</strong>
                        </p>
                      </div>

                      <Badge variant={pathway.isActive ? "emerald" : "slate"}>
                        {pathway.isActive ? "ACTIVE ROUTE" : "DEACTIVATED"}
                      </Badge>
                    </div>

                    {/* Inputs and Market Details */}
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 mb-4 text-xs font-mono">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Input Stream:</span>
                        <span className="text-emerald-400 font-bold">{pathway.inputMaterial}</span>
                      </div>
                      {pathway.secondaryMaterial && (
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Secondary Binder:</span>
                          <span className="text-blue-400 font-bold">{pathway.secondaryMaterial}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Target Buyer Market:</span>
                        <span className="text-slate-200">{pathway.potentialMarket}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                        <span>Projected Value:</span>
                        <span className="text-emerald-400 font-bold">
                          ₹{(pathway.estimatedValueMin || 0).toLocaleString()} – ₹{(pathway.estimatedValueMax || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      🌱 {pathway.environmentalBenefitDescription}
                    </p>
                  </div>

                  {/* Certification Selector & Activation Toggle */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Certification:</span>
                      <select
                        value={pathway.validationStatus}
                        disabled={isUpdatingStatus}
                        onChange={(e) =>
                          handleAdminAction("UPDATE_PATHWAY_VALIDATION", pathway.id, {
                            validationStatus: e.target.value,
                          })
                        }
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                      >
                        <option value="PROTOTYPE">PROTOTYPE</option>
                        <option value="REQUIRES_VALIDATION">REQUIRES_VALIDATION</option>
                        <option value="VALIDATED">VALIDATED</option>
                      </select>
                    </div>

                    <Button
                      size="sm"
                      variant={pathway.isActive ? "outline" : "primary"}
                      disabled={isToggling}
                      onClick={() =>
                        handleAdminAction("TOGGLE_PATHWAY", pathway.id, {
                          isActive: !pathway.isActive,
                        })
                      }
                      className={
                        pathway.isActive
                          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                          : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
                      }
                    >
                      {pathway.isActive ? "Deactivate Route" : "Activate Route"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MARKETPLACE & BATCH SURVEILLANCE                                   */}
      {/* ========================================================================= */}
      {activeTab === "marketplace_batches" && (
        <div className="space-y-10 animate-in fade-in-50 duration-300">
          {/* Marketplace Moderation Section */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-400" />
                  <span>Marketplace Listings & Request Moderation</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Surveil active byproduct exchange listings, moderate transaction states, and inspect procurement bids.
                </p>
              </div>
              <Badge variant="emerald">{(data.controls?.marketplaceListings || []).length} Total Listings</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(data.controls?.marketplaceListings || []).map((listing: any) => {
                const isModerating = actionLoadingId === `MODERATE_LISTING-${listing.id}`;
                return (
                  <Card
                    key={listing.id}
                    className="p-5 border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-sm font-bold text-white">{listing.title}</h4>
                        <Badge
                          variant={
                            listing.status === "AVAILABLE"
                              ? "emerald"
                              : listing.status === "RESERVED"
                              ? "amber"
                              : "blue"
                          }
                        >
                          {listing.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-400 mb-3">🏢 {listing.organizationName}</p>

                      <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs font-mono space-y-1 mb-4">
                        <div className="flex justify-between text-slate-400">
                          <span>Quantity:</span>
                          <span className="text-white font-bold">
                            {listing.quantity.toLocaleString()} {listing.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Material:</span>
                          <span className="text-emerald-400">{listing.materialType}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Open Bids:</span>
                          <span className="text-purple-400 font-bold">{listing.requestCount} Requests</span>
                        </div>
                      </div>

                      {/* Buyer Requests Sub-list */}
                      {listing.requests && listing.requests.length > 0 && (
                        <div className="mb-4 space-y-1.5">
                          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                            Recent Allocation Requests:
                          </span>
                          {listing.requests.map((req: any) => (
                            <div
                              key={req.id}
                              className="p-2 bg-slate-950/60 rounded border border-slate-800 text-[11px] font-mono flex items-center justify-between"
                            >
                              <span className="text-slate-300 truncate max-w-[140px]">
                                {req.requesterOrgName}
                              </span>
                              <Badge variant={req.status === "ACCEPTED" ? "emerald" : "amber"}>
                                {req.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Moderation Controls */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-slate-500">Moderation:</span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isModerating || listing.status === "AVAILABLE"}
                          onClick={() =>
                            handleAdminAction("MODERATE_LISTING", listing.id, { status: "AVAILABLE" })
                          }
                          className="text-[10px] px-2 py-0.5 h-7"
                        >
                          Available
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isModerating || listing.status === "RESERVED"}
                          onClick={() =>
                            handleAdminAction("MODERATE_LISTING", listing.id, { status: "RESERVED" })
                          }
                          className="text-[10px] px-2 py-0.5 h-7 text-amber-400"
                        >
                          Reserve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isModerating || listing.status === "CLOSED"}
                          onClick={() =>
                            handleAdminAction("MODERATE_LISTING", listing.id, { status: "CLOSED" })
                          }
                          className="text-[10px] px-2 py-0.5 h-7 text-blue-400"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Material Batches Ledger Section */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-teal-400" />
                  <span>Material Batches & Provenance Ledger Surveillance</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Surveil physical batch provenance records, testing certificates, and lifecycle transitions.
                </p>
              </div>
              <Badge variant="teal">{(data.controls?.batches || []).length} Tracked Batches</Badge>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Batch Code</th>
                    <th className="p-3.5">Source Enterprise</th>
                    <th className="p-3.5">Material & Quantity</th>
                    <th className="p-3.5">Lifecycle Status</th>
                    <th className="p-3.5">Testing Status</th>
                    <th className="p-3.5 text-right">Admin Transition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {(data.controls?.batches || []).map((batch: any) => {
                    const isUpdatingBatch = actionLoadingId === `UPDATE_BATCH_STATUS-${batch.id}`;
                    return (
                      <tr key={batch.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-white">
                          <span className="text-teal-400">{batch.batchCode}</span>
                          <span className="text-[10px] text-slate-500 block font-normal">
                            Prod: {batch.productBatchCode || "N/A"}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-slate-200 font-sans font-medium">{batch.sourceOrgName}</span>
                          <span className="text-[10px] text-slate-500 block">→ {batch.processorOrgName}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-emerald-400 font-bold">
                            {batch.quantity.toLocaleString()} {batch.unit}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{batch.wasteType}</span>
                        </td>
                        <td className="p-3.5">
                          <Badge variant="teal">{batch.currentStatus}</Badge>
                        </td>
                        <td className="p-3.5">
                          <span className="text-xs text-purple-300 font-sans">
                            {batch.testingStatus || "PENDING_TESTING"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <select
                            disabled={isUpdatingBatch}
                            value={batch.currentStatus}
                            onChange={(e) =>
                              handleAdminAction("UPDATE_BATCH_STATUS", batch.id, {
                                eventType: e.target.value,
                              })
                            }
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                          >
                            <option value="GENERATED">GENERATED</option>
                            <option value="COLLECTED">COLLECTED</option>
                            <option value="SORTED">SORTED</option>
                            <option value="CLEANED">CLEANED</option>
                            <option value="PROCESSED">PROCESSED</option>
                            <option value="CONVERTED">CONVERTED</option>
                            <option value="TESTED">TESTED</option>
                            <option value="SOLD">SOLD</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: IMMUTABLE AUDIT LEDGER & DATA PRIVACY GUARANTEES                   */}
      {/* ========================================================================= */}
      {activeTab === "audit_logs" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Privacy Guarantee Banner */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block font-mono">
                  Strict Data Privacy Enforced
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Administrative views strictly mask sensitive credentials. Password hashes, JWT tokens, and private session cookies are stripped at the ORM layer before serialization.
                </p>
              </div>
            </div>
            <Badge variant="emerald" className="hidden sm:inline-flex">
              ZERO-CREDENTIAL EXPOSURE
            </Badge>
          </div>

          {/* Audit Search and Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>Immutable Security & Audit Ledger</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographic audit trail tracking all authentications, governance decisions, and resource modifications.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input
                  placeholder="Search audit trail..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="pl-8 py-1 text-xs h-9"
                />
              </div>

              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-500 h-9"
              >
                <option value="ALL">All Actions</option>
                <option value="LOGIN">LOGIN</option>
                <option value="ADMIN_VERIFY">ADMIN_VERIFY</option>
                <option value="ADMIN_PATHWAY_UPDATE">ADMIN_PATHWAY_UPDATE</option>
                <option value="ADMIN_MARKETPLACE_MODERATE">ADMIN_MARKETPLACE_MODERATE</option>
                <option value="ADMIN_BATCH_UPDATE">ADMIN_BATCH_UPDATE</option>
                <option value="ASSESSMENT_SUBMITTED">ASSESSMENT_SUBMITTED</option>
                <option value="CREATE_BATCH">CREATE_BATCH</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Action Event</th>
                  <th className="p-3.5">Security Principal (Actor)</th>
                  <th className="p-3.5">Target Resource</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5 text-right">Audit Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                      No audit records found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <Badge
                          variant={
                            log.action.includes("ADMIN")
                              ? "purple"
                              : log.action.includes("LOGIN")
                              ? "blue"
                              : log.action.includes("VERIFY")
                              ? "emerald"
                              : "slate"
                          }
                        >
                          {log.action}
                        </Badge>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-sans font-bold">
                            {log.actor?.name || "Anonymous / Node"}
                          </span>
                          {log.actor?.role && (
                            <Badge variant="purple" className="text-[9px] py-0 px-1">
                              {log.actor.role}
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block">{log.actor?.email || "N/A"}</span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="text-emerald-400 font-bold">{log.resourceType}</span>
                        <span className="text-[10px] text-slate-500 block">ID: {log.resourceId}</span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap text-slate-400">{log.ipAddress || "127.0.0.1"}</td>
                      <td className="p-3.5 text-right font-mono text-[10px] text-slate-400 max-w-xs truncate">
                        {log.metadata || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
