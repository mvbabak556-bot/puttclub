"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ScrollProgress from "@/components/ScrollProgress";
import { ACADEMY } from "@/lib/academy";
import { CATEGORIES } from "@/lib/data";
import {
  SITE_DEFAULTS,
  type BrandSettings,
  type FooterSettings,
  type NavSettings,
} from "@/lib/site-schema";

/**
 * صفحه ورود اعضای آکادمی (/academy) و داشبوردهای مدیریتی (/admin) پنل مستقل‌اند —
 * پس بدون هدر، فوتر، سبد خرید و نوار پیشرفت نمایش داده می‌شوند.
 */
export default function SiteShell({
  children,
  brand = ACADEMY as unknown as BrandSettings,
  nav = SITE_DEFAULTS.nav,
  footer = SITE_DEFAULTS.footer,
  footerCats = [...CATEGORIES],
}: {
  children: ReactNode;
  brand?: BrandSettings;
  nav?: NavSettings;
  footer?: FooterSettings;
  footerCats?: string[];
}) {
  const pathname = usePathname() || "";
  const bare =
    pathname === "/academy" ||
    pathname.startsWith("/academy/") ||
    pathname.endsWith("/academy/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.endsWith("/admin/") ||
    pathname.includes("/admin/login");

  if (bare) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <ScrollProgress />
      <Header brand={brand} nav={nav} />
      <main className="min-h-screen">{children}</main>
      <Footer brand={brand} data={footer} cats={footerCats} />
      <CartDrawer />
    </>
  );
}
