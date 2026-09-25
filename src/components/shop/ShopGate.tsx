"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-defaults";
import { withBase } from "@/lib/public";

const UNLOCK_KEY = "puttclub_shop_unlocked";
const DEMO_SETTINGS_KEY = "puttclub_demo_site-settings";
const DEFAULT_CODE = DEFAULT_SITE_SETTINGS.shopGate.code;

interface PublicGate {
  enabled: boolean;
  title: string;
  message: string;
  backLabel: string;
}

function toGate(v: unknown): PublicGate {
  const d = DEFAULT_SITE_SETTINGS.shopGate;
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return {
    enabled: typeof o.enabled === "boolean" ? o.enabled : d.enabled,
    title: typeof o.title === "string" && o.title ? o.title : d.title,
    message: typeof o.message === "string" && o.message ? o.message : d.message,
    backLabel: typeof o.backLabel === "string" && o.backLabel ? o.backLabel : d.backLabel,
  };
}

/** خواندن رمز نمایشی ذخیره‌شده مدیر در همین مرورگر (فقط حالت استاتیک) */
function demoCode(): string {
  try {
    const raw = localStorage.getItem(DEMO_SETTINGS_KEY);
    if (!raw) return DEFAULT_CODE;
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const gate = obj.shopGate as { code?: unknown } | undefined;
    return typeof gate?.code === "string" && gate.code.trim() ? gate.code.trim() : DEFAULT_CODE;
  } catch {
    return DEFAULT_CODE;
  }
}

/**
 * دروازه فروشگاه: اگر در پنل فروشگاه فعال باشد، با باز شدن فروشگاه
 * پاپ‌آپ «به‌زودی» نمایش داده می‌شود؛ فقط دکمه برگشت به سایت دارد و
 * دکمه بستن ندارد. ورود مخفی فقط با تایپ رمز انگلیسی (پیش‌فرض B)
 * انجام می‌شود؛ رمز از پنل فروشگاه قابل تغییر است.
 */
export default function ShopGate() {
  const [gate, setGate] = useState<PublicGate | null>(null);
  const [locked, setLocked] = useState(true);
  const buffer = useRef("");

  useEffect(() => {
    let alive = true;
    try {
      if (sessionStorage.getItem(UNLOCK_KEY) === "1") {
        setLocked(false);
        return;
      }
    } catch {
      /* noop */
    }
    (async () => {
      // ۱) API زنده
      try {
        const res = await fetch(withBase("/api/site/content"));
        if (res.ok) {
          const data = await res.json();
          if (alive && data.settings?.shopGate) {
            const g = toGate(data.settings.shopGate);
            setGate(g);
            if (!g.enabled) setLocked(false);
            return;
          }
        }
      } catch {
        /* fallback به اسنپ‌شات */
      }
      // ۲) اسنپ‌شات استاتیک + تغییرات نمایشی همین مرورگر
      try {
        const res = await fetch(withBase("/data/site-settings.json"));
        if (res.ok) {
          const arr = (await res.json()) as { key: string; value: unknown }[];
          const row = arr.find((r) => r.key === "shopGate");
          let value = row?.value;
          try {
            const local = localStorage.getItem(DEMO_SETTINGS_KEY);
            if (local) {
              const obj = JSON.parse(local) as Record<string, unknown>;
              if (obj.shopGate) value = obj.shopGate;
            }
          } catch {
            /* noop */
          }
          if (alive && value) {
            const g = toGate(value);
            setGate(g);
            if (!g.enabled) setLocked(false);
            return;
          }
        }
      } catch {
        /* پیش‌فرض */
      }
      // ۳) پیش‌فرض‌ها
      if (alive) {
        const g = toGate(DEFAULT_SITE_SETTINGS.shopGate);
        setGate(g);
        if (!g.enabled) setLocked(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const unlock = useCallback(() => {
    try {
      sessionStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      /* noop */
    }
    setLocked(false);
  }, []);

  const tryUnlock = useCallback(
    async (attempt: string) => {
      // ۱) بررسی سمت سرور (رمز واقعی هرگز به مرورگر نمی‌آید)
      try {
        const res = await fetch(withBase("/api/site/shop-gate/unlock"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attempt }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.ok) unlock();
          return;
        }
        if (res.status !== 404 && res.status !== 405) return;
      } catch {
        /* حالت استاتیک — مقایسه محلی */
      }
      // ۲) حالت استاتیک: رمز پیش‌فرض یا نمایشی همین مرورگر
      const code = demoCode();
      if (attempt.toLowerCase().endsWith(code.toLowerCase())) unlock();
    },
    [unlock]
  );

  // شنونده رمز مخفی — فقط حروف انگلیسی، بدون حساسیت به بزرگی/کوچکی
  useEffect(() => {
    if (!locked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return;
      buffer.current = (buffer.current + e.key).slice(-32);
      void tryUnlock(buffer.current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, tryUnlock]);

  // قفل اسکرول صفحه پشت پاپ‌آپ
  useEffect(() => {
    if (!locked) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);

  const g = gate ?? toGate(DEFAULT_SITE_SETTINGS.shopGate);

  return (
    <AnimatePresence>
      {locked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label={g.title}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-forest-950/95 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-[2rem] border border-gold-500/25 bg-forest-900 p-8 text-center shadow-2xl sm:p-10"
          >
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gold-500 text-forest-950 shadow-[0_16px_40px_-12px_rgba(201,162,75,0.6)]">
              <Store size={30} strokeWidth={1.8} />
            </span>
            <h2 className="mt-6 text-2xl font-black leading-snug">{g.title}</h2>
            <p className="mt-4 text-sm leading-8 text-cream/75">{g.message}</p>
            <Link
              href="/"
              className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-3.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400"
            >
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              {g.backLabel}
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
