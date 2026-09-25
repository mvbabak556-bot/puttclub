"use client";

import type { AboutSettings } from "@/lib/site-schema";
import { Area, Card, ImageField, Text } from "./fields";

export default function AboutEditor({
  value,
  onChange,
}: {
  value: AboutSettings;
  onChange: (v: AboutSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="متن‌ها">
        <Text label="نشان بالای تیتر" value={value.kicker} onChange={(v) => onChange({ ...value, kicker: v })} />
        <Text label="کلمه پس‌زمینه (انگلیسی)" value={value.bgWord} onChange={(v) => onChange({ ...value, bgWord: v })} dir="ltr" />
        <div className="sm:col-span-2">
          <Area label="متن معرفی" value={value.desc} onChange={(v) => onChange({ ...value, desc: v })} rows={5} />
        </div>
      </Card>
      <Card title="تصویر">
        <div className="sm:col-span-2">
          <ImageField label="تصویر بخش درباره" value={value.image} onChange={(v) => onChange({ ...value, image: v })} />
        </div>
      </Card>
      <Card title="برچسب کارت‌های اطلاعات">
        <Text label="موقعیت" value={value.infoLabels.location} onChange={(v) => onChange({ ...value, infoLabels: { ...value.infoLabels, location: v } })} />
        <Text label="تلفن" value={value.infoLabels.phone} onChange={(v) => onChange({ ...value, infoLabels: { ...value.infoLabels, phone: v } })} />
        <Text label="ایمیل" value={value.infoLabels.email} onChange={(v) => onChange({ ...value, infoLabels: { ...value.infoLabels, email: v } })} />
        <Text label="اینستاگرام" value={value.infoLabels.instagram} onChange={(v) => onChange({ ...value, infoLabels: { ...value.infoLabels, instagram: v } })} />
      </Card>
      <Card title="دکمه‌ها">
        <Text label="متن دکمه اصلی" value={value.primaryLabel} onChange={(v) => onChange({ ...value, primaryLabel: v })} />
        <Text label="لینک دکمه اصلی" value={value.primaryHref} onChange={(v) => onChange({ ...value, primaryHref: v })} dir="ltr" />
        <Text label="متن دکمه دوم" value={value.secondaryLabel} onChange={(v) => onChange({ ...value, secondaryLabel: v })} />
        <Text label="لینک دکمه دوم" value={value.secondaryHref} onChange={(v) => onChange({ ...value, secondaryHref: v })} dir="ltr" />
      </Card>
    </div>
  );
}
