"use client";

import type { ContactSettings } from "@/lib/site-schema";
import { Area, Card, Text } from "./fields";

export default function ContactEditor({
  value,
  onChange,
}: {
  value: ContactSettings;
  onChange: (v: ContactSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="سربرگ بخش">
        <Text label="نشان" value={value.kicker} onChange={(v) => onChange({ ...value, kicker: v })} />
        <Text label="تیتر (بخش اول)" value={value.titleA} onChange={(v) => onChange({ ...value, titleA: v })} />
        <Text label="تیتر (بخش طلایی)" value={value.titleB} onChange={(v) => onChange({ ...value, titleB: v })} />
        <div className="sm:col-span-2">
          <Area label="توضیح" value={value.desc} onChange={(v) => onChange({ ...value, desc: v })} rows={2} />
        </div>
      </Card>
      <Card title="عنوان کارت‌ها">
        <Text label="کارت تلفن" value={value.titles.phone} onChange={(v) => onChange({ ...value, titles: { ...value.titles, phone: v } })} />
        <Text label="کارت ایمیل" value={value.titles.email} onChange={(v) => onChange({ ...value, titles: { ...value.titles, email: v } })} />
        <Text label="کارت آدرس" value={value.titles.address} onChange={(v) => onChange({ ...value, titles: { ...value.titles, address: v } })} />
        <Text label="کارت اینستاگرام" value={value.titles.instagram} onChange={(v) => onChange({ ...value, titles: { ...value.titles, instagram: v } })} />
      </Card>
    </div>
  );
}
