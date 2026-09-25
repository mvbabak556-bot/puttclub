import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { bootstrapDatabase } from "@/db/bootstrap";

/** بررسی مدیر بودن درخواست بر اساس هدر x-admin-email */
export async function verifyAdmin(req: Request): Promise<boolean> {
  const email = req.headers.get("x-admin-email");
  if (!email) return false;
  try {
    await bootstrapDatabase();
    const [u] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()));
    return !!u && u.role === "admin";
  } catch {
    return false;
  }
}

export function unauthorized() {
  return Response.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
}
