import Image from "next/image";
import Link from "next/link";
import { ACADEMY } from "@/lib/academy";
import type { BrandSettings } from "@/lib/site-schema";
import { withBase } from "@/lib/public";

const isRemote = (src: string) => /^(https?:|data:|blob:)/.test(src);

export default function Logo({
  brand = ACADEMY as unknown as BrandSettings,
}: {
  brand?: BrandSettings;
}) {
  const [first, ...rest] = (brand.enShort || "Putt Club").split(" ");
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-gold-500/40 bg-white p-1 transition-colors group-hover:border-gold-400">
        <Image
          src={isRemote(brand.logo) ? brand.logo : withBase(brand.logo)}
          alt={`لوگوی ${brand.faName}`}
          fill
          sizes="44px"
          className="object-contain"
          priority
        />
      </span>
      <span className="leading-none">
        <span className="block font-display text-xl italic tracking-wide text-cream sm:text-2xl">
          {first} <span className="text-gold-400">{rest.join(" ")}</span>
        </span>
        <span className="mt-1 block text-[10px] font-medium text-sage">{brand.loginTitle}</span>
      </span>
    </Link>
  );
}
