"use client";

import type { ThemeSettings } from "@/lib/site-schema";
import { THEME_PRESETS } from "@/lib/site-schema";
import { Card, Color } from "./fields";
import { Check } from "lucide-react";

export default function ThemeEditor({
  value,
  onChange,
}: {
  value: ThemeSettings;
  onChange: (v: ThemeSettings) => void;
}) {
  const applyPreset = (key: string) => {
    const p = THEME_PRESETS[key];
    if (p) onChange({ ...value, preset: key, ...p.colors });
  };

  return (
    <div className="space-y-4">
      <Card title="قالب‌های آماده">
        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
          {Object.entries(THEME_PRESETS).map(([key, p]) => {
            const active = value.preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`rounded-2xl border p-4 text-start transition-all ${
                  active
                    ? "border-gold-500/60 bg-gold-500/10"
                    : "border-gold-500/10 bg-forest-950/40 hover:border-gold-500/30"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="text-sm font-black">{p.label}</span>
                  {active && (
                    <span className="grid size-6 place-items-center rounded-full bg-gold-500 text-forest-950">
                      <Check size={13} strokeWidth={3.5} />
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-[11px] text-sage">{p.desc}</span>
                <span className="mt-3 flex gap-1.5" dir="ltr">
                  {[p.colors.bg, p.colors.surface, p.colors.card, p.colors.primary, p.colors.text].map(
                    (c, i) => (
                      <span
                        key={i}
                        className="size-7 rounded-lg border border-white/10"
                        style={{ backgroundColor: c }}
                      />
                    )
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
      <Card title="رنگ‌های سفارشی">
        <Color label="پس‌زمینه اصلی" value={value.bg} onChange={(bg) => onChange({ ...value, bg, preset: "custom" })} />
        <Color label="پس‌زمینه سطح" value={value.surface} onChange={(surface) => onChange({ ...value, surface, preset: "custom" })} />
        <Color label="پس‌زمینه کارت‌ها" value={value.card} onChange={(card) => onChange({ ...value, card, preset: "custom" })} />
        <Color label="رنگ اصلی (طلایی)" value={value.primary} onChange={(primary) => onChange({ ...value, primary, preset: "custom" })} />
        <Color label="رنگ اصلی روشن" value={value.primaryLight} onChange={(primaryLight) => onChange({ ...value, primaryLight, preset: "custom" })} />
        <Color label="رنگ اصلی تیره" value={value.primaryDark} onChange={(primaryDark) => onChange({ ...value, primaryDark, preset: "custom" })} />
        <Color label="رنگ متن" value={value.text} onChange={(text) => onChange({ ...value, text, preset: "custom" })} />
        <Color label="رنگ متن کم‌رنگ" value={value.muted} onChange={(muted) => onChange({ ...value, muted, preset: "custom" })} />
      </Card>
    </div>
  );
}
