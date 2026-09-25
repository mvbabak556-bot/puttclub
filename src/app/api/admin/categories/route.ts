import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const rows = await db.select().from(categories);
    const counts = await db
      .select({ category: products.category, n: sql<number>`count(*)::int` })
      .from(products)
      .groupBy(products.category);
    const map = new Map(counts.map((c) => [c.category, c.n]));
    return NextResponse.json({
      categories: rows.map((c) => ({ ...c, productCount: map.get(c.name) ?? 0 })),
    });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const b = await req.json();
    const name = String(b.name || "").trim();
    if (name.length < 2) {
      return NextResponse.json({ error: "نام دسته معتبر نیست." }, { status: 400 });
    }
    const [row] = await db
      .insert(categories)
      .values({
        name,
        description: b.description ? String(b.description) : null,
        image: b.image ? String(b.image) : null,
      })
      .returning();
    return NextResponse.json({ category: row });
  } catch {
    return NextResponse.json({ error: "این دسته قبلاً وجود دارد." }, { status: 409 });
  }
}
