"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2, PackageSearch, Search } from "lucide-react";
import { adminFetch, isDemoResponse } from "@/lib/admin";
import { faDate, faNum, faPrice } from "@/lib/format";
import type { OrderItem } from "@/db/schema";

interface OrderRow {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
}

const STATUSES = ["در حال پردازش", "ارسال شد", "تحویل شد", "لغو شد"];

const STATUS_STYLE: Record<string, string> = {
  "در حال پردازش": "border-gold-500/40 bg-gold-500/10 text-gold-300",
  "ارسال شد": "border-sky-500/40 bg-sky-500/10 text-sky-300",
  "تحویل شد": "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  "لغو شد": "border-red-500/40 bg-red-500/10 text-red-300",
};

function readLocalOrders(): OrderRow[] {
  try {
    return JSON.parse(localStorage.getItem("puttclub_local_orders") || "[]");
  } catch {
    return [];
  }
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const res = await adminFetch("/api/admin/orders");
      if (isDemoResponse(res)) {
        setDemo(true);
        setOrders(readLocalOrders().sort((a, b) => b.id - a.id));
        return;
      }
      const data = await res!.json();
      setOrders(data.orders ?? []);
    })();
  }, []);

  const setStatus = async (id: number, status: string) => {
    setSaving(id);
    if (demo) {
      const next = (orders ?? []).map((o) => (o.id === id ? { ...o, status } : o));
      localStorage.setItem("puttclub_local_orders", JSON.stringify(next));
      setOrders(next);
      setSaving(null);
      return;
    }
    const res = await adminFetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res && res.ok) {
      const data = await res.json();
      setOrders((prev) => prev?.map((o) => (o.id === id ? data.order : o)) ?? null);
    }
    setSaving(null);
  };

  if (!orders) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={30} className="animate-spin text-gold-400" />
      </div>
    );
  }

  const filtered = orders.filter(
    (o) =>
      q.trim() === "" ||
      o.code.includes(q.trim()) ||
      o.customerName.includes(q.trim()) ||
      o.phone.includes(q.trim())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          سفارش‌ها <span className="text-base font-bold text-sage">({faNum(orders.length)})</span>
        </h1>
        {demo && (
          <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
            حالت نمایشی
          </span>
        )}
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-sage" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجو با کد، نام یا موبایل..."
          className="h-12 w-full rounded-2xl border border-gold-500/15 bg-forest-900/70 ps-11 pe-4 text-sm outline-none placeholder:text-sage/50 focus:border-gold-500/50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gold-500/20 py-16 text-center">
          <PackageSearch size={40} className="text-gold-500/50" strokeWidth={1.4} />
          <p className="font-bold">سفارشی یافت نشد</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((o) => (
            <article
              key={o.id}
              className="overflow-hidden rounded-3xl border border-gold-500/10 bg-forest-900/70"
            >
              <button
                onClick={() => setOpen(open === o.id ? null : o.id)}
                className="flex w-full flex-wrap items-center gap-3 p-5 text-start"
              >
                <span className="font-black tracking-widest" dir="ltr">
                  {o.code}
                </span>
                <span className="text-sm text-sage">{o.customerName}</span>
                <span className="ms-auto text-sm font-black text-gold-300">{faPrice(o.total)}</span>
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-black ${
                    STATUS_STYLE[o.status] ?? STATUS_STYLE["در حال پردازش"]
                  }`}
                >
                  {o.status}
                </span>
                <ChevronDown
                  size={17}
                  className={`text-sage transition-transform ${open === o.id ? "rotate-180" : ""}`}
                />
              </button>

              {open === o.id && (
                <div className="space-y-4 border-t border-gold-500/10 p-5">
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <p><span className="text-sage">موبایل: </span><span dir="ltr" className="font-bold">{o.phone}</span></p>
                    <p><span className="text-sage">شهر: </span><span className="font-bold">{o.city}</span></p>
                    <p className="sm:col-span-2"><span className="text-sage">آدرس: </span>{o.address}</p>
                    <p><span className="text-sage">تاریخ: </span>{faDate(o.createdAt)}</p>
                    <p><span className="text-sage">ارسال: </span>{o.shipping === 0 ? "رایگان" : faPrice(o.shipping)}</p>
                  </div>
                  <div className="space-y-2">
                    {(o.items ?? []).map((it, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-forest-950/60 px-4 py-2.5 text-sm"
                      >
                        <span className="truncate font-bold">{it.name}</span>
                        <span className="shrink-0 text-xs text-sage">
                          {faNum(it.qty)} × {faPrice(it.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-xs font-bold text-sage">تغییر وضعیت:</label>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          disabled={saving === o.id}
                          onClick={() => setStatus(o.id, s)}
                          className={`rounded-full border px-4 py-2 text-xs font-bold transition-all disabled:opacity-50 ${
                            o.status === s
                              ? "border-gold-400 bg-gold-500 text-forest-950"
                              : "border-forest-600 text-sage hover:border-gold-500/40 hover:text-gold-300"
                          }`}
                        >
                          {saving === o.id && o.status !== s ? "..." : s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
