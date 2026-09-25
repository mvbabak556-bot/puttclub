import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteCourses } from "@/db/schema";
import { unauthorized, verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { id } = await params;
    const b = await req.json();
    const patch: Partial<typeof siteCourses.$inferInsert> = {};
    const str = (v: unknown) => (v === undefined ? undefined : String(v));
    if (b.title !== undefined) patch.title = String(b.title);
    if (b.subtitle !== undefined) patch.subtitle = b.subtitle ? String(b.subtitle) : null;
    if (b.shortDesc !== undefined) patch.shortDesc = String(b.shortDesc);
    if (b.fullDesc !== undefined) patch.fullDesc = String(b.fullDesc);
    if (b.icon !== undefined) patch.icon = str(b.icon);
    if (b.images !== undefined) patch.images = Array.isArray(b.images) ? b.images : [];
    if (b.galleryMode !== undefined) patch.galleryMode = str(b.galleryMode);
    if (b.layout !== undefined) patch.layout = str(b.layout);
    if (b.cardSize !== undefined) patch.cardSize = str(b.cardSize);
    if (b.titleColor !== undefined) patch.titleColor = b.titleColor || null;
    if (b.textColor !== undefined) patch.textColor = b.textColor || null;
    if (b.accentColor !== undefined) patch.accentColor = b.accentColor || null;
    if (b.titleSize !== undefined) patch.titleSize = str(b.titleSize);
    if (b.bodySize !== undefined) patch.bodySize = str(b.bodySize);
    if (b.bodyAlign !== undefined) patch.bodyAlign = str(b.bodyAlign);
    if (b.footerItems !== undefined)
      patch.footerItems = Array.isArray(b.footerItems) ? b.footerItems : [];
    if (b.socials !== undefined) patch.socials = Array.isArray(b.socials) ? b.socials : [];
    if (b.sortOrder !== undefined) patch.sortOrder = Number(b.sortOrder);
    if (b.isActive !== undefined) patch.isActive = !!b.isActive;
    const [row] = await db
      .update(siteCourses)
      .set(patch)
      .where(eq(siteCourses.id, Number(id)))
      .returning();
    if (!row) return NextResponse.json({ error: "یافت نشد." }, { status: 404 });
    return NextResponse.json({ course: row });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin(req))) return unauthorized();
  try {
    const { id } = await params;
    await db.delete(siteCourses).where(eq(siteCourses.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
