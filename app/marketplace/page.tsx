"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DisclaimerBadge } from "@/components/ui/disclaimer-badge";
import {
  Store,
  Factory,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function MarketplacePage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [processors, setProcessors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      const res = await fetch("/api/marketplace");
      const data = await res.json();
      if (data.success) {
        setStreams(data.data.availableStreams || []);
        setProcessors(data.data.processors || []);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleAction = (type: string, targetName: string) => {
    setNotification(`${type} sent for ${targetName}. Connection link dispatched to network node.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="emerald">B2B ACTIVE TRADING FLOOR</Badge>
          <DisclaimerBadge tag="DEMO_DATA" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          B2B Procurement & Upcycling Marketplace
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Dual-pane active trading marketplace linking verified waste-generating factories directly with regional industrial recycling converters.
        </p>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Section A: Available Waste Streams */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-emerald-500 rounded-full" />
              <span>Available Waste Streams</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {streams.length} Active Listings
            </span>
          </div>

          <div className="space-y-4">
            {streams.map((item) => (
              <Card
                key={item.id}
                className="p-6 border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="emerald" pulse>
                      AVAILABLE FOR MATCHMAKING
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-400">
                      Frequency: {item.frequency}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{item.wasteType}</h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-sans">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.organization?.name || "Manufacturing Facility"}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.location}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:items-end flex-shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Quantified Mass
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-sans">
                    {item.quantityMonthly.toLocaleString()} kg
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">per month</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Section B: Verified Processing Facilities */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-500 rounded-full" />
              <span>Verified Processing Facilities</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {processors.length} Certified Regional Hubs
            </span>
          </div>

          <div className="space-y-4">
            {processors.map((proc) => (
              <Card
                key={proc.id}
                className="p-6 border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-400" />
                      <span>{proc.name}</span>
                    </h4>
                    <Badge variant="blue">CPCB VERIFIED</Badge>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{proc.location}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-xl mb-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">
                        Accepted Materials
                      </span>
                      <span className="text-slate-200 font-semibold font-sans">
                        {proc.acceptedTypes || "Foundry Sand, Plastic Scrap"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">
                        Rated Capacity
                      </span>
                      <span className="text-emerald-400 font-bold">
                        {proc.ratedCapacityKg
                          ? `${proc.ratedCapacityKg.toLocaleString()} kg/mo`
                          : "25,000 kg/mo"}
                      </span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">
                        Operational Certifications
                      </span>
                      <span className="text-blue-400 font-medium font-sans">
                        {proc.certifications || "ISO 14001, OHSAS 18001"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Action Triggers */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                    onClick={() => handleAction("Asset Specifications Request", proc.name)}
                  >
                    View Specs
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1 min-w-[120px]"
                    onClick={() => handleAction("Material Allocation Allocation", proc.name)}
                  >
                    Request Allocation
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1 min-w-[120px]"
                    onClick={() => handleAction("Secure Node Connection", proc.name)}
                  >
                    Initiate Connection
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
