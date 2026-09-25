"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera, Flag, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/Motion";
import { useSiteSettings } from "@/components/SiteProvider";
import { withBase } from "@/lib/public";

export default function About() {
  const settings = useSiteSettings();
  const about = settings.about;
  const contact = settings.contact;
  const brand = settings.brand;

  const INFO = [
    { icon: MapPin, label: "موقعیت", value: contact.address },
    { icon: Phone, label: "تلفن", value: contact.phoneFa, ltr: true },
    { icon: Mail, label: "ایمیل", value: contact.email, ltr: true },
    { icon: Camera, label: "اینستاگرام", value: `@${contact.instagram}`, ltr: true },
  ];

  const img = about.image || "/images/academy-about.jpg";

  return (
    <section id="academy" className="relative scroll-mt-24 py-24 sm:py-32">
      <span
        aria-hidden
        className="text-stroke-gold pointer-events-none absolute -top-2 start-0 select-none font-display text-[22vw] font-bold italic leading-none lg:text-[13rem]"
      >
        GOLF
      </span>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* تصویر تعریفی آکادمی — از پنل سایت قابل تغییر است */}
          <Reveal className="order-first">
            <div className="relative mx-auto w-fit">
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[2.5rem] bg-gold-500/10 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-gold-500/25 shadow-2xl">
                <Image
                  src={img.startsWith("http") ? img : withBase(img)}
                  alt={about.title}
                  width={1024}
                  height={760}
                  sizes="(max-width:1024px) 90vw, 520px"
                  className="h-auto w-full max-w-xl object-cover"
                  priority={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/55 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-5 start-1/2 flex w-max -translate-x-1/2 items-center gap-2 rounded-full border border-gold-500/30 bg-forest-950/90 px-5 py-2.5 text-xs font-bold text-gold-300 backdrop-blur">
                <Flag size={14} className="text-gold-400" />
                {about.imageCaption || brand.enName}
              </div>
            </div>
          </Reveal>

          {/* متن */}
          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-black tracking-[0.25em] text-gold-400">
                <span className="h-px w-10 bg-gold-500/60" />
                {about.kicker}
              </p>
              <h2 className="mt-4 text-3xl font-black leading-snug sm:text-5xl">{about.title}</h2>
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mt-6 text-sm leading-8 text-cream/75 sm:text-base sm:leading-9"
                >
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal delay={0.12}>
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {INFO.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-gold-500/10 bg-forest-900/60 px-4 py-3.5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-gold-500/25 bg-forest-800 text-gold-400">
                      <item.icon size={17} strokeWidth={1.8} />
                    </span>
                    <span>
                      <span className="block text-[11px] text-sage">{item.label}</span>
                      <span
                        className="mt-0.5 block text-sm font-bold text-cream"
                        dir={item.ltr ? "ltr" : "rtl"}
                      >
                        {item.value}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/academy"
                  className="enter-members group inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400"
                >
                  <Flag size={16} />
                  ورود اعضای آکادمی
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-500/30 px-7 py-3.5 text-sm font-bold text-gold-300 transition-all hover:border-gold-400 hover:bg-gold-500/10"
                >
                  فروشگاه تجهیزات
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
