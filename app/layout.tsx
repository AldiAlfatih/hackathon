import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAWAL-MBG | Platform Pengawasan Makan Bergizi Gratis",
  description:
    "Platform digital terintegrasi untuk perizinan dan pengawasan vendor program Makan Bergizi Gratis (MBG). Transparansi, akuntabilitas, dan efisiensi layanan publik untuk pertumbuhan ekonomi Indonesia.",
  keywords: "MBG, Makan Bergizi Gratis, pengawasan vendor, layanan publik, PIDI, digitalisasi",
  openGraph: {
    title: "KAWAL-MBG | Platform Pengawasan Makan Bergizi Gratis",
    description: "Platform digital pengawasan vendor MBG — Transparan, Akuntabel, Futuristik.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
