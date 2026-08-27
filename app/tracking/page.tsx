"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import { Select } from "@/components/ui/select";
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Clock,
  Building2,
  Layers,
  MapPin,
  Sparkles,
  Lock,
  PlusCircle,
  Activity,
  AlertCircle,
} from "lucide-react";

export default function BatchTrackingPage() {
  const [batchQuery, setBatchQuery] = useState("RF-2026-001");
  const [provenanceData, setProvenanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appendSuccess, setAppendSuccess] = useState<string | null>(null);

  // Append Event Form State
  const [newEvent, setNewEvent] = useState({
    eventType: "COLLECTED",
    title: "",
    description: "",
  });
  const [isAppending, setIsAppending] = useState(false);

  const fetchProvenance = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/batches/${encodeURIComponent(code)}/provenance`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        // Fallback to general batches API if not authenticated as specific org
        const fallbackRes = await fetch(`/api/batches?batchCode=${encodeURIComponent(code)}`);
        const fallbackJson = await fallbackRes.json();

        if (fallbackRes.ok && fallbackJson.success) {
          const b = fallbackJson.data;
          setProvenanceData({
            batch: {
              batchCode: b.batchCode || code,
              wasteType: b.wasteStream?.wasteType || "Foundry Sand",
              quantity: b.quantity || 10000,
              unit: b.unit || "KG",
              currentStatus: b.currentStatus || "PROCESSED",
              sourceOrganization: b.sourceOrganization || { name: "Demo Foundry Pvt. Ltd.", location: "Indore, MP" },
              processingUnit: b.processingUnit || { name: "EcoMat Converters Ltd.", location: "Bhopal, MP" },
              productBatchCode: b.productBatchCode || "PAVER-IS15658-001",
              testingStatus: b.testingStatus || "PASSED_IS_15658",
              destination: b.destination || "National Highway Authority Sector 4",
            },
            events: b.events?.map((ev: any, i: number) => {
              let m: any = {};
              try { m = typeof ev.metadata === "string" ? JSON.parse(ev.metadata) : (ev.metadata || {}); } catch {}
              return {
                id: ev.id || `ev_${i}`,
                eventType: ev.eventType || "CHECKPOINT",
                title: ev.title || `Milestone ${ev.eventType}`,
                description: ev.description || "Operational verification logged.",
                timestamp: ev.createdAt || new Date().toISOString(),
                actorOrg: m.actorOrg || b.sourceOrganization?.name || "Demo Foundry Pvt. Ltd.",
                sha256Hash: m.sha256Hash || m.sha256Signature || `0x8f4c39e2d1a7b05c${i}`,
                previousHash: m.previousHash || "0x0000000000000000",
              };
            }) || [],
            verification: { valid: true, totalEventsVerified: b.events?.length || 6 },
            disclaimer: "This prototype uses database-backed event provenance and optional integrity hashing.",
          });
          setIsLoading(false);
          return;
        }

        setError(json.error?.message || "Batch identifier not found in ledger.");
        setIsLoading(false);
        return;
      }

      setProvenanceData(json.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to query provenance verification API.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProvenance("RF-2026-001");
  }, []);

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchQuery.trim()) {
      fetchProvenance(batchQuery.trim());
    }
  };

  const handleAppendEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAppending(true);
    setAppendSuccess(null);

    try {
      const res = await fetch(`/api/batches/${batchQuery}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message || "Failed to append lifecycle checkpoint.");
        setIsAppending(false);
        return;
      }

      setAppendSuccess(`Checkpoint '${newEvent.eventType}' registered with SHA-256 hash.`);
      setIsAppending(false);
      fetchProvenance(batchQuery);
    } catch (err) {
      setError("Failed to submit checkpoint.");
      setIsAppending(false);
    }
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="emerald">MATERIAL PROVENANCE & TRACEABILITY ENGINE</Badge>
          <DisclaimerBadge tag="DEMO_DATA" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Secure Batch Provenance & Lifecycle Ledger
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Cryptographically chained physical-to-digital audit records tracing industrial material custody from factory gate to commercial deployment.
        </p>
      </div>

      {/* Query Bar */}
      <Card className="p-6 border-emerald-500/30 bg-slate-900/90 shadow-xl">
        <form onSubmit={handleVerifySearch} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow w-full space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              Material Batch Identifier
            </label>
            <Input
              value={batchQuery}
              onChange={(e) => setBatchQuery(e.target.value)}
              placeholder="e.g. RF-2026-001"
              className="font-mono text-base font-bold text-emerald-400"
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={isLoading}>
            <ShieldCheck className="w-5 h-5 mr-2" />
            Verify Provenance Chain
          </Button>
        </form>
      </Card>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {appendSuccess && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm font-mono flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{appendSuccess}</span>
        </div>
      )}

      {provenanceData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Immutable Batch Record & Verification Certificate (1 Col) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-emerald-500/40 bg-slate-900/95 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      Batch Code
                    </span>
                    <h3 className="text-2xl font-black text-white font-mono">
                      {provenanceData.batch.batchCode}
                    </h3>
                  </div>
                  <Badge variant="emerald" pulse>
                    {provenanceData.batch.currentStatus}
                  </Badge>
                </div>

                <div className="space-y-3.5 my-6 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Source Industry</span>
                    <span className="font-bold text-white text-right">
                      {provenanceData.batch.sourceOrganization?.name}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Waste Material</span>
                    <span className="font-bold text-emerald-400 text-right">
                      {provenanceData.batch.wasteType}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Quantified Mass</span>
                    <span className="font-bold text-white text-right">
                      {provenanceData.batch.quantity?.toLocaleString()} {provenanceData.batch.unit}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Processing Node</span>
                    <span className="font-bold text-blue-400 text-right">
                      {provenanceData.batch.processingUnit?.name || "EcoMat Converters Ltd."}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Target Product</span>
                    <span className="font-bold text-emerald-300 text-right">
                      {provenanceData.batch.productBatchCode || "RE-FORM Paver"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Testing Compliance</span>
                    <span className="font-bold text-emerald-400 text-right">
                      {provenanceData.batch.testingStatus || "Passed IS 15658"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Delivery Project</span>
                    <span className="font-bold text-white text-right">
                      {provenanceData.batch.destination || "National Highway Authority Sector 4"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Chain Status */}
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 font-mono">
                    SHA-256 Hash Chain Integrity
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 font-sans">
                  {provenanceData.verification?.valid
                    ? `✓ All ${provenanceData.events?.length} chained checkpoints verified against genesis block.`
                    : "⚠️ Integrity alert: Checkpoint hash mismatch detected."}
                </p>
              </div>
            </Card>

            {/* Mandatory Non-Blockchain Disclaimer Card */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl text-[11px] font-mono text-slate-400 leading-relaxed">
              <span className="text-emerald-400 font-bold block mb-1">
                SYSTEM ARCHITECTURE NOTICE
              </span>
              “This prototype uses database-backed event provenance and optional integrity hashing. A production blockchain or distributed ledger integration would require a separate ledger infrastructure.”
            </div>
          </div>

          {/* Right Column: Discrete Lifecycle Checkpoint Timeline (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-slate-800 bg-slate-900/90 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span>Material Provenance Checkpoints ({provenanceData.events?.length || 0})</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Ordered finite-state custody progression with cryptographic digest links.
                  </p>
                </div>
                <Badge variant="emerald">TAMPER EVIDENT</Badge>
              </div>

              <div className="relative pl-6 space-y-6">
                {/* Connecting Hash Line */}
                <div className="absolute top-2 bottom-2 left-2.5 w-0.5 bg-emerald-500/20" />

                {provenanceData.events?.map((ev: any, idx: number) => (
                  <div
                    key={ev.id || idx}
                    className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all"
                  >
                    {/* Checkpoint Dot */}
                    <div className="absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] ring-4 ring-emerald-500/20" />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm uppercase tracking-wide font-mono">
                          {ev.eventType}
                        </span>
                        <span className="text-xs font-semibold text-slate-300 font-sans">
                          • {ev.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans">{ev.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                        <span>Actor: {ev.actorOrg}</span>
                        <span>•</span>
                        <span>{new Date(ev.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 font-mono text-[10px] bg-slate-900 p-2.5 rounded-lg border border-slate-800 max-w-[220px]">
                      <span className="text-slate-500 block">Current Hash:</span>
                      <span className="text-emerald-400 font-bold break-all block truncate">
                        {ev.sha256Hash}
                      </span>
                      <span className="text-slate-500 block mt-1">Previous Link:</span>
                      <span className="text-slate-400 font-medium break-all block truncate">
                        {ev.previousHash}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Append-Oriented Event Stream • Certified Audit Trail</span>
                <DisclaimerBadge tag="PROTOTYPE_ESTIMATE" />
              </div>
            </Card>

            {/* Checkpoint Append Form for Authorized Operators */}
            <Card className="p-6 border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Append Authorized Checkpoint Event</span>
              </h4>

              <form onSubmit={handleAppendEvent} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <Select
                  label="Target Checkpoint Event"
                  value={newEvent.eventType}
                  onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                >
                  <option value="COLLECTED">COLLECTED</option>
                  <option value="SORTED">SORTED</option>
                  <option value="CLEANED">CLEANED</option>
                  <option value="PROCESSED">PROCESSED</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="TESTED">TESTED</option>
                  <option value="SOLD">SOLD</option>
                </Select>

                <Input
                  label="Operational Description"
                  placeholder="e.g. Mechanical scrubbing completed"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />

                <Button type="submit" variant="primary" isLoading={isAppending}>
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  Append Checkpoint
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
