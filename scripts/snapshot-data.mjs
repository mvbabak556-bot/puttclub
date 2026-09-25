// اسنپ‌شات دیتای عمومی برای حالت نمایشی روی هاست استاتیک.
// - محصولات، دسته‌بندی‌ها، دیدگاه‌های فروشگاه
// - دوره‌ها و نظرات تأییدشده سایت + تنظیمات عمومی
// سفارش‌ها، کاربران و شماره تماس‌ها خصوصی‌اند و اسنپ‌شات نمی‌شوند.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import pg from "pg";

const root = process.cwd();
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is required for snapshot");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: dbUrl });
try {
  const products = await pool.query("SELECT * FROM products ORDER BY id");
  const categories = await pool.query("SELECT * FROM categories ORDER BY id");
  const reviews = await pool.query("SELECT * FROM reviews ORDER BY id");
  const courses = await pool.query("SELECT * FROM site_courses ORDER BY sort_order, id");
  const testimonials = await pool.query(
    "SELECT id, name, role, text, rating, status, created_at AS \"createdAt\" FROM site_testimonials ORDER BY id"
  );
  const settings = await pool.query("SELECT key, value FROM site_settings");

  const dir = path.join(root, "public", "data");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "products.json"), JSON.stringify(products.rows));
  writeFileSync(path.join(dir, "categories.json"), JSON.stringify(categories.rows));
  writeFileSync(path.join(dir, "reviews.json"), JSON.stringify(reviews.rows));
  writeFileSync(path.join(dir, "site-courses.json"), JSON.stringify(courses.rows));
  writeFileSync(path.join(dir, "site-testimonials.json"), JSON.stringify(testimonials.rows));
  writeFileSync(path.join(dir, "site-settings.json"), JSON.stringify(settings.rows));
  console.log(
    `snapshot: ${products.rows.length} products, ${categories.rows.length} categories, ${reviews.rows.length} reviews, ${courses.rows.length} courses, ${testimonials.rows.length} testimonials, ${settings.rows.length} settings`
  );
} finally {
  await pool.end();
}
