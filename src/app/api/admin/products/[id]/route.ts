import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { id } = await params;
    const b = await req.json();
    const patch: Partial<typeof products.$inferInsert> = {};
    if (b.name !== undefined) patch.name = String(b.name).trim();
    if (b.slug !== undefined) patch.slug = String(b.slug).trim();
    if (b.category !== undefined) patch.category = String(b.category).trim();
    if (b.price !== undefined) patch.price = Number(b.price);
    if (b.oldPrice !== undefined) patch.oldPrice = b.oldPrice ? Number(b.oldPrice) : null;
    if (b.shortDesc !== undefined) patch.shortDesc = String(b.shortDesc);
    if (b.description !== undefined) patch.description = String(b.description);
    if (b.features !== undefined) patch.features = Array.isArray(b.features) ? b.features : [];
    if (b.images !== undefined) patch.images = Array.isArray(b.images) ? b.images : [];
    if (b.stock !== undefined) patch.stock = Number(b.stock);
    if (b.badge !== undefined) patch.badge = b.badge || null;
    if (b.isNew !== undefined) patch.isNew = !!b.isNew;
    if (b.isFeatured !== undefined) patch.isFeatured = !!b.isFeatured;
    const [row] = await db
      .update(products)
      .set(patch)
      .where(eq(products.id, Number(id)))
      .returning();
    if (!row) return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
    return NextResponse.json({ product: row });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { id } = await params;
    const pid = Number(id);
    await db.delete(reviews).where(eq(reviews.productId, pid));
    await db.delete(products).where(eq(products.id, pid));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
