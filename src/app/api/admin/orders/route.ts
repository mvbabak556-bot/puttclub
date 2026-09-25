import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json({ orders: rows });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
