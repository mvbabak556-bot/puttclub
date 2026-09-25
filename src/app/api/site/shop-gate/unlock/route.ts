import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { bootstrapDatabase } from "@/db/bootstrap";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-defaults";

export const dynamic = "force-dynamic";

/**
 * بررسی رمز مخفی ورود به فروشگاه.
 * مقایسه بدون حساسیت به حروف بزرگ/کوچک انجام می‌شود و اگر انتهای
 * حروف تایپ‌شده با رمز برابر باشد، ورود مجاز است (مثلاً B یا Babak).
 */
export async function POST(req: Request) {
  try {
    await bootstrapDatabase();
    const { attempt } = await req.json();
    const typed = String(attempt ?? "").trim().toLowerCase();
    if (!typed) return NextResponse.json({ ok: false });

    let code = DEFAULT_SITE_SETTINGS.shopGate.code;
    try {
      const [row] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, "shopGate"));
      const stored = (row?.value as { code?: unknown } | undefined)?.code;
      if (typeof stored === "string" && stored.trim()) code = stored.trim();
    } catch {
      /* پیش‌فرض */
    }

    const ok = typed.endsWith(code.toLowerCase());
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
