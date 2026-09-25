"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Plus, RotateCcw, Trash2 } from "lucide-react";
import SiteIcon from "@/components/site/SiteIcon";
import { ICON_OPTIONS } from "@/lib/site-schema";
import { withBase } from "@/lib/public";

export const inputCls =
  "h-11 w-full rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 text-sm text-cream outline-none transition-colors placeholder:text-sage/50 focus:border-gold-500/50";

export const areaCls =
  "w-full resize-y rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-sm leading-7 text-cream outline-none transition-colors placeholder:text-sage/50 focus:border-gold-500/50";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-sage">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] leading-5 text-sage/70">{hint}</p>}
    </div>
  );
}

export function Text({
  label,
  value,
  onChange,
  dir,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        placeholder={placeholder}
        className={inputCls}
      />
    </Field>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={areaCls}
      />
    </Field>
  );
}

export function Num({
  label,
  value,
  onChange,
  min = 1,
  max = 12,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        dir="ltr"
        className={inputCls}
      />
    </Field>
  );
}

export function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-start transition-all ${
        checked
          ? "border-gold-500/40 bg-gold-500/10"
          : "border-gold-500/10 bg-forest-950/40"
      }`}
    >
      <span>
        <span className="block text-sm font-bold">{label}</span>
        {desc && <span className="mt-0.5 block text-[11px] text-sage">{desc}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-gold-500" : "bg-forest-700"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-forest-950 transition-all ${
            checked ? "start-6" : "start-1"
          }`}
        />
      </span>
    </button>
  );
}

export function Color({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#c9a24b"}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-gold-500/15 bg-forest-950/60 p-1.5"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="ltr"
          maxLength={7}
          className={`${inputCls} font-mono`}
        />
      </div>
    </Field>
  );
}

export function IconSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-gold-500/15 bg-forest-950/60 text-gold-400">
          <SiteIcon name={value} size={18} />
        </span>
        <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
          {ICON_OPTIONS.map((n) => (
            <option key={n} value={n} className="bg-forest-900">
              {n}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
}

const resolveSrc = (v: string) => (/^(https?:|data:|blob:)/.test(v) ? v : withBase(v));

export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [warn, setWarn] = useState("");

  const pick = () => fileRef.current?.click();

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setWarn("فقط فایل تصویری انتخاب کنید.");
      return;
    }
    if (f.size > 900 * 1024) {
      setWarn("حجم عکس زیاد است (حداکثر حدود ۹۰۰ کیلوبایت)؛ عکس کم‌حجم‌تری انتخاب کنید.");
      return;
    }
    setWarn("");
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || ""));
    reader.readAsDataURL(f);
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-col gap-2.5 rounded-2xl border border-gold-500/15 bg-forest-950/40 p-3 sm:flex-row sm:items-center">
        <span className="relative block h-20 w-full shrink-0 overflow-hidden rounded-xl border border-gold-500/10 bg-white sm:w-28">
          {value ? (
            <Image src={resolveSrc(value)} alt="پیش‌نمایش" fill sizes="112px" className="object-contain" />
          ) : (
            <span className="grid size-full place-items-center text-[11px] text-sage">بدون عکس</span>
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            value={value.startsWith("data:") ? "(عکس آپلودشده)" : value}
            onChange={(e) => onChange(e.target.value)}
            dir="ltr"
            placeholder="/images/....jpg یا https://..."
            className={`${inputCls} text-left font-mono text-xs`}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={pick}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gold-500/30 px-3 py-2 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500/10"
            >
              <ImagePlus size={14} />
              آپلود عکس
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            {value.startsWith("data:") && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-forest-600 px-3 py-2 text-xs font-bold text-sage"
              >
                <RotateCcw size={13} />
                پاک
              </button>
            )}
          </div>
        </div>
      </div>
      {warn && <p className="mt-1.5 text-[11px] font-bold text-red-400">{warn}</p>}
    </Field>
  );
}

/** لیست متن‌های ساده (افزودن/حذف/ویرایش) */
export function StringList({
  label,
  items,
  onChange,
  placeholder = "متن جدید...",
  addLabel = "افزودن",
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <Field label={`${label} (${items.length})`}>
      <div className="space-y-2">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={t}
              onChange={(e) =>
                onChange(items.map((x, j) => (j === i ? e.target.value : x)))
              }
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              aria-label="حذف"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-forest-600 text-sage transition-colors hover:border-red-500/50 hover:text-red-300"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gold-500/30 px-3 py-2.5 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500/10"
        >
          <Plus size={14} />
          {addLabel}
        </button>
        {!placeholder ? null : null}
      </div>
    </Field>
  );
}

export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-5 sm:p-6">
      <h3 className="mb-5 text-sm font-black text-gold-300">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function SaveBar({
  onSave,
  saving,
  saved,
  error,
}: {
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  error: string;
}) {
  return (
    <div className="sticky bottom-4 z-20 mt-6 flex flex-wrap items-center gap-3 rounded-3xl border border-gold-500/20 bg-forest-950/90 p-4 backdrop-blur">
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        ذخیره این بخش
      </button>
      {saved && <span className="text-xs font-bold text-emerald-300">✓ ذخیره شد</span>}
      {error && <span className="text-xs font-bold text-red-400">{error}</span>}
      <span className="ms-auto hidden text-[11px] text-sage sm:block">
        تغییرات بلافاصله روی سایت اعمال می‌شود
      </span>
    </div>
  );
}
