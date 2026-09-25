"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ScrollProgress from "@/components/ScrollProgress";

/**
 * - محتوای عمومی (خانه، فروشگاه، محصول، /academy و...) داخل #public-site
 * - فقط /admin و /admin/site پنل مستقل‌اند و بدون هدر/فوتر نمایش داده می‌شوند
 * - /academy عمداً داخل پوشش عمومی است تا هدر/فوتر سایت بماند (قرارداد پنل مستقل)
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const bare =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.endsWith("/admin/");

  if (bare) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div id="public-site">
      <ScrollProgress />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
