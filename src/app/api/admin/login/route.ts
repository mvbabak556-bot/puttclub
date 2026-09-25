import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { bootstrapDatabase } from "@/db/bootstrap";

export const dynamic = "force-dynamic";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export async function POST(req: Request) {
  try {
    await bootstrapDatabase();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "ایمیل و رمز عبور الزامی است." }, { status: 400 });
    }
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, String(email).toLowerCase().trim()));
    if (!user || user.password !== sha(String(password))) {
      return NextResponse.json({ error: "ایمیل یا رمز عبور اشتباه است." }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "این حساب دسترسی مدیریتی ندارد." },
        { status: 403 }
      );
    }
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
