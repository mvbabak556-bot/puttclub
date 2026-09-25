"use client";

import type { ProgramsSettings } from "@/lib/site-schema";
import { Area, Card, IconSelect, Text, areaCls, inputCls } from "./fields";
import { Plus, Trash2 } from "lucide-react";

export default function ProgramsEditor({
  value,
  onChange,
}: {
  value: ProgramsSettings;
  onChange: (v: ProgramsSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="سربرگ بخش">
        <Text label="نشان" value={value.kicker} onChange={(v) => onChange({ ...value, kicker: v })} />
        <Text label="لینک گوشه" value={value.linkLabel} onChange={(v) => onChange({ ...value, linkLabel: v })} />
        <Text label="تیتر (بخش اول)" value={value.titleA} onChange={(v) => onChange({ ...value, titleA: v })} />
        <Text label="تیتر (بخش طلایی)" value={value.titleB} onChange={(v) => onChange({ ...value, titleB: v })} />
        <Text label="آدرس لینک گوشه" value={value.linkHref} onChange={(v) => onChange({ ...value, linkHref: v })} dir="ltr" />
        <div className="sm:col-span-2">
          <Area label="توضیح" value={value.desc} onChange={(v) => onChange({ ...value, desc: v })} rows={2} />
        </div>
      </Card>
      <Card title={`دوره‌ها (${value.items.length})`}>
        <div className="space-y-3 sm:col-span-2">
          {value.items.map((p, i) => (
            <div key={i} className="space-y-2.5 rounded-2xl border border-gold-500/10 bg-forest-950/40 p-4">
              <div className="grid gap-2.5 sm:grid-cols-[160px_1fr_auto]">
                <IconSelect label="آیکون" value={p.icon} onChange={(icon) => onChange({ ...value, items: value.items.map((x, j) => (j === i ? { ...x, icon } : x)) })} />
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sage">عنوان</label>
                  <input value={p.title} onChange={(e) => onChange({ ...value, items: value.items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} className={inputCls} />
                </div>
                <button type="button" onClick={() => onChange({ ...value, items: value.items.filter((_, j) => j !== i) })} aria-label="حذف" className="grid size-11 place-items-center self-end rounded-xl border border-forest-600 text-sage transition-colors hover:border-red-500/50 hover:text-red-300">
                  <Trash2 size={15} />
                </button>
              </div>
              <textarea value={p.desc} onChange={(e) => onChange({ ...value, items: value.items.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)) })} rows={2} placeholder="توضیح دوره..." className={areaCls} />
            </div>
          ))}
          <button type="button" onClick={() => onChange({ ...value, items: [...value.items, { icon: "Flag", title: "دوره جدید", desc: "" }] })} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gold-500/30 px-3 py-2.5 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500/10">
            <Plus size={14} />
            افزودن دوره
          </button>
        </div>
      </Card>
      <Card title="بنر فروشگاه (پایین دوره‌ها)">
        <Text label="تیتر بنر" value={value.bannerTitle} onChange={(v) => onChange({ ...value, bannerTitle: v })} />
        <Text label="متن لینک بنر" value={value.bannerLink} onChange={(v) => onChange({ ...value, bannerLink: v })} />
        <div className="sm:col-span-2">
          <Area label="توضیح بنر" value={value.bannerDesc} onChange={(v) => onChange({ ...value, bannerDesc: v })} rows={2} />
        </div>
      </Card>
    </div>
  );
}
