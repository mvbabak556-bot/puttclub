import { NextResponse } from "next/server";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, siteSettings, type OrderItem } from "@/db/schema";
import { bootstrapDatabase } from "@/db/bootstrap";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/data";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-defaults";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email");
  if (!email) return NextResponse.json({ orders: [] });
  try {
    await bootstrapDatabase();
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.email, email))
      .orderBy(desc(orders.createdAt));
    return NextResponse.json({ orders: rows });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}

export async function POST(req: Request) {
  try {
    await bootstrapDatabase();
    const body = await req.json();

    // قفل تکمیل خرید: اگر در پنل فعال باشد، ثبت سفارش فقط با رمز مخفی ممکن است
    try {
      const d = DEFAULT_SITE_SETTINGS.shopGate;
      let gate: Record<string, unknown> = { ...d };
      const [row] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, "shopGate"));
      if (row?.value && typeof row.value === "object") {
        gate = { ...d, ...(row.value as object) };
      }
      const checkoutLocked =
        gate.enabled === true && (gate.showOnCheckout ?? true) === true;
      if (checkoutLocked) {
        const code =
          typeof gate.code === "string" && gate.code.trim() ? gate.code.trim() : d.code;
        const attempt = String(body.shopUnlock ?? "").trim().toLowerCase();
        if (!attempt.endsWith(code.toLowerCase())) {
          return NextResponse.json(
            {
              error:
                typeof gate.message === "string" && gate.message
                  ? gate.message
                  : "ثبت سفارش فعلاً بسته است.",
              gateLocked: true,
            },
            { status: 403 }
          );
        }
      }
    } catch {
      /* اگر خواندن تنظیمات شکست خورد، ادامه بده (رفتار قبلی) */
    }

    const customer = body.customer ?? {};
    const items: { productId: number; qty: number }[] = body.items ?? [];

    if (!items.length) {
      return NextResponse.json({ error: "سبد خرید خالی است." }, { status: 400 });
    }
    if (!customer.name || !customer.phone || !customer.address || !customer.city) {
      return NextResponse.json({ error: "اطلاعات ارسال ناقص است." }, { status: 400 });
    }

    // Trust server-side prices
    const ids = items.map((i) => i.productId);
    const rows = await db.select().from(products).where(inArray(products.id, ids));
    const priced: OrderItem[] = items.map((i) => {
      const p = rows.find((r) => r.id === i.productId);
      return {
        productId: i.productId,
        name: p?.name ?? "کالا",
        price: p?.price ?? 0,
        qty: Math.max(1, i.qty),
        image: p?.images?.[0] ?? "",
      };
    });

    const subtotal = priced.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;
    const code = `PC-${Math.floor(100000 + Math.random() * 900000)}`;

    await db.insert(orders).values({
      code,
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email || null,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode || null,
      note: customer.note || null,
      items: priced,
      subtotal,
      shipping,
      total,
    });

    return NextResponse.json({ ok: true, code, total });
  } catch {
    return NextResponse.json({ error: "خطای سرور در ثبت سفارش" }, { status: 500 });
  }
}
