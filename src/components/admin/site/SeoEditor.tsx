"use client";

import type { SeoSettings } from "@/lib/site-schema";
import { Area, Card, ImageField, Text } from "./fields";

export default function SeoEditor({
  value,
  onChange,
}: {
  value: SeoSettings;
  onChange: (v: SeoSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="سئو و تب مرورگر">
        <div className="sm:col-span-2">
          <Text label="عنوان سایت (تب مرورگر و گوگل)" value={value.title} onChange={(v) => onChange({ ...value, title: v })} />
        </div>
        <div className="sm:col-span-2">
          <Area label="توضیحات متا" value={value.description} onChange={(v) => onChange({ ...value, description: v })} rows={3} />
        </div>
        <div className="sm:col-span-2">
          <ImageField label="آیکون سایت (فاوآیکون)" value={value.favicon} onChange={(v) => onChange({ ...value, favicon: v })} hint="نمایش در تب مرورگر؛ مثل /favicon.ico" />
        </div>
      </Card>
    </div>
  );
}
