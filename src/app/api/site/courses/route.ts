import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { siteCourses } from "@/db/schema";
import { bootstrapDatabase } from "@/db/bootstrap";

export const dynamic = "force-dynamic";

/** دوره‌های فعال برای نمایش عمومی */
export async function GET() {
  try {
    await bootstrapDatabase();
    const rows = await db
      .select()
      .from(siteCourses)
      .where(eq(siteCourses.isActive, true))
      .orderBy(asc(siteCourses.sortOrder), asc(siteCourses.id));
    return NextResponse.json({ courses: rows });
  } catch {
    return NextResponse.json({ courses: [] });
  }
}
