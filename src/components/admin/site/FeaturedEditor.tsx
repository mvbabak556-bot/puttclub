"use client";

import type { FeaturedSettings } from "@/lib/site-schema";
import { Area, Card, Num, Text } from "./fields";

export default function FeaturedEditor({
  value,
  onChange,
}: {
  value: FeaturedSettings;
  onChange: (v: FeaturedSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="سربرگ بخش منتخب فروشگاه">
        <Text label="نشان" value={value.kicker} onChange={(v) => onChange({ ...value, kicker: v })} />
        <Text label="متن لینک گوشه" value={value.linkLabel} onChange={(v) => onChange({ ...value, linkLabel: v })} />
        <Text label="تیتر (بخش اول)" value={value.titleA} onChange={(v) => onChange({ ...value, titleA: v })} />
        <Text label="تیتر (بخش طلایی)" value={value.titleB} onChange={(v) => onChange({ ...value, titleB: v })} />
        <Num label="تعداد محصولات نمایشی" value={value.count} onChange={(v) => onChange({ ...value, count: v })} min={1} max={12} />
        <div className="sm:col-span-2">
          <Area label="توضیح" value={value.desc} onChange={(v) => onChange({ ...value, desc: v })} rows={2} />
        </div>
      </Card>
    </div>
  );
}
