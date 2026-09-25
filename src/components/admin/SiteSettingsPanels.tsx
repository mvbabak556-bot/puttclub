"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { adminFetch, isDemoResponse } from "@/lib/admin";
import { DEFAULT_SITE_SETTINGS, type MenuItem, type SiteSettings } from "@/lib/site-defaults";

const inputCls =
  "h-11 w-full rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 text-sm outline-none placeholder:text-sage/50 focus:border-gold-500/50";

function useAdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [demo, setDemo] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await adminFetch("/api/admin/site/settings");
      if (isDemoResponse(res)) {
        setDemo(true);
        let obj: Record<string, unknown> = {};
        try {
          const snap = await fetch("/data/site-settings.json");
          if (snap.ok) {
            const arr = (await snap.json()) as { key: string; value: unknown }[];
            for (const row of arr) obj[row.key] = row.value;
          }
        } catch {
          /* noop */
        }
        try {
          const local = localStorage.getItem("puttclub_demo_site-settings");
          if (local) Object.assign(obj, JSON.parse(local));
        } catch {
          /* noop */
        }
        setSettings({ ...DEFAULT_SITE_SETTINGS, ...obj } as SiteSettings);
        return;
      }
      const data = await res!.json();
      setSettings({ ...DEFAULT_SITE_SETTINGS, ...data.settings });
    })();
  }, []);

  const save = async <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSavingKey(key);
    if (demo) {
      try {
        const raw = localStorage.getItem("puttclub_demo_site-settings") || "{}";
        const obj = JSON.parse(raw);
        obj[key] = value;
        localStorage.setItem("puttclub_demo_site-settings", JSON.stringify(obj));
      } catch {
        /* noop */
      }
      setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
      setSavingKey(null);
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2500);
      return;
    }
    const res = await adminFetch("/api/admin/site/settings", {
      method: "PUT",
      body: JSON.stringify({ key, value }),
    });
    if (res && res.ok) {
      setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2500);
    }
    setSavingKey(null);
  };

  return { settings, setSettings, demo, save, savingKey, savedKey };
}

function SaveBar({
  onSave,
  saving,
  saved,
}: {
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
      >
        {saving && <Loader2 size={15} className="animate-spin" />}
        ذخیره
      </button>
      {saved && (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
          <CheckCircle2 size={15} />
          ذخیره شد
        </span>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-sage">{label}</label>
      {children}
    </div>
  );
}

function DemoBadge() {
  return (
    <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
      حالت نمایشی
    </span>
  );
}

function Loading() {
  return (
    <div className="flex justify-center py-24">
      <Loader2 size={30} className="animate-spin text-gold-400" />
    </div>
  );
}

/* ---------------- محتوا و تصاویر ---------------- */

export function ContentPanels() {
  const { settings, setSettings, demo, save, savingKey, savedKey } = useAdminSettings();
  if (!settings) return <Loading />;
  const s = settings;
  const patch = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings({ ...s, [key]: value });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black">محتوا و تصاویر</h1>
        {demo && <DemoBadge />}
      </div>

      {/* برند */}
      <section className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
        <h2 className="text-base font-black">نام و لوگوی برند</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="نام فارسی">
            <input value={s.brand.faName} onChange={(e) => patch("brand", { ...s.brand, faName: e.target.value })} className={inputCls} />
          </Field>
          <Field label="نام کوتاه">
            <input value={s.brand.faShort} onChange={(e) => patch("brand", { ...s.brand, faShort: e.target.value })} className={inputCls} />
          </Field>
          <Field label="نام انگلیسی">
            <input value={s.brand.enName} onChange={(e) => patch("brand", { ...s.brand, enName: e.target.value })} dir="ltr" className={`${inputCls} text-left`} />
          </Field>
          <Field label="برچسب زیر لوگو">
            <input value={s.brand.tagline} onChange={(e) => patch("brand", { ...s.brand, tagline: e.target.value })} className={inputCls} />
          </Field>
          <Field label="آدرس فایل لوگو">
            <input value={s.brand.logo} onChange={(e) => patch("brand", { ...s.brand, logo: e.target.value })} dir="ltr" className={`${inputCls} text-left font-mono text-xs`} />
          </Field>
          <Field label="آدرس لوگوی باکیفیت">
            <input value={s.brand.logoHd} onChange={(e) => patch("brand", { ...s.brand, logoHd: e.target.value })} dir="ltr" className={`${inputCls} text-left font-mono text-xs`} />
          </Field>
        </div>
        <SaveBar onSave={() => save("brand", s.brand)} saving={savingKey === "brand"} saved={savedKey === "brand"} />
      </section>

      {/* هیرو */}
      <section className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
        <h2 className="text-base font-black">سربرگ صفحه اصلی (هیرو)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="نشان بالای تیتر">
            <input value={s.hero.badge} onChange={(e) => patch("hero", { ...s.hero, badge: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="خط اول تیتر">
              <input value={s.hero.line1} onChange={(e) => patch("hero", { ...s.hero, line1: e.target.value })} className={inputCls} />
            </Field>
            <Field label="خط دوم (طلایی)">
              <input value={s.hero.line2} onChange={(e) => patch("hero", { ...s.hero, line2: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="زیرتیتر">
              <textarea value={s.hero.subtitle} onChange={(e) => patch("hero", { ...s.hero, subtitle: e.target.value })} rows={2} className="w-full resize-none rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-sm leading-7 outline-none focus:border-gold-500/50" />
            </Field>
          </div>
          {s.hero.stats.map((st, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 rounded-2xl border border-gold-500/10 p-3">
              <Field label={`آمار ${i + 1} — مقدار`}>
                <input value={st.value} onChange={(e) => { const a = [...s.hero.stats]; a[i] = { ...a[i], value: e.target.value }; patch("hero", { ...s.hero, stats: a }); }} className={inputCls} />
              </Field>
              <Field label="برچسب">
                <input value={st.label} onChange={(e) => { const a = [...s.hero.stats]; a[i] = { ...a[i], label: e.target.value }; patch("hero", { ...s.hero, stats: a }); }} className={inputCls} />
              </Field>
            </div>
          ))}
        </div>
        <SaveBar onSave={() => save("hero", s.hero)} saving={savingKey === "hero"} saved={savedKey === "hero"} />
      </section>

      {/* درباره */}
      <section className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
        <h2 className="text-base font-black">بخش «آکادمی ما» + تصویر</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="برچسب کوچک">
            <input value={s.about.kicker} onChange={(e) => patch("about", { ...s.about, kicker: e.target.value })} className={inputCls} />
          </Field>
          <Field label="تیتر">
            <input value={s.about.title} onChange={(e) => patch("about", { ...s.about, title: e.target.value })} className={inputCls} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="پاراگراف‌ها (هر خط یک پاراگراف)">
              <textarea value={s.about.paragraphs.join("\n")} onChange={(e) => patch("about", { ...s.about, paragraphs: e.target.value.split("\n") })} rows={4} className="w-full resize-none rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-sm leading-7 outline-none focus:border-gold-500/50" />
            </Field>
          </div>
          <Field label="آدرس تصویر بخش">
            <input value={s.about.image} onChange={(e) => patch("about", { ...s.about, image: e.target.value })} dir="ltr" className={`${inputCls} text-left font-mono text-xs`} />
          </Field>
          <Field label="متن زیر تصویر">
            <input value={s.about.imageCaption} onChange={(e) => patch("about", { ...s.about, imageCaption: e.target.value })} className={inputCls} />
          </Field>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {s.about.image && <img src={s.about.image} alt="پیش‌نمایش" className="mt-4 aspect-video w-full max-w-md rounded-2xl border border-gold-500/15 object-cover" loading="lazy" />}
        <SaveBar onSave={() => save("about", s.about)} saving={savingKey === "about"} saved={savedKey === "about"} />
      </section>

      {/* سربرگ بخش‌ها */}
      <section className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
        <h2 className="text-base font-black">سربرگ بخش دوره‌ها</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="برچسب کوچک">
            <input value={s.coursesSection.kicker} onChange={(e) => patch("coursesSection", { ...s.coursesSection, kicker: e.target.value })} className={inputCls} />
          </Field>
          <Field label="توضیح">
            <input value={s.coursesSection.desc} onChange={(e) => patch("coursesSection", { ...s.coursesSection, desc: e.target.value })} className={inputCls} />
          </Field>
          <Field label="تیتر">
            <input value={s.coursesSection.title} onChange={(e) => patch("coursesSection", { ...s.coursesSection, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="بخش طلایی تیتر">
            <input value={s.coursesSection.titleAccent} onChange={(e) => patch("coursesSection", { ...s.coursesSection, titleAccent: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <SaveBar onSave={() => save("coursesSection", s.coursesSection)} saving={savingKey === "coursesSection"} saved={savedKey === "coursesSection"} />
      </section>

      <section className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
        <h2 className="text-base font-black">سربرگ بخش نظرات + متن پاورقی</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="برچسب کوچک نظرات">
            <input value={s.testimonialsSection.kicker} onChange={(e) => patch("testimonialsSection", { ...s.testimonialsSection, kicker: e.target.value })} className={inputCls} />
          </Field>
          <Field label="توضیح نظرات">
            <input value={s.testimonialsSection.desc} onChange={(e) => patch("testimonialsSection", { ...s.testimonialsSection, desc: e.target.value })} className={inputCls} />
          </Field>
          <Field label="تیتر نظرات">
            <input value={s.testimonialsSection.title} onChange={(e) => patch("testimonialsSection", { ...s.testimonialsSection, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="بخش طلایی تیتر نظرات">
            <input value={s.testimonialsSection.titleAccent} onChange={(e) => patch("testimonialsSection", { ...s.testimonialsSection, titleAccent: e.target.value })} className={inputCls} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="متن درباره در پاورقی">
              <textarea value={s.footer.aboutText} onChange={(e) => patch("footer", { ...s.footer, aboutText: e.target.value })} rows={2} className="w-full resize-none rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-sm leading-7 outline-none focus:border-gold-500/50" />
            </Field>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <SaveBar onSave={() => save("testimonialsSection", s.testimonialsSection)} saving={savingKey === "testimonialsSection"} saved={savedKey === "testimonialsSection"} />
          <SaveBar onSave={() => save("footer", s.footer)} saving={savingKey === "footer"} saved={savedKey === "footer"} />
        </div>
      </section>
    </div>
  );
}

/* ---------------- قالب ---------------- */

const THEME_FIELDS: { key: keyof SiteSettings["theme"]; label: string }[] = [
  { key: "gold500", label: "طلایی اصلی (دکمه‌ها)" },
  { key: "gold400", label: "طلایی روشن (آیکون‌ها)" },
  { key: "gold300", label: "طلایی ملایم (متن‌ها)" },
  { key: "gold600", label: "طلایی تیره" },
  { key: "forest950", label: "پس‌زمینه اصلی" },
  { key: "forest900", label: "پس‌زمینه کارت‌ها" },
  { key: "forest800", label: "پس‌زمینه تیره‌تر" },
  { key: "cream", label: "رنگ متن اصلی" },
  { key: "sage", label: "رنگ متن فرعی" },
];

export function ThemePanel() {
  const { settings, setSettings, demo, save, savingKey, savedKey } = useAdminSettings();
  if (!settings) return <Loading />;
  const t = settings.theme;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">قالب و رنگ‌بندی برند</h1>
          <p className="mt-1.5 text-xs leading-6 text-sage">
            این رنگ‌ها همان CSS variableهای قالب‌اند و بلافاصله روی کل سایت اعمال می‌شوند.
          </p>
        </div>
        {demo && <DemoBadge />}
      </div>
      <div className="mt-6 grid gap-4 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {THEME_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-xs font-bold text-sage">{f.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={t[f.key]}
                onChange={(e) => setSettings({ ...settings, theme: { ...t, [f.key]: e.target.value } })}
                className="size-11 shrink-0 cursor-pointer rounded-xl border border-gold-500/20 bg-forest-950 p-1"
              />
              <input
                value={t[f.key]}
                onChange={(e) => setSettings({ ...settings, theme: { ...t, [f.key]: e.target.value } })}
                dir="ltr"
                className={`${inputCls} text-left font-mono text-xs`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
        <h2 className="text-sm font-black">پیش‌نمایش زنده</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl p-5" style={{ background: t.forest950, border: `1px solid ${t.gold500}33` }}>
          <span className="rounded-full px-5 py-2.5 text-sm font-black" style={{ background: t.gold500, color: t.forest950 }}>
            دکمه نمونه
          </span>
          <span className="text-sm font-bold" style={{ color: t.gold300 }}>متن طلایی ملایم</span>
          <span className="text-sm" style={{ color: t.cream }}>متن اصلی</span>
          <span className="text-xs" style={{ color: t.sage }}>متن فرعی</span>
        </div>
      </div>
      <SaveBar onSave={() => save("theme", t)} saving={savingKey === "theme"} saved={savedKey === "theme"} />
    </div>
  );
}

/* ---------------- تماس ---------------- */

export function ContactPanel() {
  const { settings, setSettings, demo, save, savingKey, savedKey } = useAdminSettings();
  if (!settings) return <Loading />;
  const c = settings.contact;
  const set = (k: keyof typeof c, v: string) =>
    setSettings({ ...settings, contact: { ...c, [k]: v } });

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black">اطلاعات تماس</h1>
        {demo && <DemoBadge />}
      </div>
      <div className="mt-6 grid gap-3 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6 sm:grid-cols-2">
        <Field label="تلفن (انگلیسی)">
          <input value={c.phone} onChange={(e) => set("phone", e.target.value)} dir="ltr" className={`${inputCls} text-left`} />
        </Field>
        <Field label="تلفن نمایشی (فارسی)">
          <input value={c.phoneFa} onChange={(e) => set("phoneFa", e.target.value)} className={inputCls} />
        </Field>
        <Field label="ایمیل">
          <input value={c.email} onChange={(e) => set("email", e.target.value)} dir="ltr" className={`${inputCls} text-left`} />
        </Field>
        <Field label="آدرس">
          <input value={c.address} onChange={(e) => set("address", e.target.value)} className={inputCls} />
        </Field>
        <Field label="آیدی اینستاگرام">
          <input value={c.instagram} onChange={(e) => set("instagram", e.target.value)} dir="ltr" className={`${inputCls} text-left`} />
        </Field>
        <Field label="لینک اینستاگرام">
          <input value={c.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} dir="ltr" className={`${inputCls} text-left font-mono text-xs`} />
        </Field>
        <Field label="تلگرام (لینک کامل)">
          <input value={c.telegram} onChange={(e) => set("telegram", e.target.value)} dir="ltr" placeholder="https://t.me/…" className={`${inputCls} text-left font-mono text-xs`} />
        </Field>
        <Field label="واتساپ (لینک)">
          <input value={c.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} dir="ltr" placeholder="https://wa.me/…" className={`${inputCls} text-left font-mono text-xs`} />
        </Field>
        <Field label="وب‌سایت">
          <input value={c.siteUrl} onChange={(e) => set("siteUrl", e.target.value)} dir="ltr" className={`${inputCls} text-left font-mono text-xs`} />
        </Field>
        <Field label="دامنه نمایشی">
          <input value={c.domain} onChange={(e) => set("domain", e.target.value)} dir="ltr" className={`${inputCls} text-left`} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="ساعات کاری">
            <input value={c.hours} onChange={(e) => set("hours", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </div>
      <SaveBar onSave={() => save("contact", c)} saving={savingKey === "contact"} saved={savedKey === "contact"} />
    </div>
  );
}

/* ---------------- منو ---------------- */

export function MenuPanel() {
  const { settings, setSettings, demo, save, savingKey, savedKey } = useAdminSettings();
  if (!settings) return <Loading />;
  const menu = settings.menu;
  const setMenu = (m: MenuItem[]) => setSettings({ ...settings, menu: m });

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">منوی بالای سایت</h1>
          <p className="mt-1.5 text-xs leading-6 text-sage">ترتیب، نام و نمایش هر آیتم منو.</p>
        </div>
        {demo && <DemoBadge />}
      </div>
      <div className="mt-6 space-y-2.5">
        {menu.map((m, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 rounded-2xl border border-gold-500/10 bg-forest-900/70 p-3">
            <input
              value={m.label}
              onChange={(e) => { const a = [...menu]; a[i] = { ...a[i], label: e.target.value }; setMenu(a); }}
              placeholder="نام"
              className={`${inputCls} min-w-28 flex-1`}
            />
            <input
              value={m.href}
              onChange={(e) => { const a = [...menu]; a[i] = { ...a[i], href: e.target.value }; setMenu(a); }}
              dir="ltr"
              placeholder="/#programs"
              className={`${inputCls} min-w-32 flex-1 text-left font-mono text-xs`}
            />
            <button
              onClick={() => { const a = [...menu]; a[i] = { ...a[i], visible: !a[i].visible }; setMenu(a); }}
              aria-label="نمایش/مخفی"
              className={`grid size-11 shrink-0 place-items-center rounded-xl border transition-colors ${m.visible ? "border-gold-500/40 text-gold-300" : "border-forest-600 text-sage"}`}
            >
              {m.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => setMenu(menu.filter((_, j) => j !== i))}
              aria-label="حذف"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-forest-600 text-sage hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          onClick={() => setMenu([...menu, { label: "", href: "/", visible: true }])}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gold-500/40 px-5 py-2.5 text-xs font-bold text-gold-300"
        >
          <Plus size={14} /> افزودن آیتم منو
        </button>
      </div>
      <SaveBar onSave={() => save("menu", menu)} saving={savingKey === "menu"} saved={savedKey === "menu"} />
    </div>
  );
}
