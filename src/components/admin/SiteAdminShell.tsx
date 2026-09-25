"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  FlaskConical,
  Globe,
  Image,
  LayoutDashboard,
  LayoutTemplate,
  Loader2,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareQuote,
  Newspaper,
  Palette,
  Phone,
  Quote,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  UserRound,
} from "lucide-react";
import { adminFetch, clearAdmin, demoSiteSettings, getAdmin, isDemoResponse, saveDemoSite, type AdminSession } from "@/lib/admin";
import { SITE_DEFAULTS, type SiteSectionKey, type SiteSettings } from "@/lib/site-schema";
import { SaveBar } from "@/components/admin/site/fields";
import BrandEditor from "@/components/admin/site/BrandEditor";
import { FooterEditor, NavEditor } from "@/components/admin/site/NavFooterEditor";
import HeroEditor from "@/components/admin/site/HeroEditor";
import MarqueeEditor from "@/components/admin/site/MarqueeEditor";
import AboutEditor from "@/components/admin/site/AboutEditor";
import ProgramsEditor from "@/components/admin/site/ProgramsEditor";
import FeaturedEditor from "@/components/admin/site/FeaturedEditor";
import FeaturesEditor from "@/components/admin/site/FeaturesEditor";
import QuoteEditor from "@/components/admin/site/QuoteEditor";
import TestimonialsEditor from "@/components/admin/site/TestimonialsEditor";
import ContactEditor from "@/components/admin/site/ContactEditor";
import CtaEditor from "@/components/admin/site/CtaEditor";
import AcademyEditor from "@/components/admin/site/AcademyEditor";
import ThemeEditor from "@/components/admin/site/ThemeEditor";
import LayoutEditor from "@/components/admin/site/LayoutEditor";
import SeoEditor from "@/components/admin/site/SeoEditor";

const TABS: { key: SiteSectionKey; label: string; icon: typeof Globe }[] = [
  { key: "brand", label: "برند و تماس", icon: UserRound },
  { key: "nav", label: "منوی هدر", icon: Menu },
  { key: "hero", label: "هیرو", icon: Sparkles },
  { key: "marquee", label: "نوار متحرک", icon: Megaphone },
  { key: "about", label: "درباره", icon: Globe },
  { key: "programs", label: "دوره‌ها", icon: Newspaper },
  { key: "featured", label: "منتخب فروشگاه", icon: Star },
  { key: "features", label: "ویژگی‌ها", icon: LayoutDashboard },
  { key: "quote", label: "بنر نقل‌قول", icon: Quote },
  { key: "testimonials", label: "نظرات", icon: MessageSquareQuote },
  { key: "contact", label: "تماس", icon: Phone },
  { key: "cta", label: "بنر عضویت", icon: Megaphone },
  { key: "academy", label: "صفحه آکادمی", icon: UserRound },
  { key: "footer", label: "فوتر", icon: LayoutTemplate },
  { key: "theme", label: "قالب و رنگ‌ها", icon: Palette },
  { key: "layout", label: "چیدمان", icon: LayoutTemplate },
  { key: "seo", label: "سئو", icon: Search },
  { key: "brand", label: "رسانه", icon: Image },
];

const MEDIA_TAB = "media";

export default function SiteAdminShell() {
  const router = useRouter();
  const [admin, setAdminState] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<string>("brand");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [demo, setDemo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const a = getAdmin();
    if (!a) {
      router.replace("/admin/login");
      return;
    }
    setAdminState(a);
    setReady(true);
    (async () => {
      const res = await adminFetch("/api/admin/site");
      if (isDemoResponse(res)) {
        setDemo(true);
        const snap = await demoSiteSettings();
        const merged = JSON.parse(JSON.stringify(SITE_DEFAULTS)) as SiteSettings;
        for (const k of Object.keys(merged) as SiteSectionKey[]) {
          if (snap[k]) merged[k] = { ...(merged[k] as object), ...snap[k] } as never;
        }
        setSettings(merged);
        return;
      }
      const data = await res!.json();
      setSettings(data.settings as SiteSettings);
    })();
  }, [router]);

  if (!ready || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gold-400" />
      </div>
    );
  }

  const save = async (key: SiteSectionKey) => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    setError("");
    if (demo) {
      saveDemoSite(key, settings[key] as unknown as Record<string, unknown>);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      return;
    }
    const res = await adminFetch("/api/admin/site", {
      method: "PUT",
      body: JSON.stringify({ key, value: settings[key] }),
    });
    setSaving(false);
    if (res && res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError("ذخیره ناموفق بود. دوباره تلاش کنید.");
    }
  };

  const set = <K extends SiteSectionKey>(key: K) => (v: SiteSettings[K]) =>
    setSettings((prev) => (prev ? { ...prev, [key]: v } : prev));

  const renderTab = () => {
    if (!settings) {
      return (
        <div className="flex justify-center py-24">
          <Loader2 size={30} className="animate-spin text-gold-400" />
        </div>
      );
    }
    const s = settings;
    switch (tab) {
      case "brand":
        return <BrandEditor value={s.brand} onChange={set("brand")} />;
      case "nav":
        return <NavEditor value={s.nav} onChange={set("nav")} />;
      case "hero":
        return <HeroEditor value={s.hero} onChange={set("hero")} />;
      case "marquee":
        return <MarqueeEditor value={s.marquee} onChange={set("marquee")} />;
      case "about":
        return <AboutEditor value={s.about} onChange={set("about")} />;
      case "programs":
        return <ProgramsEditor value={s.programs} onChange={set("programs")} />;
      case "featured":
        return <FeaturedEditor value={s.featured} onChange={set("featured")} />;
      case "features":
        return <FeaturesEditor value={s.features} onChange={set("features")} />;
      case "quote":
        return <QuoteEditor value={s.quote} onChange={set("quote")} />;
      case "testimonials":
        return <TestimonialsEditor value={s.testimonials} onChange={set("testimonials")} />;
      case "contact":
        return <ContactEditor value={s.contact} onChange={set("contact")} />;
      case "cta":
        return <CtaEditor value={s.cta} onChange={set("cta")} />;
      case "academy":
        return <AcademyEditor value={s.academy} onChange={set("academy")} />;
      case "footer":
        return <FooterEditor value={s.footer} onChange={set("footer")} />;
      case "theme":
        return <ThemeEditor value={s.theme} onChange={set("theme")} />;
      case "layout":
        return <LayoutEditor value={s.layout} onChange={set("layout")} />;
      case "seo":
        return <SeoEditor value={s.seo} onChange={set("seo")} />;
      case MEDIA_TAB:
        return (
          <MediaOverview
            settings={s}
            onJump={(t) => setTab(t)}
          />
        );
      default:
        return null;
    }
  };

  const tabs = [...TABS.slice(0, 17), { key: MEDIA_TAB, label: "همه تصاویر", icon: Image }];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      {/* Sidebar */}
      <aside className="hidden border-e border-gold-500/10 bg-forest-900/70 lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-gold-500/15 bg-forest-950/60 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-500 text-forest-950">
              <Globe size={22} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-black">مدیریت سایت</div>
              <div className="mt-0.5 truncate text-[11px] text-sage" dir="ltr">
                {admin.email}
              </div>
            </div>
          </div>
          {demo && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
              <FlaskConical size={14} />
              حالت نمایشی
            </span>
          )}

          <nav className="mt-4 flex-1 space-y-1 overflow-y-auto pe-1">
            {tabs.map((t) => (
              <button
                key={t.key + t.label}
                onClick={() => {
                  setTab(t.key);
                  setError("");
                  setSaved(false);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${
                  tab === t.key
                    ? "bg-gold-500 text-forest-950 shadow-lg"
                    : "text-cream/70 hover:bg-forest-800 hover:text-gold-300"
                }`}
              >
                <t.icon size={17} />
                {t.label}
              </button>
            ))}
          </nav>

          <div className="space-y-1.5 border-t border-gold-500/10 pt-4">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-sage transition-colors hover:text-gold-300"
            >
              <Store size={18} />
              مدیریت فروشگاه
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-sage transition-colors hover:text-gold-300"
            >
              <Eye size={18} />
              مشاهده سایت
            </Link>
            <button
              onClick={() => {
                clearAdmin();
                router.push("/admin/login");
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-sage transition-colors hover:text-red-300"
            >
              <LogOut size={18} />
              خروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 border-b border-gold-500/10 bg-forest-950/90 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-black">
              <Globe size={18} className="text-gold-400" />
              مدیریت سایت
              {demo && <span className="text-[10px] font-bold text-gold-300">(نمایشی)</span>}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                aria-label="مدیریت فروشگاه"
                className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage"
              >
                <ShoppingBag size={16} />
              </Link>
              <Link
                href="/"
                aria-label="مشاهده سایت"
                className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage"
              >
                <Eye size={16} />
              </Link>
              <button
                onClick={() => {
                  clearAdmin();
                  router.push("/admin/login");
                }}
                aria-label="خروج"
                className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-3">
            {tabs.map((t) => (
              <button
                key={t.key + t.label}
                onClick={() => {
                  setTab(t.key);
                  setError("");
                  setSaved(false);
                }}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  tab === t.key ? "bg-gold-500 text-forest-950" : "bg-forest-800 text-sage"
                }`}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-6 text-2xl font-black">
                {tab === MEDIA_TAB ? "همه تصاویر سایت" : tabs.find((t) => t.key === tab)?.label}
              </h1>
              {renderTab()}
              {tab !== MEDIA_TAB && settings && (
                <SaveBar onSave={() => save(tab as SiteSectionKey)} saving={saving} saved={saved} error={error} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** نمای یک‌جای همه شکاف‌های تصویری سایت با پرش به ویرایشگر مربوطه */
function MediaOverview({
  settings,
  onJump,
}: {
  settings: SiteSettings;
  onJump: (t: string) => void;
}) {
  const slots: { label: string; src: string; tab: SiteSectionKey }[] = [
    { label: "لوگو (هدر و فوتر)", src: settings.brand.logo, tab: "brand" },
    { label: "لوگو باکیفیت", src: settings.brand.logoHd, tab: "brand" },
    { label: "پوستر ویدیوی هیرو", src: settings.hero.poster, tab: "hero" },
    { label: "تصویر بخش درباره", src: settings.about.image, tab: "about" },
    { label: "پس‌زمینه بنر نقل‌قول", src: settings.quote.image, tab: "quote" },
    { label: "تصویر صفحه آکادمی", src: settings.academy.image, tab: "academy" },
    { label: "فاوآیکون", src: settings.seo.favicon, tab: "seo" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {slots.map((s) => (
        <button
          key={s.label}
          onClick={() => onJump(s.tab)}
          className="flex items-center gap-4 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-4 text-start transition-colors hover:border-gold-500/30"
        >
          <span className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-gold-500/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src.startsWith("data:") ? s.src : s.src} alt={s.label} className="size-full object-contain" />
          </span>
          <span>
            <span className="block text-sm font-black">{s.label}</span>
            <span className="mt-1 block max-w-56 truncate text-[11px] text-sage" dir="ltr">
              {s.src.startsWith("data:") ? "(آپلودشده)" : s.src}
            </span>
            <span className="mt-1.5 block text-[11px] font-bold text-gold-300">ویرایش ←</span>
          </span>
        </button>
      ))}
      <div className="rounded-3xl border border-dashed border-gold-500/25 p-5 text-xs leading-6 text-sage sm:col-span-2">
        ویدیوی هیرو، آیکون کارت‌ها و تصاویر محصولات از بخش‌های مربوط به خودشان ویرایش می‌شوند؛
        تصاویر محصولات هم در «مدیریت فروشگاه ← محصولات» قابل تغییر است.
      </div>
    </div>
  );
}
