"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flag, Loader2 } from "lucide-react";
import { SITE_DEFAULTS, type AcademyEntrySettings, type BrandSettings } from "@/lib/site-schema";
import { ACADEMY } from "@/lib/academy";
import { withBase } from "@/lib/public";

const isRemote = (src: string) => /^(https?:|data:|blob:)/.test(src);

/**
 * صفحه ورود اعضای آکادمی — وقتی آدرس پنل آکادمی در تنظیمات ست شود،
 * اعضا خودکار به آن منتقل می‌شوند.
 */
export default function AcademyEntry({
  data = SITE_DEFAULTS.academy,
  brand = ACADEMY as unknown as BrandSettings,
}: {
  data?: AcademyEntrySettings;
  brand?: BrandSettings;
}) {
  const panelUrl = brand.panelUrl;

  useEffect(() => {
    if (!panelUrl) return;
    const t = setTimeout(() => {
      window.location.href = panelUrl;
    }, 1500);
    return () => clearTimeout(t);
  }, [panelUrl]);

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 pb-16 pt-32 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative size-36 overflow-hidden rounded-3xl border border-gold-500/30 bg-white p-2 shadow-2xl sm:size-44"
      >
        <Image
          src={isRemote(data.image) ? data.image : withBase(data.image)}
          alt={`لوگوی ${brand.faName}`}
          fill
          sizes="176px"
          className="object-contain"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <p className="mt-8 flex items-center justify-center gap-2 text-xs font-black tracking-[0.25em] text-gold-400">
          <Flag size={13} />
          {data.badge}
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">{data.title}</h1>

        {panelUrl ? (
          <div className="mt-8 rounded-3xl border border-gold-500/20 bg-forest-900/60 p-8">
            <Loader2 size={28} className="mx-auto animate-spin text-gold-400" />
            <p className="mt-4 text-sm leading-7 text-sage">{data.loadingText}</p>
            <a
              href={panelUrl}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400"
            >
              {data.panelButton}
            </a>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-gold-500/20 bg-forest-900/60 p-8">
            <p className="text-sm leading-8 text-cream/85">{data.waitingTitle}</p>
            <p className="mt-2 text-xs leading-7 text-sage">{data.waitingDesc}</p>
          </div>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-sage transition-colors hover:text-gold-300"
        >
          <ArrowRight size={16} />
          {data.backLabel}
        </Link>
      </motion.div>
    </div>
  );
}
