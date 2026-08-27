"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Recycle, ShieldAlert } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FACTORY",
    organizationName: "",
    location: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Registration failed. Please check inputs.");
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

  return (
    <div className="w-full max-w-lg mx-auto my-auto py-12 px-4">
      <Card className="border-emerald-500/30 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Recycle className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Enterprise Onboarding</CardTitle>
          <CardDescription>
            Register your industrial facility or verified conversion hub on the RE-FORM network.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Officer"
              name="name"
              placeholder="Rajesh Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Corporate Email"
              type="email"
              name="email"
              placeholder="rajesh@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Organization Name"
              name="organizationName"
              placeholder="Demo Foundry Pvt. Ltd."
              value={formData.organizationName}
              onChange={handleChange}
              required
            />
            <Input
              label="Operating Location"
              name="location"
              placeholder="Indore, Madhya Pradesh"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="System Operational Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="FACTORY">Factory (Waste Generator)</option>
              <option value="PROCESSOR">Processor (Recycling Hub)</option>
              <option value="ADMIN">System Auditor (Admin)</option>
            </Select>

            <Input
              label="Password (min. 8 chars)"
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
            Submit Registration & Initialize Node
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline font-semibold">
            Sign In here
          </Link>
        </div>
      </Card>
    </div>
  );
}
