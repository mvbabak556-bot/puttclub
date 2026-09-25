"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteSettings } from "@/components/SiteProvider";
import { ACADEMY } from "@/lib/academy";
import { withBase } from "@/lib/public";

/** لوگو — فایل جدا در public/images + قابل تغییر از پنل سایت */
export default function Logo() {
  const settings = useSiteSettings();
  const logo = settings.brand.logo || ACADEMY.logo;
  const enShort = settings.brand.faShort ? "Putt Club" : "Putt Club";

  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-gold-500/40 bg-white p-1 transition-colors group-hover:border-gold-400">
        <Image
          src={logo.startsWith("http") ? logo : withBase(logo)}
          alt="لوگوی آکادمی گلف پات کلاب"
          fill
          sizes="44px"
          className="object-contain"
          priority
        />
      </span>
      <span className="leading-none">
        <span className="block font-display text-xl italic tracking-wide text-cream sm:text-2xl">
          {enShort.split(" ")[0]} <span className="text-gold-400">{enShort.split(" ")[1]}</span>
        </span>
        <span className="mt-1 block text-[10px] font-medium text-sage">
          {settings.brand.tagline || ACADEMY.loginTitle}
        </span>
      </span>
    </Link>
  );
}
