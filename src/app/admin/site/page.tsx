import type { Metadata } from "next";
import SiteAdminShell from "@/components/admin/SiteAdminShell";

export const metadata: Metadata = {
  title: "مدیریت سایت | پات‌کلاب",
  description: "مدیریت محتوای سایت پات‌کلاب — دوره‌ها، نظرات، محتوا، قالب، تماس و منو.",
};

export default function SiteAdminPage() {
  return <SiteAdminShell />;
}
