"use client";

import type { HeroSettings } from "@/lib/site-schema";
import { Area, Card, Field, ImageField, Text, inputCls } from "./fields";
import { Plus, Trash2 } from "lucide-react";

export default function HeroEditor({
  value,
  onChange,
}: {
  value: HeroSettings;
  onChange: (v: HeroSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="متن‌ها">
        <Text label="نشان بالای تیتر" value={value.badge} onChange={(v) => onChange({ ...value, badge: v })} />
        <Text label="خط اول تیتر" value={value.title1} onChange={(v) => onChange({ ...value, title1: v })} />
        <Text label="خط دوم تیتر (طلایی)" value={value.title2} onChange={(v) => onChange({ ...value, title2: v })} />
        <div className="sm:col-span-2">
          <Area label="زیرنویس" value={value.subtitle} onChange={(v) => onChange({ ...value, subtitle: v })} rows={3} />
        </div>
      </Card>
      <Card title="دکمه‌ها">
        <Text label="متن دکمه اصلی" value={value.primaryLabel} onChange={(v) => onChange({ ...value, primaryLabel: v })} />
        <Text label="لینک دکمه اصلی" value={value.primaryHref} onChange={(v) => onChange({ ...value, primaryHref: v })} dir="ltr" />
        <Text label="متن دکمه دوم" value={value.secondaryLabel} onChange={(v) => onChange({ ...value, secondaryLabel: v })} />
        <Text label="لینک دکمه دوم" value={value.secondaryHref} onChange={(v) => onChange({ ...value, secondaryHref: v })} dir="ltr" />
      </Card>
      <Card title="ویدیو و پوستر پس‌زمینه">
        <div className="sm:col-span-2">
          <Text label="آدرس ویدیو" value={value.video} onChange={(v) => onChange({ ...value, video: v })} dir="ltr" hint="مثل /videos/golf-hero.mp4 یا لینک مستقیم mp4" />
        </div>
        <div className="sm:col-span-2">
          <ImageField label="پوستر ویدیو (نمایش قبل از پخش)" value={value.poster} onChange={(v) => onChange({ ...value, poster: v })} />
        </div>
      </Card>
      <Card title={`آمار زیر هیرو (${value.stats.length})`}>
        <div className="space-y-2 sm:col-span-2">
          {value.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
              <input value={s.value} onChange={(e) => onChange({ ...value, stats: value.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} placeholder="مقدار" className={inputCls} />
              <input value={s.label} onChange={(e) => onChange({ ...value, stats: value.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} placeholder="برچسب" className={inputCls} />
              <button type="button" onClick={() => onChange({ ...value, stats: value.stats.filter((_, j) => j !== i) })} aria-label="حذف" className="grid size-11 place-items-center rounded-xl border border-forest-600 text-sage transition-colors hover:border-red-500/50 hover:text-red-300">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onChange({ ...value, stats: [...value.stats, { value: "", label: "" }] })} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gold-500/30 px-3 py-2.5 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500/10">
            <Plus size={14} />
            افزودن آمار
          </button>
        </div>
      </Card>
    </div>
  );
}
