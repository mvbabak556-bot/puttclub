"use client";

import type { CtaSettings } from "@/lib/site-schema";
import { Area, Card, Text } from "./fields";

export default function CtaEditor({
  value,
  onChange,
}: {
  value: CtaSettings;
  onChange: (v: CtaSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="بنر عضویت در خبرنامه">
        <Text label="نشان بالای تیتر" value={value.badge} onChange={(v) => onChange({ ...value, badge: v })} />
        <Text label="تیتر (بخش اول)" value={value.titleA} onChange={(v) => onChange({ ...value, titleA: v })} />
        <Text label="تیتر (بخش طلایی)" value={value.titleB} onChange={(v) => onChange({ ...value, titleB: v })} />
        <div className="sm:col-span-2">
          <Area label="توضیح" value={value.desc} onChange={(v) => onChange({ ...value, desc: v })} rows={2} />
        </div>
        <Text label="متن داخل کادر ایمیل" value={value.placeholder} onChange={(v) => onChange({ ...value, placeholder: v })} />
        <Text label="متن دکمه" value={value.button} onChange={(v) => onChange({ ...value, button: v })} />
        <div className="sm:col-span-2">
          <Text label="پیام موفقیت" value={value.success} onChange={(v) => onChange({ ...value, success: v })} />
        </div>
      </Card>
    </div>
  );
}
