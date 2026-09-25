import AcademyEntry from "@/components/academy/AcademyEntry";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function AcademyPage() {
  const s = await getSiteSettings();
  return <AcademyEntry data={s.academy} brand={s.brand} />;
}
