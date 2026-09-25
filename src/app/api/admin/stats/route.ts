import { NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, reviews, users } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const [p] = await db.select({ n: sql<number>`count(*)::int` }).from(products);
    const [o] = await db.select({ n: sql<number>`count(*)::int` }).from(orders);
    const [u] = await db.select({ n: sql<number>`count(*)::int` }).from(users);
    const [r] = await db.select({ n: sql<number>`count(*)::int` }).from(reviews);
    const [rev] = await db
      .select({ s: sql<number>`coalesce(sum(total),0)::int` })
      .from(orders);
    const lowStock = await db
      .select({ id: products.id, name: products.name, stock: products.stock })
      .from(products)
      .orderBy(products.stock)
      .limit(5);
    const recent = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);
    const byCat = await db
      .select({ category: products.category, n: sql<number>`count(*)::int` })
      .from(products)
      .groupBy(products.category);
    return NextResponse.json({
      products: p?.n ?? 0,
      orders: o?.n ?? 0,
      users: u?.n ?? 0,
      reviews: r?.n ?? 0,
      revenue: rev?.s ?? 0,
      lowStock,
      recent,
      byCat,
    });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
