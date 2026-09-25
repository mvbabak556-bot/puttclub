"use client";

import type { FooterSettings, NavLink, NavSettings } from "@/lib/site-schema";
import { Card, Field, Text, inputCls } from "./fields";
import { Plus, Trash2 } from "lucide-react";

function LinkList({
  label,
  links,
  onChange,
}: {
  label: string;
  links: NavLink[];
  onChange: (v: NavLink[]) => void;
}) {
  return (
    <Field label={`${label} (${links.length})`}>
      <div className="space-y-2">
        {links.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
            <input
              value={l.label}
              onChange={(e) =>
                onChange(links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
              }
              placeholder="عنوان"
              className={inputCls}
            />
            <input
              value={l.href}
              onChange={(e) =>
                onChange(links.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))
              }
              placeholder="/shop"
              dir="ltr"
              className={`${inputCls} text-left font-mono text-xs`}
            />
            <button
              type="button"
              onClick={() => onChange(links.filter((_, j) => j !== i))}
              aria-label="حذف"
              className="grid size-11 place-items-center rounded-xl border border-forest-600 text-sage transition-colors hover:border-red-500/50 hover:text-red-300"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...links, { href: "/", label: "لینک جدید" }])}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gold-500/30 px-3 py-2.5 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500/10"
        >
          <Plus size={14} />
          افزودن لینک
        </button>
      </div>
    </Field>
  );
}

export function NavEditor({
  value,
  onChange,
}: {
  value: NavSettings;
  onChange: (v: NavSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="منوی بالای سایت (هدر)">
        <div className="sm:col-span-2">
          <LinkList label="لینک‌های منو" links={value.links} onChange={(links) => onChange({ ...value, links })} />
        </div>
        <Text label="متن دکمه ورود آکادمی در هدر" value={value.academyButton} onChange={(v) => onChange({ ...value, academyButton: v })} />
      </Card>
    </div>
  );
}

export function FooterEditor({
  value,
  onChange,
}: {
  value: FooterSettings;
  onChange: (v: FooterSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Card title="ستون برند و تماس">
        <div className="sm:col-span-2">
          <Text label="متن معرفی زیر لوگو" value={value.tagline} onChange={(v) => onChange({ ...value, tagline: v })} />
        </div>
        <Text label="تیتر ستون تماس" value={value.contactTitle} onChange={(v) => onChange({ ...value, contactTitle: v })} />
        <Text label="تیتر ستون دسته‌بندی‌ها" value={value.catsTitle} onChange={(v) => onChange({ ...value, catsTitle: v })} />
      </Card>
      <Card title="دسترسی سریع">
        <Text label="تیتر ستون" value={value.quickTitle} onChange={(v) => onChange({ ...value, quickTitle: v })} />
        <div className="sm:col-span-2">
          <LinkList label="لینک‌ها" links={value.quickLinks} onChange={(quickLinks) => onChange({ ...value, quickLinks })} />
        </div>
      </Card>
      <Card title="نوار پایانی">
        <Text label="متن کپی‌رایت" value={value.copyright} onChange={(v) => onChange({ ...value, copyright: v })} />
        <Text label="متن اعتبار (طراحی‌شده با...)" value={value.credit} onChange={(v) => onChange({ ...value, credit: v })} />
        <Text label="متن لینک ورود مدیران" value={value.adminLink} onChange={(v) => onChange({ ...value, adminLink: v })} />
      </Card>
    </div>
  );
}
