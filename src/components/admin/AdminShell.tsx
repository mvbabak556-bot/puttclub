"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Package,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { clearAdmin, getAdmin, type AdminSession } from "@/lib/admin";
import Overview from "@/components/admin/Overview";
import OrdersManager from "@/components/admin/OrdersManager";
import ProductsManager from "@/components/admin/ProductsManager";
import CategoriesManager from "@/components/admin/CategoriesManager";
import ReviewsManager from "@/components/admin/ReviewsManager";
import UsersManager from "@/components/admin/UsersManager";

const TABS = [
  { key: "overview", label: "نمای کلی", icon: LayoutDashboard },
  { key: "orders", label: "سفارش‌ها", icon: ShoppingBag },
  { key: "products", label: "محصولات", icon: Package },
  { key: "categories", label: "دسته‌بندی‌ها", icon: FolderOpen },
  { key: "reviews", label: "دیدگاه‌ها", icon: MessageSquare },
  { key: "users", label: "کاربران", icon: Users },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminShell() {
  const router = useRouter();
  const [admin, setAdminState] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<TabKey>("overview");

  useEffect(() => {
    const a = getAdmin();
    if (!a) {
      router.replace("/admin/login");
      return;
    }
    setAdminState(a);
    setReady(true);
  }, [router]);

  if (!ready || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      {/* Sidebar */}
      <aside className="hidden border-e border-gold-500/10 bg-forest-900/70 lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-gold-500/15 bg-forest-950/60 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-500 text-forest-950">
              <ShieldCheck size={22} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-black">{admin.name}</div>
              <div className="mt-0.5 truncate text-[11px] text-sage" dir="ltr">
                {admin.email}
              </div>
            </div>
          </div>

          <nav className="mt-6 flex-1 space-y-1.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  tab === t.key
                    ? "bg-gold-500 text-forest-950 shadow-lg"
                    : "text-cream/70 hover:bg-forest-800 hover:text-gold-300"
                }`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
            ))}
          </nav>

          <div className="space-y-1.5 border-t border-gold-500/10 pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-sage transition-colors hover:text-gold-300"
            >
              <Eye size={18} />
              مشاهده فروشگاه
            </Link>
            <button
              onClick={() => {
                clearAdmin();
                router.push("/admin/login");
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-sage transition-colors hover:text-red-300"
            >
              <LogOut size={18} />
              خروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 border-b border-gold-500/10 bg-forest-950/90 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-black">
              <ShieldCheck size={18} className="text-gold-400" />
              داشبورد مدیر
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                aria-label="مشاهده فروشگاه"
                className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage"
              >
                <Eye size={16} />
              </Link>
              <button
                onClick={() => {
                  clearAdmin();
                  router.push("/admin/login");
                }}
                aria-label="خروج"
                className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-3">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  tab === t.key ? "bg-gold-500 text-forest-950" : "bg-forest-800 text-sage"
                }`}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "overview" && <Overview onGo={setTab} />}
              {tab === "orders" && <OrdersManager />}
              {tab === "products" && <ProductsManager />}
              {tab === "categories" && <CategoriesManager />}
              {tab === "reviews" && <ReviewsManager />}
              {tab === "users" && <UsersManager />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
