"use client";

import type { MarqueeSettings } from "@/lib/site-schema";
import { Card, StringList } from "./fields";

export default function MarqueeEditor({
  value,
  onChange,
}: {
  value: MarqueeSettings;
  onChange: (v: MarqueeSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="جمله‌های نوار متحرک">
        <div className="sm:col-span-2">
          <StringList
            label="جمله‌ها"
            items={value.items}
            onChange={(items) => onChange({ ...value, items })}
            addLabel="افزودن جمله"
          />
        </div>
      </Card>
    </div>
  );
}
