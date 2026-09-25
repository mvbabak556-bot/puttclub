import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { toCardData, type ProductCardData } from "@/lib/types";
import { bootstrapDatabase } from "@/db/bootstrap";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import About from "@/components/home/About";
import Programs from "@/components/home/Programs";
import Featured from "@/components/home/Featured";
import QuoteBanner from "@/components/home/QuoteBanner";
import FeaturesStrip from "@/components/home/FeaturesStrip";
import Testimonials from "@/components/home/Testimonials";
import Contact from "@/components/home/Contact";
import CtaBanner from "@/components/home/CtaBanner";

export const dynamic = "force-dynamic";

async function getFeatured(): Promise<ProductCardData[]> {
  try {
    await bootstrapDatabase();
    const featured = await db
      .select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .limit(4);
    if (featured.length > 0) return featured.map(toCardData);
    const latest = await db.select().from(products).orderBy(desc(products.id)).limit(4);
    return latest.map(toCardData);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Programs />
      <Featured
        items={featured}
        kicker="فروشگاه پات کلاب"
        title={
          <>
            از <span className="text-gold-grad">فروشگاه</span> آکادمی
          </>
        }
        desc="تجهیزات اورجینال با ضمانت اصالت؛ همان چیزی که در آکادمی با آن تمرین می‌کنید، برای خانه شما."
      />
      <FeaturesStrip />
      <QuoteBanner />
      <Testimonials />
      <Contact />
      <CtaBanner />
    </>
  );
}
