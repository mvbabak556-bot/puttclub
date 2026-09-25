import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { bootstrapDatabase } from "@/db/bootstrap";
import {
  SITE_DEFAULTS,
  type SiteSectionKey,
  type SiteSettings,
} from "@/lib/site-schema";

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/** خواندن همه تنظیمات سایت با ترکیب روی مقادیر پیش‌فرض (فقط سمت سرور) */
export async function getSiteSettings(): Promise<SiteSettings> {
  const out = clone(SITE_DEFAULTS);
  try {
    await bootstrapDatabase();
    const rows = await db.select().from(siteSettings);
    for (const row of rows) {
      const key = row.key as SiteSectionKey;
      if (key in out && row.value && typeof row.value === "object") {
        (out[key] as unknown as Record<string, unknown>) = {
          ...((out[key] as unknown) as Record<string, unknown>),
          ...(row.value as Record<string, unknown>),
        };
      }
    }
  } catch {
    /* fallback به پیش‌فرض */
  }
  return out;
}
