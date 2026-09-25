"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flag, Loader2 } from "lucide-react";
import { ACADEMY } from "@/lib/academy";

/**
 * صفحه ورود اعضای آکادمی — عمداً خالی نگه داشته شده تا پنل آکادمی
 * (که جداگانه در حال ساخت است) به آن متصل شود.
 * کافی است NEXT_PUBLIC_ACADEMY_PANEL_URL ست شود تا اعضا خودکار منتقل شوند.
 */
export default function AcademyEntryPage() {
  const panelUrl = ACADEMY.panelUrl;

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
        className="relative size-36 overflow-hidden rounded-3xl border border-gold-500/30 bg-black shadow-2xl sm:size-44"
      >
        <Image
          src={ACADEMY.logo}
          alt="لوگوی آکادمی گلف پات کلاب"
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
          {ACADEMY.enName}
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">ورود اعضای آکادمی</h1>

        {panelUrl ? (
          <div className="mt-8 rounded-3xl border border-gold-500/20 bg-forest-900/60 p-8">
            <Loader2 size={28} className="mx-auto animate-spin text-gold-400" />
            <p className="mt-4 text-sm leading-7 text-sage">
              در حال انتقال به پنل آکادمی...
            </p>
            <a
              href={panelUrl}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400"
            >
              انتقال به پنل آکادمی
            </a>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-gold-500/20 bg-forest-900/60 p-8">
            <p className="text-sm leading-8 text-cream/85">
              پنل اعضای آکادمی در حال آماده‌سازی است.
            </p>
            <p className="mt-2 text-xs leading-7 text-sage">
              به‌زودی ورود اعضا از همین‌جا انجام می‌شود.
            </p>
          </div>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-sage transition-colors hover:text-gold-300"
        >
          <ArrowRight size={16} />
          بازگشت به خانه آکادمی
        </Link>
      </motion.div>
    </div>
  );
}
