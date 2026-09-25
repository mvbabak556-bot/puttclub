"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import type { PublicGate } from "@/components/shop/useShopGate";

/**
 * ظاهر یکسان پاپ‌آپ قفل فروشگاه — هم برای باز شدن فروشگاه،
 * هم برای تکمیل خرید. فقط دکمه برگشت دارد و دکمه بستن ندارد.
 */
export default function GateModal({ gate }: { gate: PublicGate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-modal="true"
      aria-label={gate.title}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-forest-950/95 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-[2rem] border border-gold-500/25 bg-forest-900 p-8 text-center shadow-2xl sm:p-10"
      >
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gold-500 text-forest-950 shadow-[0_16px_40px_-12px_rgba(201,162,75,0.6)]">
          <Store size={30} strokeWidth={1.8} />
        </span>
        <h2 className="mt-6 text-2xl font-black leading-snug">{gate.title}</h2>
        <p className="mt-4 text-sm leading-8 text-cream/75">{gate.message}</p>
        <Link
          href="/"
          className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-3.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400"
        >
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          {gate.backLabel}
        </Link>
      </motion.div>
    </motion.div>
  );
}
