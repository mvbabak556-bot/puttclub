// اسنپ‌شات دیتای عمومی برای حالت نمایشی پنل مدیر روی هاست استاتیک.
// فقط محصولات، دسته‌بندی‌ها و دیدگاه‌ها (عمومی‌اند) — سفارش‌ها و کاربران
// حاوی اطلاعات خصوصی‌اند و اسنپ‌شات نمی‌شوند.
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

  const dir = path.join(root, "public", "data");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "products.json"), JSON.stringify(products.rows));
  writeFileSync(path.join(dir, "categories.json"), JSON.stringify(categories.rows));
  writeFileSync(path.join(dir, "reviews.json"), JSON.stringify(reviews.rows));
  console.log(
    `snapshot: ${products.rows.length} products, ${categories.rows.length} categories, ${reviews.rows.length} reviews`
  );
} finally {
  await pool.end();
}
