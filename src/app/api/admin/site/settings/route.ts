import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-defaults";
import { mergeSiteSettings } from "@/lib/site-normalize";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const rows = await db.select().from(siteSettings);
    const obj: Record<string, unknown> = {};
    for (const r of rows) obj[r.key] = r.value;
    return NextResponse.json({ settings: mergeSiteSettings(obj) });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { key, value } = await req.json();
    if (!key || !(key in DEFAULT_SITE_SETTINGS)) {
      return NextResponse.json({ error: "کلید نامعتبر است." }, { status: 400 });
    }
    const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    if (existing) {
      await db.update(siteSettings).set({ value }).where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
