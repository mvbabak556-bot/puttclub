"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, LockKeyhole, Store } from "lucide-react";
import { adminFetch, isDemoResponse } from "@/lib/admin";
import { withBase } from "@/lib/public";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-defaults";
import { faNum } from "@/lib/format";

const inputCls =
  "h-11 w-full rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 text-sm outline-none placeholder:text-sage/50 focus:border-gold-500/50";

interface GateForm {
  enabled: boolean;
  showOnShop: boolean;
  showOnCheckout: boolean;
  title: string;
  message: string;
  backLabel: string;
  code: string;
  overlayOpacity: number;
  overlayBlur: number;
}

function toNum(v: unknown, fb: number, min: number, max: number): number {
  const n = typeof v === "number" ? v : typeof v === "string" && v !== "" ? Number(v) : NaN;
  if (!Number.isFinite(n)) return fb;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function toForm(v: unknown): GateForm {
  const d = DEFAULT_SITE_SETTINGS.shopGate;
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return {
    enabled: typeof o.enabled === "boolean" ? o.enabled : d.enabled,
    showOnShop: typeof o.showOnShop === "boolean" ? o.showOnShop : d.showOnShop,
    showOnCheckout:
      typeof o.showOnCheckout === "boolean" ? o.showOnCheckout : d.showOnCheckout,
    title: typeof o.title === "string" && o.title ? o.title : d.title,
    message: typeof o.message === "string" && o.message ? o.message : d.message,
    backLabel: typeof o.backLabel === "string" && o.backLabel ? o.backLabel : d.backLabel,
    code: typeof o.code === "string" && o.code.trim() ? o.code.trim() : d.code,
    overlayOpacity: toNum(o.overlayOpacity, d.overlayOpacity, 0, 95),
    overlayBlur: toNum(o.overlayBlur, d.overlayBlur, 0, 24),
  };
}

/** مدیریت پاپ‌آپ «به‌زودی» فروشگاه — روشن/خاموش، متن‌ها و رمز مخفی ورود */
export default function ShopGateManager() {
  const [form, setForm] = useState<GateForm | null>(null);
  const [demo, setDemo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await adminFetch("/api/admin/site/settings");
      if (isDemoResponse(res)) {
        setDemo(true);
        let value: unknown = null;
        try {
          const snap = await fetch(withBase("/data/site-settings.json"));
          if (snap.ok) {
            const arr = (await snap.json()) as { key: string; value: unknown }[];
            value = arr.find((r) => r.key === "shopGate")?.value ?? null;
          }
        } catch {
          /* noop */
        }
        try {
          const local = localStorage.getItem("puttclub_demo_site-settings");
          if (local) {
            const obj = JSON.parse(local) as Record<string, unknown>;
            if (obj.shopGate) value = obj.shopGate;
          }
        } catch {
          /* noop */
        }
        setForm(toForm(value));
        return;
      }
      const data = await res!.json();
      setForm(toForm(data.settings?.shopGate));
    })();
  }, []);

  const save = async () => {
    if (!form) return;
    setError("");
    if (form.title.trim().length < 2) return setError("تیتر پاپ‌آپ را وارد کنید.");
    if (form.message.trim().length < 10) return setError("متن پیام کوتاه است.");
    if (form.backLabel.trim().length < 2) return setError("متن دکمه برگشت را وارد کنید.");
    if (!/^[A-Za-z0-9]{1,20}$/.test(form.code.trim())) {
      return setError("رمز فقط حروف انگلیسی و عدد باشد (مثل B یا Babak) — حداکثر ۲۰ کاراکتر.");
    }
    setSaving(true);
    const value = {
      enabled: form.enabled,
      showOnShop: form.showOnShop,
      showOnCheckout: form.showOnCheckout,
      title: form.title.trim(),
      message: form.message.trim(),
      backLabel: form.backLabel.trim(),
      code: form.code.trim(),
      overlayOpacity: Math.min(95, Math.max(0, Math.round(form.overlayOpacity))),
      overlayBlur: Math.min(24, Math.max(0, Math.round(form.overlayBlur))),
    };
    if (demo) {
      try {
        const raw = localStorage.getItem("puttclub_demo_site-settings") || "{}";
        const obj = JSON.parse(raw);
        obj.shopGate = value;
        localStorage.setItem("puttclub_demo_site-settings", JSON.stringify(obj));
      } catch {
        /* noop */
      }
      setForm(value);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      return;
    }
    const res = await adminFetch("/api/admin/site/settings", {
      method: "PUT",
      body: JSON.stringify({ key: "shopGate", value }),
    });
    if (res && res.ok) {
      setForm(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError("ذخیره ناموفق بود. دوباره تلاش کنید.");
    }
    setSaving(false);
  };

  if (!form) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={30} className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">پاپ‌آپ فروشگاه</h1>
          <p className="mt-1.5 max-w-xl text-xs leading-6 text-sage">
            وقتی روشن باشد، همان پاپ‌آپ «به‌زودی» هم با باز شدن فروشگاه و هم با
            زدن «تکمیل خرید» نمایش داده می‌شود؛ فقط دکمه برگشت به سایت دارد و
            ورود فقط با رمز مخفی صفحه‌کلید ممکن است.
          </p>
        </div>
        {demo && (
          <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
            حالت نمایشی
          </span>
        )}
      </div>

      {/* روشن / خاموش */}
      <button
        onClick={() => setForm({ ...form, enabled: !form.enabled })}
        className={`mt-6 flex w-full items-center justify-between rounded-3xl border p-5 transition-all sm:max-w-md ${
          form.enabled
            ? "border-gold-500/50 bg-gold-500/10"
            : "border-gold-500/10 bg-forest-900/70"
        }`}
      >
        <span className="flex items-center gap-3">
          <span
            className={`grid size-11 place-items-center rounded-xl ${
              form.enabled ? "bg-gold-500 text-forest-950" : "bg-forest-800 text-gold-400"
            }`}
          >
            <Store size={20} />
          </span>
          <span className="text-start">
            <span className="block text-sm font-black">
              {form.enabled ? "پاپ‌آپ فعال است" : "پاپ‌آپ خاموش است"}
            </span>
            <span className="mt-0.5 block text-[11px] text-sage">
              {form.enabled ? "فروشگاه با پیام به‌زودی باز می‌شود" : "فروشگاه بدون پیام باز می‌شود"}
            </span>
          </span>
        </span>
        <span
          className={`relative h-7 w-13 shrink-0 rounded-full transition-colors ${
            form.enabled ? "bg-gold-500" : "bg-forest-700"
          }`}
        >
          <span
            className={`absolute top-1 size-5 rounded-full bg-forest-950 transition-all ${
              form.enabled ? "start-7" : "start-1"
            }`}
          />
        </span>
      </button>

      {/* محل نمایش */}
      <div className="mt-4 grid gap-3 sm:max-w-md">
        {(
          [
            { key: "showOnShop", label: "نمایش با باز شدن فروشگاه", hint: "پاپ‌آپ روی صفحه /shop" },
            { key: "showOnCheckout", label: "نمایش با تکمیل خرید", hint: "پاپ‌آپ روی دکمه تکمیل خرید و صفحه تسویه" },
          ] as const
        ).map((row) => (
          <button
            key={row.key}
            onClick={() => setForm({ ...form, [row.key]: !form[row.key] })}
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 transition-all ${
              form[row.key]
                ? "border-gold-500/40 bg-gold-500/10"
                : "border-gold-500/10 bg-forest-900/70 opacity-70"
            }`}
          >
            <span className="text-start">
              <span className="block text-sm font-bold">{row.label}</span>
              <span className="mt-0.5 block text-[11px] text-sage">{row.hint}</span>
            </span>
            <span
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                form[row.key] ? "bg-gold-500" : "bg-forest-700"
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full bg-forest-950 transition-all ${
                  form[row.key] ? "start-6" : "start-1"
                }`}
              />
            </span>
          </button>
        ))}
      </div>

      {/* تیرگی و بلور پس‌زمینه */}
      <div className="mt-6 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
        <h2 className="text-base font-black">تیرگی و بلور پس‌زمینه</h2>
        <p className="mt-2 max-w-xl text-xs leading-6 text-sage">
          میزان مات و تار بودن صفحه پشت پاپ‌آپ (فروشگاه یا تسویه). هرچه درصد
          بیشتر باشد، پشت پاپ‌آپ تیره‌تر و کمتر دیده می‌شود.
        </p>

        <div className="mt-5 space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold text-sage">میزان تیرگی پس‌زمینه</label>
              <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-black text-gold-300">
                ٪{faNum(form.overlayOpacity)}
              </span>
            </div>
            <input
              dir="ltr"
              type="range"
              min={0}
              max={95}
              step={5}
              value={form.overlayOpacity}
              onChange={(e) => setForm({ ...form, overlayOpacity: Number(e.target.value) })}
              className="w-full"
              aria-label="میزان تیرگی پس‌زمینه پاپ‌آپ"
            />
            <div className="mt-1 flex items-center justify-between text-[10px] text-sage">
              <span>شفاف (٪{faNum(0)})</span>
              <span>تقریباً مشکی (٪{faNum(95)})</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold text-sage">شدت بلور (تاری) پس‌زمینه</label>
              <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-black text-gold-300">
                {faNum(form.overlayBlur)} پیکسل
              </span>
            </div>
            <input
              dir="ltr"
              type="range"
              min={0}
              max={24}
              step={2}
              value={form.overlayBlur}
              onChange={(e) => setForm({ ...form, overlayBlur: Number(e.target.value) })}
              className="w-full"
              aria-label="شدت بلور پس‌زمینه پاپ‌آپ"
            />
            <div className="mt-1 flex items-center justify-between text-[10px] text-sage">
              <span>بدون بلور</span>
              <span>بلور قوی ({faNum(24)} پیکسل)</span>
            </div>
          </div>
        </div>
      </div>

      {/* متن‌ها */}
      <div className="mt-6 grid gap-4 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-sage">تیتر پاپ‌آپ</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-sage">متن دکمه برگشت</label>
          <input
            value={form.backLabel}
            onChange={(e) => setForm({ ...form, backLabel: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold text-sage">متن پیام</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="w-full resize-none rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-sm leading-7 outline-none placeholder:text-sage/50 focus:border-gold-500/50"
          />
        </div>
      </div>

      {/* رمز مخفی */}
      <div className="mt-6 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
        <h2 className="flex items-center gap-2 text-base font-black">
          <LockKeyhole size={18} className="text-gold-400" />
          رمز مخفی ورود
        </h2>
        <p className="mt-2 max-w-xl text-xs leading-6 text-sage">
          وقتی پاپ‌آپ باز است، با تایپ این رمز (حروف انگلیسی) روی صفحه‌کلید، فروشگاه
          باز می‌شود. به بزرگی و کوچکی حروف حساس نیست؛ می‌تواند یک حرف مثل{" "}
          <span dir="ltr" className="font-mono font-bold text-gold-300">B</span> یا یک
          کلمه مثل <span dir="ltr" className="font-mono font-bold text-gold-300">Babak</span>{" "}
          باشد. این رمز هیچ‌جای سایت نمایش داده نمی‌شود.
        </p>
        <div className="mt-4 max-w-xs">
          <label className="mb-1.5 block text-xs font-bold text-sage">رمز فعلی</label>
          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            dir="ltr"
            placeholder="B"
            className={`${inputCls} text-left font-mono font-bold tracking-widest`}
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm font-bold text-red-400">{error}</p>}

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          ذخیره تنظیمات
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
            <CheckCircle2 size={15} />
            ذخیره شد
          </span>
        )}
      </div>

      {/* پیش‌نمایش زنده — با همان تیرگی و بلور انتخابی */}
      <div className="mt-6 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-6">
        <h2 className="text-sm font-black text-sage">
          پیش‌نمایش زنده
          <span className="ms-2 font-normal">
            (تیرگی ٪{faNum(form.overlayOpacity)} + بلور {faNum(form.overlayBlur)} پیکسل)
          </span>
        </h2>
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-gold-500/15">
          {/* فروشگاه فرضی پشت پاپ‌آپ */}
          <div aria-hidden className="grid grid-cols-3 gap-2 bg-forest-950 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-gold-500/20 bg-gradient-to-br from-forest-800 to-forest-900 p-2"
              >
                <div className="h-9 rounded bg-gold-500/25" />
                <div className="mt-1.5 h-1.5 w-2/3 rounded bg-cream/30" />
                <div className="mt-1 h-1.5 w-1/3 rounded bg-gold-500/50" />
              </div>
            ))}
          </div>
          {/* همان لایه مات + بلور واقعی */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundColor: `rgba(5, 13, 9, ${form.overlayOpacity / 100})`,
              backdropFilter: `blur(${form.overlayBlur}px) brightness(60%) saturate(60%)`,
              WebkitBackdropFilter: `blur(${form.overlayBlur}px) brightness(60%) saturate(60%)`,
            }}
          />
          <div className="relative px-6 pb-6">
            <div className="mx-auto max-w-[260px] rounded-2xl border border-gold-500/25 bg-forest-900/90 p-5 text-center backdrop-blur-xl">
              <span className="mx-auto grid size-11 place-items-center rounded-xl bg-gold-500 text-forest-950">
                <Store size={20} strokeWidth={1.8} />
              </span>
              <p className="mt-3 text-sm font-black leading-snug">{form.title || "…"}</p>
              <p className="mt-2 line-clamp-2 text-[11px] leading-6 text-cream/70">
                {form.message || "…"}
              </p>
              <span className="mt-4 block w-full rounded-full bg-gold-500 py-2.5 text-xs font-black text-forest-950">
                {form.backLabel || "…"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
