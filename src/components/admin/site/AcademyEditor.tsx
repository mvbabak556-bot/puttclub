"use client";

import type { AcademyEntrySettings } from "@/lib/site-schema";
import { Card, ImageField, Text } from "./fields";

export default function AcademyEditor({
  value,
  onChange,
}: {
  value: AcademyEntrySettings;
  onChange: (v: AcademyEntrySettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="صفحه ورود اعضای آکادمی">
        <Text label="نشان بالای تیتر" value={value.badge} onChange={(v) => onChange({ ...value, badge: v })} dir="ltr" />
        <Text label="تیتر صفحه" value={value.title} onChange={(v) => onChange({ ...value, title: v })} />
        <Text label="تیتر حالت انتظار" value={value.waitingTitle} onChange={(v) => onChange({ ...value, waitingTitle: v })} />
        <Text label="توضیح حالت انتظار" value={value.waitingDesc} onChange={(v) => onChange({ ...value, waitingDesc: v })} />
        <Text label="متن در حال انتقال" value={value.loadingText} onChange={(v) => onChange({ ...value, loadingText: v })} />
        <Text label="متن دکمه پنل" value={value.panelButton} onChange={(v) => onChange({ ...value, panelButton: v })} />
        <Text label="متن لینک بازگشت" value={value.backLabel} onChange={(v) => onChange({ ...value, backLabel: v })} />
        <div className="sm:col-span-2">
          <ImageField label="تصویر صفحه" value={value.image} onChange={(v) => onChange({ ...value, image: v })} />
        </div>
      </Card>
    </div>
  );
}
