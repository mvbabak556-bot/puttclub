"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquareOff, Star, Trash2 } from "lucide-react";
import { adminFetch, demoTable, isDemoResponse, saveDemoTable } from "@/lib/admin";
import Stars from "@/components/Stars";
import { faDate, faNum } from "@/lib/format";

interface ReviewRow {
  id: number;
  productId: number;
  productName: string | null;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<ReviewRow[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const res = await adminFetch("/api/admin/reviews");
      if (isDemoResponse(res)) {
        setDemo(true);
        const [rawRows, prods] = await Promise.all([
          demoTable<Record<string, unknown>>("reviews"),
          demoTable<{ id: number; name: string }>("products"),
        ]);
        const map = new Map(prods.map((p) => [p.id, p.name]));
        const rows: ReviewRow[] = rawRows.map((raw) => {
          const pid = Number(raw.productId ?? raw.product_id ?? 0);
          return {
            id: Number(raw.id),
            productId: pid,
            productName: map.get(pid) ?? "—",
            author: String(raw.author ?? ""),
            rating: Number(raw.rating ?? 5),
            comment: String(raw.comment ?? ""),
            createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
          };
        });
        setReviews(rows.sort((a, b) => b.id - a.id));
        return;
      }
      const data = await res!.json();
      setReviews(data.reviews ?? []);
    })();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("این دیدگاه حذف شود؟")) return;
    setDeleting(id);
    if (demo) {
      const rows = (reviews ?? []).filter((r) => r.id !== id);
      saveDemoTable("reviews", rows);
      setReviews(rows);
      setDeleting(null);
      return;
    }
    const res = await adminFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res && res.ok) setReviews((prev) => prev?.filter((r) => r.id !== id) ?? null);
    setDeleting(null);
  };

  if (!reviews) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={30} className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          دیدگاه‌ها <span className="text-base font-bold text-sage">({faNum(reviews.length)})</span>
        </h1>
        {demo && (
          <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
            حالت نمایشی
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gold-500/20 py-16 text-center">
          <MessageSquareOff size={40} className="text-gold-500/50" strokeWidth={1.4} />
          <p className="font-bold">دیدگاهی ثبت نشده است</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {reviews.map((r) => (
            <article key={r.id} className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-black text-forest-950">
                  {r.author.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black">{r.author}</div>
                  <div className="mt-0.5 truncate text-[11px] text-sage">
                    {r.productName} • {faDate(r.createdAt)}
                  </div>
                </div>
                <Stars value={r.rating} size={13} />
                <button
                  onClick={() => remove(r.id)}
                  aria-label="حذف دیدگاه"
                  disabled={deleting === r.id}
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:border-red-500/50 hover:text-red-300 disabled:opacity-50"
                >
                  {deleting === r.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
              <p className="mt-3 flex items-start gap-2 text-sm leading-7 text-cream/80">
                <Star size={13} className="mt-1.5 shrink-0 text-gold-500" />
                {r.comment}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
