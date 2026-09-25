"use client";

import type { FeaturesSettings } from "@/lib/site-schema";
import { Card, IconSelect, areaCls, inputCls } from "./fields";
import { Plus, Trash2 } from "lucide-react";

export default function FeaturesEditor({
  value,
  onChange,
}: {
  value: FeaturesSettings;
  onChange: (v: FeaturesSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title={`ویژگی‌ها (${value.items.length})`}>
        <div className="space-y-3 sm:col-span-2">
          {value.items.map((f, i) => (
            <div key={i} className="space-y-2.5 rounded-2xl border border-gold-500/10 bg-forest-950/40 p-4">
              <div className="grid gap-2.5 sm:grid-cols-[160px_1fr_auto]">
                <IconSelect label="آیکون" value={f.icon} onChange={(icon) => onChange({ ...value, items: value.items.map((x, j) => (j === i ? { ...x, icon } : x)) })} />
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sage">عنوان</label>
                  <input value={f.title} onChange={(e) => onChange({ ...value, items: value.items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} className={inputCls} />
                </div>
                <button type="button" onClick={() => onChange({ ...value, items: value.items.filter((_, j) => j !== i) })} aria-label="حذف" className="grid size-11 place-items-center self-end rounded-xl border border-forest-600 text-sage transition-colors hover:border-red-500/50 hover:text-red-300">
                  <Trash2 size={15} />
                </button>
              </div>
              <textarea value={f.desc} onChange={(e) => onChange({ ...value, items: value.items.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)) })} rows={2} placeholder="توضیح..." className={areaCls} />
            </div>
          ))}
          <button type="button" onClick={() => onChange({ ...value, items: [...value.items, { icon: "BadgeCheck", title: "ویژگی جدید", desc: "" }] })} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gold-500/30 px-3 py-2.5 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500/10">
            <Plus size={14} />
            افزودن ویژگی
          </button>
        </div>
      </Card>
    </div>
  );
}
