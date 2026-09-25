import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const ALLOWED = ["در حال پردازش", "ارسال شد", "تحویل شد", "لغو شد"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!ALLOWED.includes(status)) {
      return NextResponse.json({ error: "وضعیت نامعتبر است." }, { status: 400 });
    }
    const [row] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, Number(id)))
      .returning();
    if (!row) return NextResponse.json({ error: "سفارش یافت نشد." }, { status: 404 });
    return NextResponse.json({ order: row });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
