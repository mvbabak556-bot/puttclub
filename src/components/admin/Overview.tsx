"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, MessageSquare, Package, ShoppingBag, Users, Wallet, FlaskConical } from "lucide-react";
import { adminFetch, demoTable, isDemoResponse } from "@/lib/admin";
import { localOrders } from "@/lib/public";
import { faDate, faNum, faPrice } from "@/lib/format";

interface Stats {
  products: number;
  orders: number;
  users: number;
  reviews: number;
  revenue: number;
  lowStock: { id: number; name: string; stock: number }[];
  recent: { id: number; code: string; total: number; status: string; createdAt: string }[];
  byCat: { category: string; n: number }[];
}

export default function Overview({ onGo }: { onGo: (t: "orders" | "products") => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await adminFetch("/api/admin/stats");
      if (isDemoResponse(res)) {
        setDemo(true);
        // حالت نمایشی: محاسبه از دیتای محلی
        const [products, reviews] = await Promise.all([
          demoTable<{ id: number; name: string; stock: number; category: string }>("products"),
          demoTable<{ id: number }>("reviews"),
        ]);
        let locals: { total: number; code: string; status: string; createdAt: string; id: number }[] = [];
        try {
          locals = JSON.parse(localStorage.getItem("puttclub_local_orders") || "[]");
        } catch {
          locals = [];
        }
        const byCat = new Map<string, number>();
        products.forEach((p) => byCat.set(p.category, (byCat.get(p.category) ?? 0) + 1));
        setStats({
          products: products.length,
          orders: locals.length,
          users: 2,
          reviews: reviews.length,
          revenue: locals.reduce((s, o) => s + o.total, 0),
          lowStock: [...products].sort((a, b) => a.stock - b.stock).slice(0, 5),
          recent: locals.slice(0, 5),
          byCat: [...byCat.entries()].map(([category, n]) => ({ category, n })),
        });
        return;
      }
      const data = await res!.json();
      setStats(data);
    })();
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={30} className="animate-spin text-gold-400" />
      </div>
    );
  }

  const cards = [
    { label: "فروش کل", value: faPrice(stats.revenue), icon: Wallet },
    { label: "سفارش‌ها", value: faNum(stats.orders), icon: ShoppingBag },
    { label: "محصولات", value: faNum(stats.products), icon: Package },
    { label: "کاربران", value: faNum(stats.users), icon: Users },
    { label: "دیدگاه‌ها", value: faNum(stats.reviews), icon: MessageSquare },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">نمای کلی فروشگاه</h1>
        {demo && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
            <FlaskConical size={14} />
            حالت نمایشی — دیتای این مرورگر
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-5"
          >
            <c.icon size={20} className="text-gold-400" />
            <div className="mt-3 truncate text-lg font-black text-gold-300">{c.value}</div>
            <div className="mt-1 text-xs text-sage">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black">آخرین سفارش‌ها</h2>
            <button
              onClick={() => onGo("orders")}
              className="inline-flex items-center gap-1 text-xs font-bold text-gold-300 hover:text-gold-200"
            >
              همه سفارش‌ها
              <ArrowLeft size={14} />
            </button>
          </div>
          <div className="mt-4 space-y-2.5">
            {stats.recent.length === 0 && (
              <p className="py-6 text-center text-sm text-sage">هنوز سفارشی ثبت نشده است.</p>
            )}
            {stats.recent.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-gold-500/10 bg-forest-950/50 px-4 py-3 text-sm"
              >
                <span className="font-bold tracking-widest" dir="ltr">
                  {o.code}
                </span>
                <span className="hidden text-xs text-sage sm:block">{faDate(o.createdAt)}</span>
                <span className="text-xs font-black text-gold-300">{faPrice(o.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock + categories */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black">موجودی رو به اتمام</h2>
              <button
                onClick={() => onGo("products")}
                className="inline-flex items-center gap-1 text-xs font-bold text-gold-300 hover:text-gold-200"
              >
                مدیریت محصولات
                <ArrowLeft size={14} />
              </button>
            </div>
            <div className="mt-4 space-y-2.5">
              {stats.lowStock.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-gold-500/10 bg-forest-950/50 px-4 py-3 text-sm"
                >
                  <span className="truncate font-bold">{p.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black ${
                      p.stock <= 4
                        ? "bg-red-500/15 text-red-300"
                        : "bg-gold-500/15 text-gold-300"
                    }`}
                  >
                    {faNum(p.stock)} عدد
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
            <h2 className="text-base font-black">توزیع محصولات در دسته‌ها</h2>
            <div className="mt-4 space-y-2.5">
              {stats.byCat.map((c) => (
                <div key={c.category} className="flex items-center gap-3 text-xs">
                  <span className="w-24 shrink-0 truncate font-bold">{c.category}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-forest-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-gold-300 to-gold-600"
                      style={{
                        width: `${stats.products ? (c.n / stats.products) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-sage">{faNum(c.n)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
