"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, MessageSquareOff, Trash2, X } from "lucide-react";
import { adminFetch, demoTable, isDemoResponse, saveDemoTable } from "@/lib/admin";
import Stars from "@/components/Stars";
import { faDate, faNum } from "@/lib/format";
import type { SiteTestimonial } from "@/lib/site-defaults";

type Filter = "all" | "pending" | "approved" | "rejected";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "pending", label: "در انتظار" },
  { key: "approved", label: "تأییدشده" },
  { key: "rejected", label: "ردشده" },
  { key: "all", label: "همه" },
];

const STATUS_LABEL: Record<string, string> = {
  pending: "در انتظار",
  approved: "تأییدشده",
  rejected: "ردشده",
};

export default function SiteTestimonials() {
  const [rows, setRows] = useState<SiteTestimonial[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [filter, setFilter] = useState<Filter>("pending");
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const res = await adminFetch("/api/admin/site/testimonials");
      if (isDemoResponse(res)) {
        setDemo(true);
        try {
          const saved = localStorage.getItem("puttclub_demo_site-testimonials");
          if (saved) {
            setRows(JSON.parse(saved));
            return;
          }
        } catch {
          /* noop */
        }
        const snap = await demoTable<SiteTestimonial>("site-testimonials");
        let locals: SiteTestimonial[] = [];
        try {
          locals = JSON.parse(localStorage.getItem("puttclub_local_site_testimonials") || "[]");
        } catch {
          locals = [];
        }
        const merged = [...locals, ...snap].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRows(merged);
        return;
      }
      const data = await res!.json();
      setRows(data.testimonials ?? []);
    })();
  }, []);

  const persistDemo = (next: SiteTestimonial[]) => {
    saveDemoTable("site-testimonials", next);
    setRows(next);
  };

  const setStatus = async (id: number, status: "approved" | "rejected" | "pending") => {
    setBusyId(id);
    if (demo) {
      persistDemo((rows ?? []).map((r) => (r.id === id ? { ...r, status } : r)));
      setBusyId(null);
      return;
    }
    const res = await adminFetch(`/api/admin/site/testimonials/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res && res.ok) {
      const data = await res.json();
      setRows((prev) => prev?.map((r) => (r.id === id ? data.testimonial : r)) ?? null);
    }
    setBusyId(null);
  };

  const remove = async (id: number) => {
    if (!confirm("این نظر حذف شود؟")) return;
    setBusyId(id);
    if (demo) {
      persistDemo((rows ?? []).filter((r) => r.id !== id));
      setBusyId(null);
      return;
    }
    const res = await adminFetch(`/api/admin/site/testimonials/${id}`, { method: "DELETE" });
    if (res && res.ok) setRows((prev) => prev?.filter((r) => r.id !== id) ?? null);
    setBusyId(null);
  };

  if (!rows) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={30} className="animate-spin text-gold-400" />
      </div>
    );
  }

  const counts: Record<Filter, number> = {
    all: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
  };
  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">
            نظرات گلف‌بازان <span className="text-base font-bold text-sage">({faNum(rows.length)})</span>
          </h1>
          <p className="mt-1.5 text-xs leading-6 text-sage">
            نظرهای ثبت‌شده از فرم سایت اینجا می‌آیند؛ با تأیید، در صفحه اصلی نمایش داده می‌شوند.
          </p>
        </div>
        {demo && (
          <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
            حالت نمایشی
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-5 py-2.5 text-xs font-black transition-all ${
              filter === f.key ? "bg-gold-500 text-forest-950" : "bg-forest-800 text-sage hover:text-gold-300"
            }`}
          >
            {f.label} ({faNum(counts[f.key])})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gold-500/20 py-16 text-center">
          <MessageSquareOff size={40} className="text-gold-500/50" strokeWidth={1.4} />
          <p className="font-bold">نظری در این بخش نیست</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((r) => (
            <article key={r.id} className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-black text-forest-950">
                  {r.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black">{r.name}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                        r.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : r.status === "rejected"
                            ? "bg-red-500/15 text-red-300"
                            : "bg-gold-500/15 text-gold-300"
                      }`}
                    >
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-sage">
                    {r.phone && <span dir="ltr">{r.phone}</span>}
                    {r.role && <span>{r.role}</span>}
                    <span>{faDate(r.createdAt)}</span>
                  </div>
                </div>
                <Stars value={r.rating} size={13} />
              </div>
              <p className="mt-3 text-sm leading-7 text-cream/80">{r.text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.status !== "approved" && (
                  <button
                    onClick={() => setStatus(r.id, "approved")}
                    disabled={busyId === r.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-black text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                  >
                    <Check size={14} /> تأیید و نمایش
                  </button>
                )}
                {r.status !== "rejected" && (
                  <button
                    onClick={() => setStatus(r.id, "rejected")}
                    disabled={busyId === r.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-4 py-2 text-xs font-black text-sage transition-colors hover:text-red-300 disabled:opacity-50"
                  >
                    <X size={14} /> رد
                  </button>
                )}
                <button
                  onClick={() => remove(r.id)}
                  disabled={busyId === r.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-forest-600 px-4 py-2 text-xs font-black text-sage transition-colors hover:border-red-500/50 hover:text-red-300 disabled:opacity-50"
                >
                  {busyId === r.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} حذف
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
