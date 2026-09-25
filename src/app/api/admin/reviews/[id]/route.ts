import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { id } = await params;
    const [target] = await db.select().from(reviews).where(eq(reviews.id, Number(id)));
    if (!target) return NextResponse.json({ error: "دیدگاه یافت نشد." }, { status: 404 });
    await db.delete(reviews).where(eq(reviews.id, Number(id)));
    // بازمحاسبه امتیاز محصول
    const rest = await db.select().from(reviews).where(eq(reviews.productId, target.productId));
    const avg = rest.length ? rest.reduce((s, r) => s + r.rating, 0) / rest.length : 4.5;
    await db
      .update(products)
      .set({ rating: Math.round(avg * 10) / 10, reviewCount: rest.length })
      .where(eq(products.id, target.productId));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
