import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { siteTestimonials } from "@/db/schema";
import { bootstrapDatabase } from "@/db/bootstrap";

export const dynamic = "force-dynamic";

const toEn = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

/** نظرات تأییدشده (بدون شماره تماس) */
export async function GET() {
  try {
    await bootstrapDatabase();
    const rows = await db
      .select()
      .from(siteTestimonials)
      .where(eq(siteTestimonials.status, "approved"))
      .orderBy(desc(siteTestimonials.createdAt));
    return NextResponse.json({
      testimonials: rows.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        text: r.text,
        rating: r.rating,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ testimonials: [] });
  }
}

/** ثبت نظر جدید — بدون نیاز به ثبت‌نام؛ با تأیید مدیر نمایش داده می‌شود */
export async function POST(req: Request) {
  try {
    await bootstrapDatabase();
    const b = await req.json();
    const name = String(b.name ?? "").trim();
    const phone = toEn(String(b.phone ?? "").trim());
    const text = String(b.text ?? "").trim();
    const rating = Math.min(5, Math.max(1, Number(b.rating) || 5));
    if (name.length < 3) {
      return NextResponse.json({ error: "نام و نام خانوادگی را کامل وارد کنید." }, { status: 400 });
    }
    if (!/^09\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "شماره تماس معتبر نیست." }, { status: 400 });
    }
    if (text.length < 10) {
      return NextResponse.json({ error: "متن نظر کوتاه است." }, { status: 400 });
    }
    const [row] = await db
      .insert(siteTestimonials)
      .values({ name, phone, text, rating, role: b.role ? String(b.role) : null })
      .returning({ id: siteTestimonials.id });
    return NextResponse.json({ ok: true, id: row.id });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
