"use client";

import type { TestimonialsSettings } from "@/lib/site-schema";
import { Card, Text, areaCls, inputCls } from "./fields";
import { Plus, Trash2 } from "lucide-react";

export default function TestimonialsEditor({
  value,
  onChange,
}: {
  value: TestimonialsSettings;
  onChange: (v: TestimonialsSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="سربرگ بخش">
        <Text label="نشان" value={value.kicker} onChange={(v) => onChange({ ...value, kicker: v })} />
        <Text label="تیتر (بخش اول)" value={value.titleA} onChange={(v) => onChange({ ...value, titleA: v })} />
        <Text label="تیتر (بخش طلایی)" value={value.titleB} onChange={(v) => onChange({ ...value, titleB: v })} />
      </Card>
      <Card title={`نظرها (${value.items.length})`}>
        <div className="space-y-3 sm:col-span-2">
          {value.items.map((t, i) => (
            <div key={i} className="space-y-2.5 rounded-2xl border border-gold-500/10 bg-forest-950/40 p-4">
              <div className="grid gap-2.5 sm:grid-cols-[1fr_1fr_90px_auto]">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sage">نام</label>
                  <input value={t.name} onChange={(e) => onChange({ ...value, items: value.items.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sage">نقش / سمت</label>
                  <input value={t.role} onChange={(e) => onChange({ ...value, items: value.items.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)) })} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sage">امتیاز</label>
                  <select value={t.rating} onChange={(e) => onChange({ ...value, items: value.items.map((x, j) => (j === i ? { ...x, rating: Number(e.target.value) } : x)) })} className={inputCls}>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n} className="bg-forest-900">{n} ستاره</option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={() => onChange({ ...value, items: value.items.filter((_, j) => j !== i) })} aria-label="حذف" className="grid size-11 place-items-center self-end rounded-xl border border-forest-600 text-sage transition-colors hover:border-red-500/50 hover:text-red-300">
                  <Trash2 size={15} />
                </button>
              </div>
              <textarea value={t.text} onChange={(e) => onChange({ ...value, items: value.items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} rows={2} placeholder="متن نظر..." className={areaCls} />
            </div>
          ))}
          <button type="button" onClick={() => onChange({ ...value, items: [...value.items, { name: "", role: "", text: "", rating: 5 }] })} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gold-500/30 px-3 py-2.5 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500/10">
            <Plus size={14} />
            افزودن نظر
          </button>
        </div>
      </Card>
    </div>
  );
}
