import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "داشبورد مدیر | پات‌کلاب",
  description: "مدیریت فروشگاه پات‌کلاب — سفارش‌ها، محصولات، دسته‌بندی‌ها، دیدگاه‌ها و کاربران.",
};

export default function AdminPage() {
  return <AdminShell />;
}
