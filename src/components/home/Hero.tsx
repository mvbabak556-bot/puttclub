"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ChevronDown, Flag, ShoppingBag, Sparkles } from "lucide-react";
import { STOCK } from "@/lib/data";
import { ACADEMY } from "@/lib/academy";
import { withBase } from "@/lib/public";

const EASE = [0.22, 1, 0.36, 1] as const;

function Line({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className="block"
        initial={{ y: "112%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const STATS = [
  { value: "اهواز", label: "خانه آکادمی" },
  { value: "مبتدی تا حرفه‌ای", label: "سطوح آموزشی" },
  { value: "puttclub.ir", label: "وب‌سایت رسمی" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-svh flex-col overflow-hidden">
      {/* Video background — فایل اصلی بدون هیچ تغییری؛ فقط نمایش شفاف‌تر شد */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 scale-105">
        <video
          className="size-full object-cover [filter:saturate(1.12)_contrast(1.06)_brightness(1.04)]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={STOCK.courseDawn}
        >
          <source src={withBase("/videos/golf-hero.mp4")} type="video/mp4" />
        </video>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/20 to-forest-950" />
      <div className="absolute inset-0 bg-gradient-to-l from-forest-950/35 via-transparent to-forest-950/30" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pb-44 pt-32 text-center sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-forest-950/40 px-4 py-2 text-xs font-medium text-gold-200 backdrop-blur"
        >
          <Sparkles size={14} className="text-gold-400" />
          {ACADEMY.enName} — {ACADEMY.address}
        </motion.div>

        {/* لوگوی رسمی آکادمی — بدون هیچ تغییری */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          className="relative mb-8 size-32 overflow-hidden rounded-3xl border border-gold-500/30 bg-black shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] sm:size-36"
        >
          <Image
            src={withBase(ACADEMY.logo)}
            alt="لوگوی آکادمی گلف پات کلاب"
            fill
            sizes="144px"
            className="object-contain"
            priority
          />
        </motion.div>

        <h1 className="text-[13.5vw] font-black leading-[1.12] tracking-tight sm:text-7xl lg:text-8xl">
          <Line delay={0.3}>آکادمی گلف</Line>
          <Line delay={0.45}>
            <span className="text-gold-grad">پات کلاب</span>
          </Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
          className="mt-8 max-w-xl text-base leading-8 text-cream/75 sm:text-lg sm:leading-9"
        >
          از اولین سوئینگ تا آمادگی مسابقه؛ آموزش اصولی گلف با مربیان حرفه‌ای در اهواز،
          همراه با فروشگاه تخصصی تجهیزات اورجینال.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            href="/academy"
            className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-black text-forest-950 shadow-[0_16px_40px_-12px_rgba(201,162,75,0.6)] transition-all hover:bg-gold-400"
          >
            <Flag size={17} />
            ورود اعضای آکادمی
            <ArrowLeft size={17} className="transition-transform group-hover:-translate-x-1" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-8 py-4 text-sm font-bold text-cream backdrop-blur transition-all hover:border-gold-400 hover:text-gold-300"
          >
            <ShoppingBag size={17} />
            فروشگاه تجهیزات
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
          className="mt-16 flex items-center gap-8 sm:gap-12"
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8 sm:gap-12">
              {i > 0 && <span className="h-9 w-px bg-gold-500/25" />}
              <div className="text-center">
                <div className="text-xl font-black text-gold-300 sm:text-2xl" dir="auto">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] text-cream/60 sm:text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="grid size-11 place-items-center rounded-full border border-gold-500/30 text-gold-400"
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
