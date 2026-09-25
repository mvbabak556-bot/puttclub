import { createHash } from "crypto";
import { eq, sql } from "drizzle-orm";
import { db } from "./index";
import { categories, products, siteCourses, users } from "./schema";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

/**
 * DDL همگام با src/db/schema.ts تا اپ روی دیتابیس تازه خودش جدول‌ها را
 * بسازد و کاتالوگ نمونه را سید کند (بدون نیاز به دستور دستی).
 */
const DDL = [
  `CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY,
    slug varchar(140) NOT NULL UNIQUE,
    name text NOT NULL,
    category varchar(60) NOT NULL,
    price integer NOT NULL,
    old_price integer,
    short_desc text NOT NULL,
    description text NOT NULL,
    features jsonb NOT NULL,
    images jsonb NOT NULL,
    rating real NOT NULL DEFAULT 4.5,
    review_count integer NOT NULL DEFAULT 0,
    stock integer NOT NULL DEFAULT 10,
    badge varchar(40),
    is_new boolean NOT NULL DEFAULT false,
    is_featured boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id serial PRIMARY KEY,
    product_id integer NOT NULL REFERENCES products(id),
    author text NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id serial PRIMARY KEY,
    code varchar(20) NOT NULL UNIQUE,
    customer_name text NOT NULL,
    phone varchar(20) NOT NULL,
    email text,
    address text NOT NULL,
    city text NOT NULL,
    postal_code varchar(20),
    note text,
    items jsonb NOT NULL,
    subtotal integer NOT NULL,
    shipping integer NOT NULL DEFAULT 0,
    total integer NOT NULL,
    status varchar(30) NOT NULL DEFAULT 'در حال پردازش',
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    phone varchar(20),
    role varchar(20) NOT NULL DEFAULT 'member',
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id serial PRIMARY KEY,
    name varchar(60) NOT NULL UNIQUE,
    description text,
    image text,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS role varchar(20) NOT NULL DEFAULT 'member'`,
  `CREATE TABLE IF NOT EXISTS site_courses (
    id serial PRIMARY KEY,
    title text NOT NULL,
    subtitle text,
    short_desc text NOT NULL,
    full_desc text NOT NULL DEFAULT '',
    icon varchar(40) NOT NULL DEFAULT 'Sparkles',
    images jsonb NOT NULL DEFAULT '[]',
    gallery_mode varchar(20) NOT NULL DEFAULT 'featured',
    layout varchar(20) NOT NULL DEFAULT 'image-right',
    card_size varchar(20) NOT NULL DEFAULT 'default',
    title_color varchar(20),
    text_color varchar(20),
    accent_color varchar(20),
    title_size varchar(10) NOT NULL DEFAULT 'md',
    body_size varchar(10) NOT NULL DEFAULT 'md',
    body_align varchar(10) NOT NULL DEFAULT 'right',
    footer_items jsonb NOT NULL DEFAULT '[]',
    socials jsonb NOT NULL DEFAULT '[]',
    sort_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS site_testimonials (
    id serial PRIMARY KEY,
    name text NOT NULL,
    phone varchar(20) NOT NULL,
    role text,
    text text NOT NULL,
    rating integer NOT NULL DEFAULT 5,
    status varchar(20) NOT NULL DEFAULT 'pending',
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS site_settings (
    id serial PRIMARY KEY,
    key varchar(60) NOT NULL UNIQUE,
    value jsonb NOT NULL,
    updated_at timestamp NOT NULL DEFAULT now()
  )`,
];

let pending: Promise<void> | null = null;

/**
 * جدول‌ها را می‌سازد و اگر کاتالوگ خالی بود سید می‌کند.
 * ایدمپوتنت است و هیچ‌وقت throw نمی‌کند تا فروشگاه پایین نیاید.
 */
export function bootstrapDatabase(): Promise<void> {
  if (!pending) {
    pending = (async () => {
      try {
        for (const statement of DDL) {
          await db.execute(sql.raw(statement));
        }
        const [row] = await db
          .select({ n: sql<number>`count(*)::int` })
          .from(products);
        if (!row || row.n === 0) {
          const { seedDatabase } = await import("./seed");
          await seedDatabase(false);
          console.log("[puttclub] demo catalogue seeded on fresh database");
        }
        // دسته‌بندی‌های پایه اگر نباشند
        const [crow] = await db
          .select({ n: sql<number>`count(*)::int` })
          .from(categories);
        if (!crow || crow.n === 0) {
          const names = ["چوب‌ها", "توپ‌ها", "کیف‌ها", "کفش و دستکش", "پوشاک", "لوازم جانبی"];
          await db.insert(categories).values(names.map((name) => ({ name })));
          console.log("[puttclub] base categories seeded");
        }
        // محتوای سایت (دوره‌ها، نظرات، تنظیمات) اگر نباشد
        const [scrow] = await db
          .select({ n: sql<number>`count(*)::int` })
          .from(siteCourses);
        if (!scrow || scrow.n === 0) {
          const { seedSiteContent } = await import("./seed-site");
          await seedSiteContent();
        }
        // کاربر مدیر اگر نباشد — و مهاجرت رمز قدیمی به رمز جدید
        const [admin] = await db
          .select()
          .from(users)
          .where(eq(users.email, "admin@puttclub.ir"));
        if (!admin) {
          await db.insert(users).values({
            name: "مدیر فروشگاه",
            email: "admin@puttclub.ir",
            password: sha("Golf1405"),
            phone: "09123456780",
            role: "admin",
          });
          console.log("[puttclub] admin user seeded");
        } else if (admin.password === sha("admin1234")) {
          await db
            .update(users)
            .set({ password: sha("Golf1405"), role: "admin" })
            .where(eq(users.email, "admin@puttclub.ir"));
          console.log("[puttclub] admin password migrated");
        }
      } catch (e) {
        console.error("[puttclub] bootstrap failed:", e);
      }
    })();
  }
  return pending;
}
