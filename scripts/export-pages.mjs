import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const base = process.env.PAGES_BASE;
const dest = process.env.PAGES_OUT;
if (!base || !dest) {
  console.error("PAGES_BASE and PAGES_OUT are required");
  process.exit(1);
}

const backup = "/tmp/puttclub-pages-backup";
rmSync(backup, { recursive: true, force: true });
mkdirSync(backup, { recursive: true });

const originals = {
  config: path.join(root, "next.config.ts"),
  home: path.join(root, "src/app/page.tsx"),
  shop: path.join(root, "src/app/shop/page.tsx"),
  academy: path.join(root, "src/app/academy/page.tsx"),
  product: path.join(root, "src/app/product/[slug]/page.tsx"),
};
cpSync(originals.config, path.join(backup, "next.config.ts"));
cpSync(originals.home, path.join(backup, "page.tsx"));
cpSync(originals.shop, path.join(backup, "shop.tsx"));
cpSync(originals.academy, path.join(backup, "academy.tsx"));
cpSync(originals.product, path.join(backup, "product.tsx"));
cpSync(path.join(root, "src/app/api"), path.join(backup, "api"), { recursive: true });

function restore() {
  writeFileSync(originals.config, readFileSync(path.join(backup, "next.config.ts")));
  writeFileSync(originals.home, readFileSync(path.join(backup, "page.tsx")));
  writeFileSync(originals.shop, readFileSync(path.join(backup, "shop.tsx")));
  writeFileSync(originals.academy, readFileSync(path.join(backup, "academy.tsx")));
  writeFileSync(originals.product, readFileSync(path.join(backup, "product.tsx")));
  rmSync(path.join(root, "src/app/api"), { recursive: true, force: true });
  cpSync(path.join(backup, "api"), path.join(root, "src/app/api"), { recursive: true });
  console.log("restored source");
}

try {
  writeFileSync(
    originals.config,
    `import type { NextConfig } from "next";

const basePath = ${JSON.stringify(base)};

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
`
  );

  rmSync(path.join(root, "src/app/api"), { recursive: true, force: true });

  for (const file of [originals.home, originals.shop, originals.academy, originals.product]) {
    writeFileSync(
      file,
      readFileSync(file, "utf8").replaceAll(
        'export const dynamic = "force-dynamic";',
        'export const dynamic = "force-static";'
      )
    );
  }

  writeFileSync(
    originals.shop,
    readFileSync(originals.shop, "utf8")
      .replace(
        `export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  let items: ProductCardData[] = [];`,
        `export default async function ShopPage() {
  let items: ProductCardData[] = [];`
      )
      .replace(
        "return <ShopClient items={items} initialCat={cat ?? null} />;",
        "return <ShopClient items={items} initialCat={null} />;"
      )
  );

  let productText = readFileSync(originals.product, "utf8");
  if (!productText.includes("generateStaticParams")) {
    productText = productText.replace(
      'export const dynamic = "force-static";',
      `export const dynamic = "force-static";

export async function generateStaticParams() {
  await bootstrapDatabase();
  const rows = await db.select({ slug: products.slug }).from(products);
  return rows.map((row) => ({ slug: row.slug }));
}
`
    );
    writeFileSync(originals.product, productText);
  }

  rmSync(path.join(root, "out"), { recursive: true, force: true });
  execSync("node scripts/snapshot-data.mjs", { cwd: root, stdio: "inherit" });
  execSync("npx next build", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_BASE_PATH: base },
  });

  rmSync(dest, { recursive: true, force: true });
  cpSync(path.join(root, "out"), dest, { recursive: true });
  writeFileSync(path.join(dest, ".nojekyll"), "");
  console.log("exported", dest);
} finally {
  restore();
  rmSync(path.join(root, "out"), { recursive: true, force: true });
  rmSync(path.join(root, "public", "data"), { recursive: true, force: true });
}
