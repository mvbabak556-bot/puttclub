import type { Metadata } from "next";
import SiteAdminShell from "@/components/admin/SiteAdminShell";

export const metadata: Metadata = {
  title: "مدیریت سایت | پات‌کلاب",
  description: "مدیریت محتوای سایت پات‌کلاب — متن‌ها، تصاویر، قالب و چیدمان.",
};

export default function AdminSitePage() {
  return <SiteAdminShell />;
}
