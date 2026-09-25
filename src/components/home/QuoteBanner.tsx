"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/Motion";
import { SITE_DEFAULTS, type QuoteSettings } from "@/lib/site-schema";
import { withBase } from "@/lib/public";

const isRemote = (src: string) => /^(https?:|data:|blob:)/.test(src);

export default function QuoteBanner({ data = SITE_DEFAULTS.quote }: { data?: QuoteSettings }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 scale-125">
        <Image
          src={isRemote(data.image) ? data.image : withBase(data.image)}
          alt={data.imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-forest-950/72" />

      <div className="relative mx-auto max-w-4xl px-4 py-32 text-center sm:px-6 sm:py-44">
        <Reveal>
          <span className="mx-auto grid size-14 place-items-center rounded-full border border-gold-500/40 bg-forest-950/50 text-gold-400 backdrop-blur">
            <Quote size={22} />
          </span>
          <blockquote className="mt-8 text-2xl font-black leading-[1.7] sm:text-4xl sm:leading-[1.7]">
            {data.line1} <span className="text-gold-grad">{data.line1Gold}</span>؛
            <br />
            {data.line2}
          </blockquote>
          <p className="mt-6 text-sm font-medium tracking-widest text-cream/60">{data.author}</p>
        </Reveal>
      </div>
    </section>
  );
}
