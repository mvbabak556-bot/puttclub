"use client";

import type { LayoutSettings } from "@/lib/site-schema";
import { Card, Toggle } from "./fields";

const SECTIONS = [
  { key: "marquee", label: "نوار متحرک", desc: "نوار جمله‌های زیر هیرو" },
  { key: "about", label: "درباره آکادمی", desc: "معرفی + لوگو + اطلاعات تماس" },
  { key: "programs", label: "دوره‌ها", desc: "کارت‌های آموزشی + بنر فروشگاه" },
  { key: "featured", label: "منتخب فروشگاه", desc: "محصولات منتخب صفحه اصلی" },
  { key: "features", label: "ویژگی‌ها", desc: "ارسال، ضمانت، بازگشت، مشاوره" },
  { key: "quote", label: "بنر نقل‌قول", desc: "بنر تمام‌عرض با تصویر پس‌زمینه" },
  { key: "testimonials", label: "نظرات", desc: "نظر اعضا و گلف‌بازان" },
  { key: "contact", label: "تماس", desc: "کارت‌های تماس با آکادمی" },
  { key: "cta", label: "بنر عضویت", desc: "فرم عضویت در خبرنامه" },
] as const;

export default function LayoutEditor({
  value,
  onChange,
}: {
  value: LayoutSettings;
  onChange: (v: LayoutSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="نمایش بخش‌های صفحه اصلی">
        <div className="grid gap-3 sm:col-span-2">
          {SECTIONS.map((s) => (
            <Toggle
              key={s.key}
              label={s.label}
              desc={s.desc}
              checked={value.visibility[s.key]}
              onChange={(v) =>
                onChange({ ...value, visibility: { ...value.visibility, [s.key]: v } })
              }
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
