import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { bootstrapDatabase } from "@/db/bootstrap";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-defaults";

export const dynamic = "force-dynamic";

/** تنظیمات عمومی سایت (برند، قالب، تماس، منو، متن‌ها) */
export async function GET() {
  try {
    await bootstrapDatabase();
    const rows = await db.select().from(siteSettings);
    const merged: Record<string, unknown> = { ...DEFAULT_SITE_SETTINGS };
    for (const r of rows) merged[r.key] = r.value;
    return NextResponse.json({ settings: merged });
  } catch {
    return NextResponse.json({ settings: DEFAULT_SITE_SETTINGS });
  }
}
