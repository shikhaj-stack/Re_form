"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Recycle, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Invalid authentication credentials.");
        setIsLoading(false);
        return;
      }

      router.refresh();
      router.push("/");
    } catch (err) {
      setError("Network or server connection failed.");
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto py-16 px-4">
      <Card className="border-emerald-500/30 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Recycle className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Node Access Portal</CardTitle>
          <CardDescription>
            Authenticate with your enterprise credentials to access active waste streams and batch ledgers.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Corporate Email"
            type="email"
            placeholder="operator@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Security Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign In to RE-FORM Node
          </Button>
        </form>

        {/* Demo Fast-Switch Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider text-center font-bold">
            Demo Sandbox Role Quick Fill:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("factory@demofoundry.com", "Demo1234!")}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-mono text-emerald-400 font-bold transition-colors text-center"
            >
              Factory
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("processor@ecomat.com", "Demo1234!")}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-mono text-blue-400 font-bold transition-colors text-center"
            >
              Processor
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("admin@reform.eco", "Admin1234!")}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-mono text-purple-400 font-bold transition-colors text-center"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          New enterprise?{" "}
          <Link href="/register" className="text-emerald-400 hover:underline font-semibold">
            Register your facility
          </Link>
        </div>
      </Card>
    </div>
  );
}
