"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { withBase } from "@/lib/public";
import {
  CARD_SIZES,
  COURSE_ICONS,
  COURSE_LAYOUTS,
  GALLERY_MODES,
  SOCIAL_NETWORKS,
  SUGGESTED_COURSE_IMAGES,
  TEXT_SIZES,
  type BodyAlign,
  type CourseCardSize,
  type CourseLayout,
  type CourseSocial,
  type GalleryMode,
  type SiteCourse,
  type TextSize,
} from "@/lib/site-defaults";

export interface CoursePayload {
  title: string;
  subtitle: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  images: string[];
  galleryMode: GalleryMode;
  layout: CourseLayout;
  cardSize: CourseCardSize;
  titleColor: string;
  textColor: string;
  accentColor: string;
  titleSize: TextSize;
  bodySize: TextSize;
  bodyAlign: BodyAlign;
  footerItems: { label: string; value: string }[];
  socials: CourseSocial[];
  sortOrder: number;
  isActive: boolean;
}

export function courseToPayload(c: SiteCourse): CoursePayload {
  return {
    title: c.title ?? "",
    subtitle: c.subtitle ?? "",
    shortDesc: c.shortDesc ?? "",
    fullDesc: c.fullDesc ?? "",
    icon: c.icon ?? "Sparkles",
    images: [...(c.images ?? [])],
    galleryMode: c.galleryMode,
    layout: c.layout,
    cardSize: c.cardSize,
    titleColor: c.titleColor ?? "",
    textColor: c.textColor ?? "",
    accentColor: c.accentColor ?? "",
    titleSize: c.titleSize,
    bodySize: c.bodySize,
    bodyAlign: c.bodyAlign,
    footerItems: (c.footerItems ?? []).map((f) => ({ ...f })),
    socials: (c.socials ?? []).map((s) => ({ ...s })),
    sortOrder: c.sortOrder ?? 0,
    isActive: c.isActive !== false,
  };
}

export const EMPTY_COURSE: CoursePayload = {
  title: "",
  subtitle: "",
  shortDesc: "",
  fullDesc: "",
  icon: "Sparkles",
  images: [],
  galleryMode: "featured",
  layout: "image-right",
  cardSize: "default",
  titleColor: "",
  textColor: "",
  accentColor: "",
  titleSize: "md",
  bodySize: "md",
  bodyAlign: "right",
  footerItems: [],
  socials: [],
  sortOrder: 0,
  isActive: true,
};

const inputCls =
  "h-11 w-full rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 text-sm outline-none placeholder:text-sage/50 focus:border-gold-500/50";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gold-500/10 bg-forest-950/40 p-4">
      <h4 className="mb-3 text-xs font-black tracking-wide text-gold-400">{title}</h4>
      {children}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-sage">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#c9a24b"}
          onChange={(e) => onChange(e.target.value)}
          className="size-11 shrink-0 cursor-pointer rounded-xl border border-gold-500/20 bg-forest-950 p-1"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="خودکار"
          dir="ltr"
          className={`${inputCls} text-left font-mono text-xs`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="حذف رنگ"
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-forest-600 text-sage"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function SiteCourseForm({
  initial,
  saving,
  error,
  onClose,
  onSubmit,
}: {
  initial: CoursePayload;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (p: CoursePayload) => void;
}) {
  const [form, setForm] = useState<CoursePayload>(initial);
  const [customImg, setCustomImg] = useState("");
  const set = <K extends keyof CoursePayload>(k: K, v: CoursePayload[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleSuggested = (url: string) => {
    setForm((f) => ({
      ...f,
      images: f.images.includes(url) ? f.images.filter((i) => i !== url) : [...f.images, url],
    }));
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-forest-950/75 backdrop-blur-sm"
      />
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] border border-gold-500/20 bg-forest-900 p-6 sm:rounded-[2rem] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">مشخصات دوره</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <Section title="۱ — متن اصلی">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-sage">عنوان *</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="آموزش مقدماتی" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-sage">زیرعنوان</label>
                <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputCls} placeholder="شروع درست از روز اول" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-sage">معرفی کوتاه (روی کارت) *</label>
                <textarea value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} rows={2} className="w-full resize-none rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-sm leading-7 outline-none focus:border-gold-500/50" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-sage">توضیح کامل (داخل کادر بازشونده)</label>
                <textarea value={form.fullDesc} onChange={(e) => set("fullDesc", e.target.value)} rows={6} placeholder="هر پاراگراف در یک خط جدا..." className="w-full resize-none rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-sm leading-7 outline-none focus:border-gold-500/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-sage">آیکون کارت</label>
                <select value={form.icon} onChange={(e) => set("icon", e.target.value)} className={inputCls}>
                  {COURSE_ICONS.map((ic) => (
                    <option key={ic} value={ic} className="bg-forest-900">{ic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-sage">ترتیب نمایش</label>
                <input value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} dir="ltr" inputMode="numeric" className={inputCls} />
              </div>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
                <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="size-4 accent-[#c9a24b]" />
                فعال و قابل نمایش
              </label>
            </div>
          </Section>

          <Section title="۲ — تصاویر (از نمونه‌ها انتخاب یا آدرس بدهید)">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SUGGESTED_COURSE_IMAGES.map((s) => {
                const on = form.images.includes(s.url);
                return (
                  <button
                    key={s.url}
                    type="button"
                    onClick={() => toggleSuggested(s.url)}
                    className={`relative overflow-hidden rounded-xl border-2 transition-all ${on ? "border-gold-400" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.url.startsWith("http") ? s.url : withBase(s.url)} alt={s.label} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                    <span className="absolute inset-x-0 bottom-0 bg-forest-950/75 px-2 py-1 text-center text-[10px] font-bold">
                      {s.label}
                    </span>
                    {on && (
                      <span className="absolute end-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-gold-500 text-forest-950">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={customImg} onChange={(e) => setCustomImg(e.target.value)} dir="ltr" placeholder="https://… آدرس عکس دلخواه" className={`${inputCls} text-left text-xs`} />
              <button
                type="button"
                onClick={() => {
                  if (customImg.trim() && !form.images.includes(customImg.trim())) {
                    set("images", [...form.images, customImg.trim()]);
                    setCustomImg("");
                  }
                }}
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-500 text-forest-950"
                aria-label="افزودن عکس"
              >
                <ImagePlus size={17} />
              </button>
            </div>
            {form.images.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {form.images.map((img, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-forest-950/70 px-3 py-2 text-xs">
                    <span className="font-bold text-gold-300">{i + 1}</span>
                    <span className="flex-1 truncate font-mono" dir="ltr">{img}</span>
                    <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))} aria-label="حذف" className="text-sage hover:text-red-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-bold text-sage">حالت نمایش عکس‌ها</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {GALLERY_MODES.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => set("galleryMode", g.value)}
                    className={`rounded-xl border px-3 py-2.5 text-start transition-all ${form.galleryMode === g.value ? "border-gold-400 bg-gold-500/10" : "border-forest-600 hover:border-gold-500/40"}`}
                  >
                    <span className="block text-xs font-black">{g.label}</span>
                    <span className="mt-1 block text-[10px] leading-5 text-sage">{g.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </Section>

          <Section title="۳ — چیدمان و اندازه">
            <div className="grid gap-2 sm:grid-cols-3">
              {COURSE_LAYOUTS.map((l) => (
                <button key={l.value} type="button" onClick={() => set("layout", l.value)} className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${form.layout === l.value ? "border-gold-400 bg-gold-500/10 text-gold-200" : "border-forest-600 text-sage hover:border-gold-500/40"}`}>
                  {l.label}
                </button>
              ))}
            </div>
            <label className="mb-1.5 mt-4 block text-xs font-bold text-sage">اندازه کادر جزئیات</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {CARD_SIZES.map((s) => (
                <button key={s.value} type="button" onClick={() => set("cardSize", s.value)} className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${form.cardSize === s.value ? "border-gold-400 bg-gold-500/10 text-gold-200" : "border-forest-600 text-sage hover:border-gold-500/40"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="۴ — رنگ و نوشتار">
            <div className="grid gap-4 sm:grid-cols-3">
              <ColorField label="رنگ عنوان" value={form.titleColor} onChange={(v) => set("titleColor", v)} />
              <ColorField label="رنگ متن" value={form.textColor} onChange={(v) => set("textColor", v)} />
              <ColorField label="رنگ تأکیدی (پاورقی)" value={form.accentColor} onChange={(v) => set("accentColor", v)} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-sage">اندازه عنوان</label>
                <select value={form.titleSize} onChange={(e) => set("titleSize", e.target.value as CoursePayload["titleSize"])} className={inputCls}>
                  {TEXT_SIZES.map((t) => (<option key={t.value} value={t.value} className="bg-forest-900">{t.label}</option>))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-sage">اندازه متن</label>
                <select value={form.bodySize} onChange={(e) => set("bodySize", e.target.value as CoursePayload["bodySize"])} className={inputCls}>
                  {TEXT_SIZES.map((t) => (<option key={t.value} value={t.value} className="bg-forest-900">{t.label}</option>))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-sage">تراز متن</label>
                <select value={form.bodyAlign} onChange={(e) => set("bodyAlign", e.target.value as CoursePayload["bodyAlign"])} className={inputCls}>
                  <option value="right" className="bg-forest-900">راست</option>
                  <option value="center" className="bg-forest-900">وسط</option>
                  <option value="justify" className="bg-forest-900">هم‌تراز</option>
                </select>
              </div>
            </div>
          </Section>

          <Section title="۵ — آیتم‌های پاورقی (مدت، سطح، قیمت...)">
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {form.footerItems.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2">
                    <input value={f.label} onChange={(e) => { const a = [...form.footerItems]; a[i] = { ...a[i], label: e.target.value }; set("footerItems", a); }} placeholder="برچسب (مثل مدت دوره)" className={inputCls} />
                    <input value={f.value} onChange={(e) => { const a = [...form.footerItems]; a[i] = { ...a[i], value: e.target.value }; set("footerItems", a); }} placeholder="مقدار" className={inputCls} />
                    <button type="button" onClick={() => set("footerItems", form.footerItems.filter((_, j) => j !== i))} aria-label="حذف" className="grid size-11 shrink-0 place-items-center rounded-xl border border-forest-600 text-sage hover:text-red-300">
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button type="button" onClick={() => set("footerItems", [...form.footerItems, { label: "", value: "" }])} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gold-500/40 px-4 py-2 text-xs font-bold text-gold-300">
                <Plus size={14} /> افزودن آیتم
              </button>
            </div>
          </Section>

          <Section title="۶ — شبکه‌های اجتماعی این دوره">
            <div className="space-y-2">
              {form.socials.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <select value={s.network} onChange={(e) => { const a = [...form.socials]; a[i] = { ...a[i], network: e.target.value as CourseSocial["network"] }; set("socials", a); }} className={`${inputCls} max-w-32`}>
                    {SOCIAL_NETWORKS.map((n) => (<option key={n.value} value={n.value} className="bg-forest-900">{n.label}</option>))}
                  </select>
                  <input value={s.url} onChange={(e) => { const a = [...form.socials]; a[i] = { ...a[i], url: e.target.value }; set("socials", a); }} dir="ltr" placeholder="https://… یا شماره" className={`${inputCls} text-left text-xs`} />
                  <button type="button" onClick={() => set("socials", form.socials.filter((_, j) => j !== i))} aria-label="حذف" className="grid size-11 shrink-0 place-items-center rounded-xl border border-forest-600 text-sage hover:text-red-300">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => set("socials", [...form.socials, { network: "instagram", url: "" }])} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gold-500/40 px-4 py-2 text-xs font-bold text-gold-300">
                <Plus size={14} /> افزودن شبکه
              </button>
            </div>
          </Section>
        </div>

        {error && <p className="mt-4 text-sm font-bold text-red-400">{error}</p>}

        <button type="submit" disabled={saving} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-3.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400 disabled:opacity-60">
          {saving && <Loader2 size={16} className="animate-spin" />}
          ذخیره دوره
        </button>
      </motion.form>
    </div>
  );
}
