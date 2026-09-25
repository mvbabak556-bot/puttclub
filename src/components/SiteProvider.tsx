"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-defaults";
import { mergeSiteSettings } from "@/lib/site-normalize";
import { withBase } from "@/lib/public";

const Ctx = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function useSiteSettings(): SiteSettings {
  return useContext(Ctx);
}

function applyTheme(theme: SiteSettings["theme"]) {
  const root = document.documentElement;
  const map: [string, string][] = [
    ["--color-gold-500", theme.gold500],
    ["--color-gold-400", theme.gold400],
    ["--color-gold-300", theme.gold300],
    ["--color-gold-600", theme.gold600],
    ["--color-forest-950", theme.forest950],
    ["--color-forest-900", theme.forest900],
    ["--color-forest-800", theme.forest800],
    ["--color-cream", theme.cream],
    ["--color-sage", theme.sage],
  ];
  for (const [k, v] of map) {
    if (v && /^#[0-9a-fA-F]{3,8}$/.test(v)) root.style.setProperty(k, v);
  }
}

/** تنظیمات عمومی سایت + اعمال قالب برند (CSS variables) */
export default function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let alive = true;
    (async () => {
      // ۱) API زنده
      try {
        const res = await fetch(withBase("/api/site/content"));
        if (res.ok) {
          const data = await res.json();
          if (alive && data.settings) {
            const merged = mergeSiteSettings(data.settings);
            setSettings(merged);
            applyTheme(merged.theme);
            return;
          }
        }
      } catch {
        /* fallback به اسنپ‌شات */
      }
      // ۲) اسنپ‌شات استاتیک (گیت‌هاب پیجز)
      try {
        const res = await fetch(withBase("/data/site-settings.json"));
        if (res.ok) {
          const arr = await res.json();
          const obj: Record<string, unknown> = {};
          for (const row of arr as { key: string; value: unknown }[]) obj[row.key] = row.value;
          // تغییرات محلی مدیر در حالت نمایشی
          try {
            const local = localStorage.getItem("puttclub_demo_site-settings");
            if (local) Object.assign(obj, JSON.parse(local));
          } catch {
            /* noop */
          }
          if (alive && Object.keys(obj).length) {
            const merged = mergeSiteSettings(obj);
            setSettings(merged);
            applyTheme(merged.theme);
          }
        }
      } catch {
        /* پیش‌فرض‌ها */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
}
