import Image from "next/image";
import Link from "next/link";
import { ACADEMY } from "@/lib/academy";
import { withBase } from "@/lib/public";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-gold-500/40 bg-black transition-colors group-hover:border-gold-400">
        <Image
          src={withBase(ACADEMY.logo)}
          alt="لوگوی آکادمی گلف پات کلاب"
          fill
          sizes="44px"
          className="object-contain"
          priority
        />
      </span>
      <span className="leading-none">
        <span className="block font-display text-xl italic tracking-wide text-cream sm:text-2xl">
          Putt <span className="text-gold-400">Club</span>
        </span>
        <span className="mt-1 block text-[10px] font-medium text-sage">آکادمی گلف</span>
      </span>
    </Link>
  );
}
