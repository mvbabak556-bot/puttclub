import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import ThemeStyle from "@/components/site/ThemeStyle";
import { getSiteSettings } from "@/lib/site-settings";
import { CATEGORIES } from "@/lib/data";
import { db } from "@/db";
import { categories } from "@/db/schema";

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

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const favicon = /^(https?:|data:|blob:)/.test(s.seo.favicon)
    ? s.seo.favicon
    : `${base}${s.seo.favicon}`;
  return {
    title: s.seo.title,
    description: s.seo.description,
    icons: {
      icon: favicon,
      apple: `${base}/images/academy-logo.jpg`,
    },
  };
}

async function getFooterCats(): Promise<string[]> {
  try {
    const rows = await db.select({ name: categories.name }).from(categories);
    return rows.length ? rows.map((r) => r.name) : [...CATEGORIES];
  } catch {
    return [...CATEGORIES];
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [s, footerCats] = await Promise.all([getSiteSettings(), getFooterCats()]);
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${playfair.variable}`}>
      <body className="bg-forest-950 font-vazir text-cream antialiased">
        <ThemeStyle theme={s.theme} />
        <SiteShell brand={s.brand} nav={s.nav} footer={s.footer} footerCats={footerCats}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
