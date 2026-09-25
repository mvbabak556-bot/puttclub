"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Loader2, PenLine, Send, Star, X } from "lucide-react";
import Stars from "@/components/Stars";
import { Reveal } from "@/components/Motion";
import { useSiteSettings } from "@/components/SiteProvider";
import type { SiteTestimonial } from "@/lib/site-defaults";
import { faNum } from "@/lib/format";
import { withBase } from "@/lib/public";

const PAGE = 6;
const INITIAL = 3;

const FALLBACK: SiteTestimonial[] = [
  { id: 1, name: "امیرحسین رضایی", role: "عضو پات‌کلاب — هندیکپ ۴", text: "درایور Pro V1 دقیقاً همان چیزی بود که بازی‌ام کم داشت. مشاوره تیم پات‌کلاب بی‌نقص بود و ارسال هم فردای همان روز انجام شد.", rating: 5, status: "approved", createdAt: "" },
  { id: 2, name: "سارا محمدی", role: "بازیکن تازه‌کار", text: "برای شروع، ست کامل از پات‌کلاب خریدم. کیف چرمی‌اش آن‌قدر شیک بود که در کلوب‌هاوس همه پرسیدند از کجا گرفته‌ام!", rating: 5, status: "approved", createdAt: "" },
  { id: 3, name: "رضا توکلی", role: "مربی گلف", text: "به شاگردهایم همیشه توپ‌های تور پات‌کلاب را پیشنهاد می‌دهم؛ اسپین روی گرین فوق‌العاده است و قیمت‌ها منصفانه.", rating: 4, status: "approved", createdAt: "" },
];

const toEn = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

export default function Testimonials() {
  const settings = useSiteSettings();
  const [list, setList] = useState<SiteTestimonial[]>(FALLBACK);
  const [visible, setVisible] = useState(INITIAL);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(withBase("/api/site/testimonials"));
        if (res.ok) {
          const data = await res.json();
          if (alive && data.testimonials?.length) {
            setList(data.testimonials);
            return;
          }
        }
      } catch {
        /* fallback */
      }
      try {
        const res = await fetch(withBase("/data/site-testimonials.json"));
        if (res.ok) {
          const data = await res.json();
          const rows = (Array.isArray(data) ? data : []).filter(
            (t: SiteTestimonial) => t.status === "approved"
          );
          if (alive && rows.length) setList(rows);
        }
      } catch {
        /* پیش‌فرض */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // قفل اسکرول بدنه + بستن با Escape وقتی پاپ‌آپ باز است
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  const close = () => {
    setOpen(false);
    setError("");
    setDone(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 3) return setError("نام و نام خانوادگی را کامل وارد کنید.");
    if (!/^09\d{9}$/.test(toEn(phone.trim()))) return setError("شماره تماس معتبر نیست (مثل ۰۹۱۲۳۴۵۶۷۸۹).");
    if (text.trim().length < 10) return setError("متن نظر کوتاه است؛ کمی بیشتر بنویسید.");
    setLoading(true);
    try {
      let res: Response | null = null;
      try {
        res = await fetch(withBase("/api/site/testimonials"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), phone: toEn(phone.trim()), text: text.trim(), rating: stars }),
        });
      } catch {
        res = null;
      }
      if (!res || res.status === 404 || res.status === 405) {
        // هاست استاتیک — ذخیره محلی در انتظار تأیید
        try {
          const raw = localStorage.getItem("puttclub_local_site_testimonials") || "[]";
          const arr = JSON.parse(raw);
          arr.unshift({ id: Date.now(), name: name.trim(), phone: toEn(phone.trim()), text: text.trim(), rating: stars, status: "pending", createdAt: new Date().toISOString() });
          localStorage.setItem("puttclub_local_site_testimonials", JSON.stringify(arr));
        } catch {
          /* noop */
        }
      } else if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "ثبت نظر ناموفق بود.");
        return;
      }
      setDone(true);
      setName("");
      setPhone("");
      setText("");
      setStars(5);
      // نمایش پیام موفقیت و بستن خودکار پاپ‌آپ
      setTimeout(() => {
        setDone(false);
        setOpen(false);
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  const sec = settings.testimonialsSection;
  const shown = list.slice(0, visible);

  return (
    <section id="testimonials" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="inline-flex items-center gap-3 text-xs font-black tracking-[0.25em] text-gold-400">
            <span className="h-px w-10 bg-gold-500/60" />
            {sec.kicker}
            <span className="h-px w-10 bg-gold-500/60" />
          </p>
          <h2 className="mt-4 text-3xl font-black leading-snug sm:text-5xl">
            {sec.title} <span className="text-gold-grad">{sec.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-sage">{sec.desc}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {shown.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              className="flex h-full flex-col rounded-3xl border border-gold-500/10 bg-forest-900 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/30"
            >
              <Stars value={t.rating} size={15} />
              <blockquote className="mt-5 flex-1 text-sm leading-8 text-cream/85">
                «{t.text}»
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-gold-500/10 pt-5">
                <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-base font-black text-forest-950">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <div className="text-sm font-black">{t.name}</div>
                  {t.role && <div className="mt-0.5 text-[11px] text-sage">{t.role}</div>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {visible < list.length && (
            <button
              onClick={() => setVisible((v) => v + PAGE)}
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 px-7 py-3 text-sm font-bold text-gold-300 transition-all hover:border-gold-400 hover:bg-gold-500/10"
            >
              نمایش بیشتر ({faNum(Math.min(PAGE, list.length - visible))} نظر دیگر)
              <ChevronDown size={16} />
            </button>
          )}
          <button
            onClick={() => setOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-black text-forest-950 shadow-[0_14px_36px_-12px_rgba(201,162,75,0.55)] transition-all hover:bg-gold-400"
          >
            <PenLine size={16} className="transition-transform group-hover:-rotate-12" />
            ثبت نظر شما
          </button>
        </div>

        {/* پاپ‌آپ ثبت نظر — بدون نیاز به ثبت‌نام */}
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
                className="absolute inset-0 bg-forest-950/75 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: 44, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 32, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] border border-gold-500/20 bg-forest-900 p-7 sm:rounded-[2rem] sm:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="flex items-center gap-2.5 text-lg font-black">
                      <PenLine size={19} className="text-gold-400" />
                      ثبت نظر شما
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-sage">
                      نام و شماره تماس الزامی است (شماره تماس نمایش داده نمی‌شود). نظر شما پس از تأیید مدیر منتشر می‌شود.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="بستن"
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:border-gold-500/50 hover:text-gold-300"
                  >
                    <X size={16} />
                  </button>
                </div>

                {done ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 flex flex-col items-center gap-3 rounded-3xl border border-gold-500/25 bg-forest-950/60 px-6 py-10 text-center"
                  >
                    <span className="grid size-14 place-items-center rounded-full bg-gold-500 text-forest-950">
                      <CheckCircle2 size={26} />
                    </span>
                    <p className="text-sm font-black text-gold-300">نظر شما ثبت شد!</p>
                    <p className="max-w-xs text-xs leading-6 text-sage">
                      پس از تأیید مدیر نمایش داده می‌شود. سپاس از همراهی‌تان!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={submit} className="mt-6">
                    <label className="mb-2 block text-xs font-bold text-sage">امتیاز شما</label>
                    <div className="flex items-center gap-1" dir="ltr">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button" onClick={() => setStars(s)} aria-label={`${s} ستاره`} className="transition-transform hover:scale-110">
                          <Star size={26} className={s <= stars ? "fill-gold-400 text-gold-400" : "fill-transparent text-forest-600"} />
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="نام و نام خانوادگی *" className="h-12 w-full rounded-2xl border border-gold-500/15 bg-forest-950/60 px-4 text-sm outline-none placeholder:text-sage/50 focus:border-gold-500/50" />
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="شماره تماس *" dir="ltr" inputMode="tel" className="h-12 w-full rounded-2xl border border-gold-500/15 bg-forest-950/60 px-4 text-right text-sm outline-none placeholder:text-sage/50 focus:border-gold-500/50" />
                    </div>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="تجربه‌تان از آکادمی یا فروشگاه را بنویسید..." rows={4} className="mt-3 w-full resize-none rounded-2xl border border-gold-500/15 bg-forest-950/60 px-4 py-3.5 text-sm leading-7 outline-none placeholder:text-sage/50 focus:border-gold-500/50" />
                    {error && <p className="mt-3 text-sm font-bold text-red-400">{error}</p>}
                    <button type="submit" disabled={loading} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-3.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400 disabled:opacity-60">
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      ثبت نظر
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
