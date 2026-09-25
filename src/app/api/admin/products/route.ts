import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const rows = await db.select().from(products);
    return NextResponse.json({ products: rows });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const b = await req.json();
    if (!b.name || !b.slug || !b.category || !b.price) {
      return NextResponse.json({ error: "نام، اسلاگ، دسته و قیمت الزامی است." }, { status: 400 });
    }
    const [row] = await db
      .insert(products)
      .values({
        slug: String(b.slug).trim(),
        name: String(b.name).trim(),
        category: String(b.category).trim(),
        price: Number(b.price),
        oldPrice: b.oldPrice ? Number(b.oldPrice) : null,
        shortDesc: String(b.shortDesc || ""),
        description: String(b.description || ""),
        features: Array.isArray(b.features) ? b.features : [],
        images: Array.isArray(b.images) && b.images.length ? b.images : ["/images/products/driver.jpg"],
        stock: Number(b.stock ?? 10),
        badge: b.badge || null,
        isNew: !!b.isNew,
        isFeatured: !!b.isFeatured,
      })
      .returning();
    return NextResponse.json({ product: row });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "این اسلاگ قبلاً استفاده شده است." }, { status: 409 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
