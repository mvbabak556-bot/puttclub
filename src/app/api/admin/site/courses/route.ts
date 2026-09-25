import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { siteCourses } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const rows = await db
      .select()
      .from(siteCourses)
      .orderBy(asc(siteCourses.sortOrder), asc(siteCourses.id));
    return NextResponse.json({ courses: rows });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const b = await req.json();
    if (!b.title || !b.shortDesc) {
      return NextResponse.json({ error: "عنوان و معرفی کوتاه الزامی است." }, { status: 400 });
    }
    const [row] = await db
      .insert(siteCourses)
      .values({
        title: String(b.title),
        subtitle: b.subtitle ? String(b.subtitle) : null,
        shortDesc: String(b.shortDesc),
        fullDesc: String(b.fullDesc || ""),
        icon: String(b.icon || "Sparkles"),
        images: Array.isArray(b.images) ? b.images : [],
        galleryMode: String(b.galleryMode || "featured"),
        layout: String(b.layout || "image-right"),
        cardSize: String(b.cardSize || "default"),
        titleColor: b.titleColor || null,
        textColor: b.textColor || null,
        accentColor: b.accentColor || null,
        titleSize: String(b.titleSize || "md"),
        bodySize: String(b.bodySize || "md"),
        bodyAlign: String(b.bodyAlign || "right"),
        footerItems: Array.isArray(b.footerItems) ? b.footerItems : [],
        socials: Array.isArray(b.socials) ? b.socials : [],
        sortOrder: Number(b.sortOrder ?? 0),
        isActive: b.isActive !== false,
      })
      .returning();
    return NextResponse.json({ course: row });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
