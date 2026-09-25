import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import SiteProvider from "@/components/SiteProvider";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "آکادمی گلف پات کلاب | Putt Club Golf Academy",
  description:
    "آکادمی گلف پات کلاب در اهواز؛ آموزش گلف از مبتدی تا حرفه‌ای، ورود اعضای آکادمی و فروشگاه تخصصی تجهیزات اورجینال گلف.",
  icons: {
    icon: `${base}/favicon.ico`,
    apple: `${base}/images/academy-logo.jpg`,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${playfair.variable}`}>
      <body className="bg-forest-950 font-vazir text-cream antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
