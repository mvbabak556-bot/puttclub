"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryMode } from "@/lib/site-defaults";
import { withBase } from "@/lib/public";

function src(u: string) {
  return u.startsWith("http") ? u : withBase(u);
}

/** گالری تصاویر دوره — سه حالت: ویترینی، اسلایدر، شبکه‌ای */
export default function CourseGallery({
  images,
  mode,
  title,
}: {
  images: string[];
  mode: GalleryMode;
  title: string;
}) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  const safe = Math.min(active, images.length - 1);

  if (mode === "grid") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative aspect-[4/3] overflow-hidden rounded-2xl border-2 transition-all ${
              i === safe ? "border-gold-400" : "border-transparent opacity-80 hover:opacity-100"
            } ${images.length % 2 === 1 && i === 0 ? "col-span-2 aspect-[16/8]" : ""}`}
            aria-label={`تصویر ${i + 1}`}
          >
            <Image src={src(img)} alt={`${title} — ${i + 1}`} fill sizes="400px" className="object-cover" />
          </button>
        ))}
      </div>
    );
  }

  if (mode === "slider") {
    const go = (d: number) => setActive((a) => (a + d + images.length) % images.length);
    return (
      <div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-gold-500/15 bg-forest-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={safe}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image src={src(images[safe])} alt={`${title} — ${safe + 1}`} fill sizes="700px" className="object-cover" />
            </motion.div>
          </AnimatePresence>
          {images.length > 1 && (
            <>
              <button
                onClick={() => go(1)}
                aria-label="تصویر بعدی"
                className="absolute start-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-gold-500/30 bg-forest-950/70 text-gold-300 backdrop-blur transition-colors hover:bg-gold-500 hover:text-forest-950"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => go(-1)}
                aria-label="تصویر قبلی"
                className="absolute end-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-gold-500/30 bg-forest-950/70 text-gold-300 backdrop-blur transition-colors hover:bg-gold-500 hover:text-forest-950"
              >
                <ChevronLeft size={18} />
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`رفتن به تصویر ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === safe ? "w-7 bg-gold-400" : "w-2 bg-forest-600 hover:bg-gold-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // featured — حالت فروشگاهی: عکس بزرگ + بندانگشتی
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-gold-500/15 bg-forest-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={safe}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image src={src(images[safe])} alt={`${title} — ${safe + 1}`} fill sizes="700px" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`تصویر ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                i === safe ? "border-gold-400 opacity-100" : "border-transparent opacity-55 hover:opacity-90"
              }`}
            >
              <Image src={src(img)} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
