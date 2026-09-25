import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/site-settings";
import { SITE_DEFAULTS, type SiteSectionKey } from "@/lib/site-schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { key, value } = (await req.json()) as { key: string; value: unknown };
    if (!key || !(key in SITE_DEFAULTS) || !value || typeof value !== "object") {
      return NextResponse.json({ error: "بخش نامعتبر است." }, { status: 400 });
    }
    const k = key as SiteSectionKey;
    // ترکیب با پیش‌فرض تا فیلدهای حذف‌شده باعث خرابی سایت نشوند
    const merged = { ...(SITE_DEFAULTS[k] as object), ...(value as object) };
    await db
      .insert(siteSettings)
      .values({ key: k, value: merged })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: merged, updatedAt: new Date() },
      });
    return NextResponse.json({ ok: true, key: k, value: merged });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
