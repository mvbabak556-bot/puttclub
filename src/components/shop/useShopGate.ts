"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-defaults";
import { withBase } from "@/lib/public";

export const SHOP_UNLOCK_KEY = "puttclub_shop_unlocked";
export const SHOP_UNLOCK_CODE_KEY = "puttclub_shop_unlock_code";
const DEMO_SETTINGS_KEY = "puttclub_demo_site-settings";
const DEFAULT_CODE = DEFAULT_SITE_SETTINGS.shopGate.code;

export type ShopGateScope = "shop" | "checkout";

export interface PublicGate {
  enabled: boolean;
  showOnShop: boolean;
  showOnCheckout: boolean;
  title: string;
  message: string;
  backLabel: string;
}

export function toPublicGate(v: unknown): PublicGate {
  const d = DEFAULT_SITE_SETTINGS.shopGate;
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const bool = (k: string, fb: boolean) => (typeof o[k] === "boolean" ? (o[k] as boolean) : fb);
  const str = (k: string, fb: string) =>
    typeof o[k] === "string" && (o[k] as string) ? (o[k] as string) : fb;
  return {
    enabled: bool("enabled", d.enabled),
    showOnShop: bool("showOnShop", d.showOnShop),
    showOnCheckout: bool("showOnCheckout", d.showOnCheckout),
    title: str("title", d.title),
    message: str("message", d.message),
    backLabel: str("backLabel", d.backLabel),
  };
}

/** رمز ذخیره‌شده مدیر در همین مرورگر (فقط حالت استاتیک نمایشی) */
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

/** آیا این مرورگر در این جلسه قبلاً قفل را باز کرده؟ */
export function isShopUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SHOP_UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

/** رمزی که با آن قفل باز شده (برای اثبات به سرور هنگام ثبت سفارش) */
export function getUnlockCode(): string {
  try {
    return sessionStorage.getItem(SHOP_UNLOCK_CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

async function loadGate(): Promise<PublicGate> {
  // ۱) API زنده
  try {
    const res = await fetch(withBase("/api/site/content"));
    if (res.ok) {
      const data = await res.json();
      if (data.settings?.shopGate) return toPublicGate(data.settings.shopGate);
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
      if (value) return toPublicGate(value);
    }
  } catch {
    /* پیش‌فرض */
  }
  // ۳) پیش‌فرض‌ها
  return toPublicGate(DEFAULT_SITE_SETTINGS.shopGate);
}

/**
 * هوک مشترک قفل فروشگاه.
 * - scope مشخص می‌کند این قفل برای کدام نقطه است: باز شدن فروشگاه یا تکمیل خرید
 * - وقتی listen=true باشد، شنونده رمز مخفی صفحه‌کلید فعال است
 * - locked یعنی الان باید پاپ‌آپ نمایش داده شود
 */
export function useShopGate(scope: ShopGateScope, listen: boolean) {
  const [gate, setGate] = useState<PublicGate | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const buffer = useRef("");

  useEffect(() => {
    let alive = true;
    if (isShopUnlocked()) {
      setUnlocked(true);
    }
    loadGate().then((g) => {
      if (alive) setGate(g);
    });
    return () => {
      alive = false;
    };
  }, []);

  const unlock = useCallback((attempt?: string) => {
    try {
      sessionStorage.setItem(SHOP_UNLOCK_KEY, "1");
      if (attempt) sessionStorage.setItem(SHOP_UNLOCK_CODE_KEY, attempt);
    } catch {
      /* noop */
    }
    buffer.current = "";
    setUnlocked(true);
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
          if (data.ok) unlock(attempt);
          return;
        }
        if (res.status !== 404 && res.status !== 405) return;
      } catch {
        /* حالت استاتیک — مقایسه محلی */
      }
      // ۲) حالت استاتیک: رمز پیش‌فرض یا نمایشی همین مرورگر
      const code = demoCode();
      if (attempt.toLowerCase().endsWith(code.toLowerCase())) unlock(attempt);
    },
    [unlock]
  );

  // شنونده رمز مخفی — فقط حروف انگلیسی، بدون حساسیت به بزرگی/کوچکی
  useEffect(() => {
    if (!listen || unlocked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return;
      buffer.current = (buffer.current + e.key).slice(-32);
      void tryUnlock(buffer.current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [listen, unlocked, tryUnlock]);

  const g = gate ?? toPublicGate(DEFAULT_SITE_SETTINGS.shopGate);
  const applies = g.enabled && (scope === "shop" ? g.showOnShop : g.showOnCheckout);
  const locked = !unlocked && applies;

  return { gate: g, gateLoaded: gate !== null, locked, unlocked, tryUnlock };
}
