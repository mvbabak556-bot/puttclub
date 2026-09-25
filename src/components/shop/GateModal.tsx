"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import type { PublicGate } from "@/components/shop/useShopGate";

/**
 * ظاهر یکسان پاپ‌آپ قفل فروشگاه — هم برای باز شدن فروشگاه،
 * هم برای تکمیل خرید. فقط دکمه برگشت دارد و دکمه بستن ندارد.
 * پس‌زمینه: مات + بلور است تا صفحه پشت (فروشگاه/تسویه) دیده شود،
 * ولی مثل حالت کم‌نور، تیره و تار به نظر برسد.
 */
export default function GateModal({
  gate,
  onBack,
}: {
  gate: PublicGate;
  onBack?: () => void;
}) {
  const opacity = Math.min(95, Math.max(0, gate.overlayOpacity ?? 60));
  const blur = Math.min(24, Math.max(0, gate.overlayBlur ?? 16));
  const backdropFilter = `blur(${blur}px) brightness(60%) saturate(60%)`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-modal="true"
      aria-label={gate.title}
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto p-4"
    >
      {/* لایه مات + بلور: صفحه پشت دیده می‌شود ولی تار و کم‌نور است.
          میزان تیرگی و بلور از پنل فروشگاه (تب پاپ‌آپ فروشگاه) قابل تنظیم است */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(5, 13, 9, ${opacity / 100})`,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
        }}
      />
      {/* وینیت ملایم برای حس تیرگی بیشتر در لبه‌ها — متناسب با تیرگی انتخابی */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(5, 13, 9, ${(0.2 + (opacity / 95) * 0.4).toFixed(2)}) 100%)`,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-[2rem] border border-gold-500/25 bg-forest-900/90 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10"
      >
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gold-500 text-forest-950 shadow-[0_16px_40px_-12px_rgba(201,162,75,0.6)]">
          <Store size={30} strokeWidth={1.8} />
        </span>
        <h2 className="mt-6 text-2xl font-black leading-snug">{gate.title}</h2>
        <p className="mt-4 text-sm leading-8 text-cream/75">{gate.message}</p>
        <Link
          href="/"
          onClick={onBack}
          className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-3.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400"
        >
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          {gate.backLabel}
        </Link>
      </motion.div>
    </motion.div>
  );
}
