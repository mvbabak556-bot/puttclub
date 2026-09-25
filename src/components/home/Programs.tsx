"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  Crown,
  Flag,
  Gift,
  Globe,
  Heart,
  Medal,
  MessageCircle,
  Phone,
  Send,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/Motion";
import CourseGallery from "@/components/CourseGallery";
import { useSiteSettings } from "@/components/SiteProvider";
import type { CourseSocial, SiteCourse, TextSize } from "@/lib/site-defaults";
import { withBase } from "@/lib/public";

const ICONS: Record<string, typeof Flag> = {
  Sparkles,
  Target,
  Flag,
  Timer,
  Trophy,
  Medal,
  Star,
  Zap,
  Heart,
  Gift,
  Crown,
  Shield,
};

const SOCIAL_ICONS: Record<CourseSocial["network"], typeof Globe> = {
  instagram: Camera,
  telegram: Send,
  whatsapp: MessageCircle,
  site: Globe,
  phone: Phone,
};

const SOCIAL_LABELS: Record<CourseSocial["network"], string> = {
  instagram: "اینستاگرام",
  telegram: "تلگرام",
  whatsapp: "واتساپ",
  site: "وب‌سایت",
  phone: "تماس",
};

const TITLE_SIZE: Record<TextSize, string> = {
  sm: "text-lg",
  md: "text-xl sm:text-2xl",
  lg: "text-2xl sm:text-3xl",
  xl: "text-3xl sm:text-4xl",
};

const BODY_SIZE: Record<TextSize, string> = {
  sm: "text-xs leading-6",
  md: "text-sm leading-8",
  lg: "text-base leading-9",
  xl: "text-lg leading-10",
};

const FALLBACK: SiteCourse[] = [
  { id: 1, title: "آموزش مقدماتی", subtitle: null, shortDesc: "آشنایی با گریپ، استنس، پات و سوئینگ پایه؛ شروع درست برای کسانی که تازه وارد دنیای گلف شده‌اند.", fullDesc: "", icon: "Sparkles", images: [], galleryMode: "featured", layout: "image-right", cardSize: "default", titleColor: null, textColor: null, accentColor: null, titleSize: "md", bodySize: "md", bodyAlign: "right", footerItems: [], socials: [], sortOrder: 1, isActive: true },
  { id: 2, title: "کلاس خصوصی", subtitle: null, shortDesc: "برنامه اختصاصی یک‌به‌یک با مربی؛ تحلیل سوئینگ و رفع ایرادهای تکنیکی در کوتاه‌ترین زمان.", fullDesc: "", icon: "Target", images: [], galleryMode: "featured", layout: "image-right", cardSize: "default", titleColor: null, textColor: null, accentColor: null, titleSize: "md", bodySize: "md", bodyAlign: "right", footerItems: [], socials: [], sortOrder: 2, isActive: true },
  { id: 3, title: "گلف نوجوانان", subtitle: null, shortDesc: "دوره‌های شاد و اصولی برای نسل آینده گلف؛ آموزش پایه همراه با بازی و تمرین گروهی.", fullDesc: "", icon: "Flag", images: [], galleryMode: "featured", layout: "image-right", cardSize: "default", titleColor: null, textColor: null, accentColor: null, titleSize: "md", bodySize: "md", bodyAlign: "right", footerItems: [], socials: [], sortOrder: 3, isActive: true },
  { id: 4, title: "تمرین در زمین", subtitle: null, shortDesc: "بازی آموزشی همراه مربی در زمین واقعی؛ مدیریت بازی، انتخاب چوب و استراتژی هر هول.", fullDesc: "", icon: "Timer", images: [], galleryMode: "featured", layout: "image-right", cardSize: "default", titleColor: null, textColor: null, accentColor: null, titleSize: "md", bodySize: "md", bodyAlign: "right", footerItems: [], socials: [], sortOrder: 4, isActive: true },
  { id: 5, title: "آمادگی مسابقه", subtitle: null, shortDesc: "برنامه فشرده برای بازیکنان رقابتی؛ تمرین ذهنی، کنترل فشار و آمادگی تورنمنت.", fullDesc: "", icon: "Trophy", images: [], galleryMode: "featured", layout: "image-right", cardSize: "default", titleColor: null, textColor: null, accentColor: null, titleSize: "md", bodySize: "md", bodyAlign: "right", footerItems: [], socials: [], sortOrder: 5, isActive: true },
  { id: 6, title: "عضویت باشگاه", subtitle: null, shortDesc: "عضویت در باشگاه پات کلاب با دسترسی به تمرین‌ها، رویدادها و تخفیف فروشگاه تجهیزات.", fullDesc: "", icon: "Medal", images: [], galleryMode: "featured", layout: "image-right", cardSize: "default", titleColor: null, textColor: null, accentColor: null, titleSize: "md", bodySize: "md", bodyAlign: "right", footerItems: [], socials: [], sortOrder: 6, isActive: true },
];

/** نرمال‌سازی ردیف‌ها (محافظت در برابر کش قدیمی لوکال) */
function normalize(rows: unknown): SiteCourse[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((r): r is Record<string, unknown> => !!r && typeof r === "object")
    .map((r, i) => ({
      id: typeof r.id === "number" ? r.id : 1000 + i,
      title: typeof r.title === "string" && r.title ? r.title : "دوره آموزشی",
      subtitle: typeof r.subtitle === "string" ? r.subtitle : null,
      shortDesc: typeof r.shortDesc === "string" ? r.shortDesc : "",
      fullDesc: typeof r.fullDesc === "string" ? r.fullDesc : "",
      icon: typeof r.icon === "string" && r.icon ? r.icon : "Sparkles",
      images: Array.isArray(r.images) ? r.images.filter((x): x is string => typeof x === "string") : [],
      galleryMode: r.galleryMode === "slider" || r.galleryMode === "grid" ? r.galleryMode : "featured",
      layout: r.layout === "image-top" || r.layout === "image-left" ? r.layout : "image-right",
      cardSize: r.cardSize === "compact" || r.cardSize === "large" ? r.cardSize : "default",
      titleColor: typeof r.titleColor === "string" && r.titleColor ? r.titleColor : null,
      textColor: typeof r.textColor === "string" && r.textColor ? r.textColor : null,
      accentColor: typeof r.accentColor === "string" && r.accentColor ? r.accentColor : null,
      titleSize: r.titleSize === "sm" || r.titleSize === "lg" || r.titleSize === "xl" ? r.titleSize : "md",
      bodySize: r.bodySize === "sm" || r.bodySize === "lg" || r.bodySize === "xl" ? r.bodySize : "md",
      bodyAlign: r.bodyAlign === "center" || r.bodyAlign === "justify" ? r.bodyAlign : "right",
      footerItems: Array.isArray(r.footerItems)
        ? r.footerItems.filter(
            (f): f is { label: string; value: string } =>
              !!f && typeof f === "object" && typeof (f as { label?: unknown }).label === "string"
          )
        : [],
      socials: Array.isArray(r.socials)
        ? r.socials.filter(
            (s): s is CourseSocial =>
              !!s && typeof s === "object" && typeof (s as { url?: unknown }).url === "string"
          )
        : [],
      sortOrder: typeof r.sortOrder === "number" ? r.sortOrder : i + 1,
      isActive: r.isActive !== false,
    }));
}

export default function Programs() {
  const settings = useSiteSettings();
  const [courses, setCourses] = useState<SiteCourse[]>(FALLBACK);
  const [openId, setOpenId] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(withBase("/api/site/courses"));
        if (res.ok) {
          const data = await res.json();
          const rows = normalize(data.courses).filter((c) => c.isActive);
          if (alive && rows.length) {
            setCourses(rows);
            return;
          }
        }
      } catch {
        /* fallback */
      }
      try {
        const res = await fetch(withBase("/data/site-courses.json"));
        if (res.ok) {
          const data = await res.json();
          let rows = normalize(data);
          try {
            const local = localStorage.getItem("puttclub_demo_site-courses");
            if (local) rows = normalize(JSON.parse(local));
          } catch {
            /* noop */
          }
          rows = rows.filter((c) => c.isActive);
          if (alive && rows.length) setCourses(rows);
        }
      } catch {
        /* پیش‌فرض */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // اگر دوره بازشده از لیست حذف شد، پنل بسته شود
  useEffect(() => {
    if (openId !== null && !courses.some((c) => c.id === openId)) {
      setOpenId(null);
    }
  }, [courses, openId]);

  // بستن با Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = courses.find((c) => c.id === openId) ?? null;
  const sec = settings.coursesSection;

  const toggle = useCallback((id: number) => {
    setOpenId((prev) => {
      const next = prev === id ? null : id;
      // اسکرول نرم به پنل جزئیات وقتی باز می‌شود (پنل پایین گرید است)
      if (next !== null) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }, 120);
        });
      }
      return next;
    });
  }, []);

  return (
    <section id="programs" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-black tracking-[0.25em] text-gold-400">
              <span className="h-px w-10 bg-gold-500/60" />
              {sec.kicker}
            </p>
            <h2 className="mt-4 text-3xl font-black leading-snug sm:text-5xl">
              {sec.title} <span className="text-gold-grad">{sec.titleAccent}</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-sage">{sec.desc}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/academy"
              className="enter-members group inline-flex items-center gap-2 rounded-full border border-gold-500/30 px-5 py-2.5 text-sm font-bold text-gold-300 transition-all hover:border-gold-400 hover:bg-gold-500/10"
            >
              ورود اعضای آکادمی
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* کارت‌های دوره — با کلیک باز و بسته می‌شوند */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => {
            const Icon = ICONS[c.icon] ?? Sparkles;
            const active = openId === c.id;
            return (
              <motion.button
                key={c.id}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                onClick={() => toggle(c.id)}
                aria-expanded={active}
                aria-controls="course-detail"
                className={`group relative block h-full w-full cursor-pointer rounded-3xl border p-7 text-start transition-all duration-500 hover:-translate-y-1 ${
                  active
                    ? "border-gold-400/60 bg-forest-800 shadow-[0_20px_50px_-20px_rgba(201,162,75,0.4)]"
                    : "border-gold-500/10 bg-forest-900 hover:border-gold-500/30"
                }`}
              >
                <span
                  className={`grid size-13 place-items-center rounded-2xl border transition-all duration-500 ${
                    active
                      ? "border-gold-400 bg-gold-500 text-forest-950"
                      : "border-gold-500/25 bg-forest-800 text-gold-400 group-hover:bg-gold-500 group-hover:text-forest-950"
                  }`}
                >
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <span className="mt-5 block text-lg font-black" style={c.titleColor ? { color: c.titleColor } : undefined}>
                  {c.title}
                </span>
                {c.subtitle && (
                  <span className="mt-1 block text-xs font-bold text-gold-400">{c.subtitle}</span>
                )}
                <span className="mt-2 block text-sm leading-7 text-sage">{c.shortDesc}</span>
                <span
                  className={`mt-4 inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    active ? "text-gold-300" : "text-sage group-hover:text-gold-300"
                  }`}
                >
                  {active ? "بستن جزئیات" : "دیدن جزئیات"}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${active ? "rotate-180" : ""}`} />
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* پنل جزئیات — زیر کارت‌ها، بالای بنر فروشگاه (بدون تغییر مسیر) */}
        <div ref={detailRef} className="scroll-mt-28">
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="course-detail-panel"
                id="course-detail"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={open.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-6 overflow-hidden rounded-[2rem] border border-gold-500/25 bg-forest-900/80 shadow-2xl ${
                      open.cardSize === "compact" ? "mx-auto max-w-3xl" : ""
                    } ${open.cardSize === "large" ? "lg:p-12" : "lg:p-10"} p-6 sm:p-8`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black tracking-[0.2em] text-gold-400">{open.subtitle || "جزئیات دوره"}</p>
                        <h3
                          className={`mt-2 font-black leading-snug ${TITLE_SIZE[open.titleSize] ?? TITLE_SIZE.md}`}
                          style={open.titleColor ? { color: open.titleColor } : undefined}
                        >
                          {open.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpenId(null)}
                        aria-label="بستن جزئیات"
                        className="grid size-10 shrink-0 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:border-gold-500/50 hover:text-gold-300"
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <div
                      className={`mt-6 grid gap-8 ${
                        open.layout === "image-top" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
                      }`}
                    >
                      {open.images.length > 0 && (
                        <div className={open.layout === "image-left" ? "lg:order-2" : ""}>
                          <CourseGallery key={open.id} images={open.images} mode={open.galleryMode} title={open.title} />
                        </div>
                      )}
                      <div className={open.images.length === 0 ? "lg:col-span-2" : ""}>
                        {open.fullDesc ? (
                          <div
                            className={`${BODY_SIZE[open.bodySize] ?? BODY_SIZE.md} whitespace-pre-line text-cream/85 ${
                              open.bodyAlign === "center"
                                ? "text-center"
                                : open.bodyAlign === "justify"
                                  ? "text-justify"
                                  : ""
                            }`}
                            style={open.textColor ? { color: open.textColor } : undefined}
                          >
                            {open.fullDesc}
                          </div>
                        ) : (
                          <p className="text-sm leading-8 text-sage">{open.shortDesc}</p>
                        )}

                        {open.footerItems.length > 0 && (
                          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                            {open.footerItems.map((f, i) => (
                              <li
                                key={i}
                                className="rounded-2xl border border-gold-500/10 bg-forest-950/60 px-4 py-3"
                              >
                                <span className="block text-[11px] text-sage">{f.label}</span>
                                <span
                                  className="mt-1 block text-sm font-bold"
                                  style={open.accentColor ? { color: open.accentColor } : undefined}
                                >
                                  {f.value}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {open.socials.length > 0 && (
                          <div className="mt-6 flex flex-wrap items-center gap-2.5">
                            {open.socials.map((s, i) => {
                              const SIcon = SOCIAL_ICONS[s.network] ?? Globe;
                              return (
                                <a
                                  key={i}
                                  href={s.url}
                                  target={s.url.startsWith("http") ? "_blank" : undefined}
                                  rel={s.url.startsWith("http") ? "noreferrer" : undefined}
                                  className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 px-4 py-2 text-xs font-bold text-gold-300 transition-all hover:border-gold-400 hover:bg-gold-500/10"
                                >
                                  <SIcon size={14} />
                                  {s.label || SOCIAL_LABELS[s.network]}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Reveal delay={0.1}>
          <Link
            href="/shop"
            className="group mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-gold-500/20 bg-gradient-to-l from-forest-800 to-forest-900 px-7 py-6 sm:flex-row"
          >
            <span className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold-500 text-forest-950">
                <ShoppingBag size={21} strokeWidth={1.9} />
              </span>
              <span>
                <span className="block text-base font-black">فروشگاه تجهیزات پات کلاب</span>
                <span className="mt-1 block text-xs text-sage">
                  چوب، توپ، کیف و پوشاک اورجینال با ضمانت اصالت
                </span>
              </span>
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-gold-300">
              ورود به فروشگاه
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
