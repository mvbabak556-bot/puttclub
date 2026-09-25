import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteTestimonials } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "وضعیت نامعتبر است." }, { status: 400 });
    }
    const [row] = await db
      .update(siteTestimonials)
      .set({ status })
      .where(eq(siteTestimonials.id, Number(id)))
      .returning();
    if (!row) return NextResponse.json({ error: "یافت نشد." }, { status: 404 });
    return NextResponse.json({ testimonial: row });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { id } = await params;
    await db.delete(siteTestimonials).where(eq(siteTestimonials.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
