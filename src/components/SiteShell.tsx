"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ScrollProgress from "@/components/ScrollProgress";

/**
 * صفحه ورود اعضای آکادمی (/academy) و داشبورد مدیریتی (/admin) پنل مستقل‌اند —
 * پس بدون هدر، فوتر، سبد خرید و نوار پیشرفت نمایش داده می‌شوند.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
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
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
