import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "RE-FORM // Industrial Waste to Wealth",
  description:
    "Enterprise B2B platform turning industrial manufacturing byproducts into high-value functional commodities.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col relative overflow-x-hidden bg-[#080c14]`}
      >
        {/* Fixed Ambient Background Layers */}
        <div className="fixed inset-0 bg-tech-grid pointer-events-none -z-20 opacity-60" />
        <div className="fixed inset-0 ambient-glow pointer-events-none -z-10" />

        {/* Global Navigation */}
        <Navbar user={user} />

        {/* Main Viewport */}
        <main className="flex-grow flex flex-col w-full relative">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
