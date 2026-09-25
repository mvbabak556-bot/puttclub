"use client";

import type { BrandSettings } from "@/lib/site-schema";
import { Card, ImageField, Text } from "./fields";

export default function BrandEditor({
  value,
  onChange,
}: {
  value: BrandSettings;
  onChange: (v: BrandSettings) => void;
}) {
  const set = (k: keyof BrandSettings) => (v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-4">
      <Card title="نام و هویت">
        <Text label="نام فارسی" value={value.faName} onChange={set("faName")} />
        <Text label="نام فارسی کوتاه" value={value.faShort} onChange={set("faShort")} />
        <Text label="نام انگلیسی" value={value.enName} onChange={set("enName")} dir="ltr" />
        <Text label="نام انگلیسی کوتاه (لوگوی متنی)" value={value.enShort} onChange={set("enShort")} dir="ltr" />
        <Text label="زیرنویس لوگو" value={value.loginTitle} onChange={set("loginTitle")} />
      </Card>
      <Card title="تماس و آدرس">
        <Text label="دامنه" value={value.domain} onChange={set("domain")} dir="ltr" />
        <Text label="آدرس وب‌سایت" value={value.siteUrl} onChange={set("siteUrl")} dir="ltr" />
        <Text label="ایمیل" value={value.email} onChange={set("email")} dir="ltr" />
        <Text label="تلفن (انگلیسی)" value={value.phone} onChange={set("phone")} dir="ltr" />
        <Text label="تلفن نمایشی (فارسی)" value={value.phoneFa} onChange={set("phoneFa")} />
        <Text label="آدرس / شهر" value={value.address} onChange={set("address")} />
        <Text label="آیدی اینستاگرام" value={value.instagram} onChange={set("instagram")} dir="ltr" />
        <Text label="لینک اینستاگرام" value={value.instagramUrl} onChange={set("instagramUrl")} dir="ltr" />
      </Card>
      <Card title="لوگو و پنل آکادمی">
        <div className="sm:col-span-2">
          <ImageField label="لوگو (کوچک — هدر و فوتر)" value={value.logo} onChange={set("logo")} />
        </div>
        <div className="sm:col-span-2">
          <ImageField label="لوگو باکیفیت (نمایش بزرگ)" value={value.logoHd} onChange={set("logoHd")} />
        </div>
        <div className="sm:col-span-2">
          <Text
            label="آدرس پنل آکادمی"
            value={value.panelUrl}
            onChange={set("panelUrl")}
            dir="ltr"
            hint="اگر خالی باشد، صفحه ورود آکادمی حالت «به‌زودی» را نشان می‌دهد."
          />
        </div>
      </Card>
    </div>
  );
}
