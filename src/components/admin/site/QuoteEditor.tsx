"use client";

import type { QuoteSettings } from "@/lib/site-schema";
import { Card, ImageField, Text } from "./fields";

export default function QuoteEditor({
  value,
  onChange,
}: {
  value: QuoteSettings;
  onChange: (v: QuoteSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="متن نقل‌قول">
        <Text label="خط اول" value={value.line1} onChange={(v) => onChange({ ...value, line1: v })} />
        <Text label="کلمه طلایی خط اول" value={value.line1Gold} onChange={(v) => onChange({ ...value, line1Gold: v })} />
        <Text label="خط دوم" value={value.line2} onChange={(v) => onChange({ ...value, line2: v })} />
        <Text label="امضا / نویسنده" value={value.author} onChange={(v) => onChange({ ...value, author: v })} />
      </Card>
      <Card title="تصویر پس‌زمینه">
        <div className="sm:col-span-2">
          <ImageField label="عکس بنر" value={value.image} onChange={(v) => onChange({ ...value, image: v })} />
        </div>
        <div className="sm:col-span-2">
          <Text label="متن جایگزین عکس" value={value.imageAlt} onChange={(v) => onChange({ ...value, imageAlt: v })} />
        </div>
      </Card>
    </div>
  );
}
