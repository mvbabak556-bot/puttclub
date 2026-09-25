import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { name } = await params;
    const oldName = decodeURIComponent(name);
    const b = await req.json();
    const newName = String(b.name || "").trim();
    if (newName.length < 2) {
      return NextResponse.json({ error: "نام جدید معتبر نیست." }, { status: 400 });
    }
    // تغییر نام دسته در جدول دسته‌ها + همه محصولات
    await db
      .update(categories)
      .set({
        name: newName,
        description: b.description !== undefined ? String(b.description || "") : undefined,
        image: b.image !== undefined ? String(b.image || "") || null : undefined,
      })
      .where(eq(categories.name, oldName));
    await db
      .update(products)
      .set({ category: newName })
      .where(eq(products.category, oldName));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور (شاید نام تکراری باشد)." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { name } = await params;
    const catName = decodeURIComponent(name);
    const [row] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(products)
      .where(eq(products.category, catName));
    if (row && row.n > 0) {
      return NextResponse.json(
        { error: `این دسته ${row.n} محصول دارد؛ اول محصولات را جابه‌جا کنید.` },
        { status: 400 }
      );
    }
    await db.delete(categories).where(eq(categories.name, catName));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
