import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera, Flag, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/Motion";
import { ACADEMY } from "@/lib/academy";
import { SITE_DEFAULTS, type AboutSettings, type BrandSettings } from "@/lib/site-schema";
import { withBase } from "@/lib/public";

const isRemote = (src: string) => /^(https?:|data:|blob:)/.test(src);

export default function About({
  data = SITE_DEFAULTS.about,
  brand = ACADEMY as unknown as BrandSettings,
}: {
  data?: AboutSettings;
  brand?: BrandSettings;
}) {
  const INFO = [
    { icon: MapPin, label: data.infoLabels.location, value: brand.address },
    { icon: Phone, label: data.infoLabels.phone, value: brand.phoneFa, ltr: true },
    { icon: Mail, label: data.infoLabels.email, value: brand.email, ltr: true },
    { icon: Camera, label: data.infoLabels.instagram, value: `@${brand.instagram}`, ltr: true },
  ];

  return (
    <section id="academy" className="relative scroll-mt-24 py-24 sm:py-32">
      <span
        aria-hidden
        className="text-stroke-gold pointer-events-none absolute -top-2 start-0 select-none font-display text-[22vw] font-bold italic leading-none lg:text-[13rem]"
      >
        {data.bgWord}
      </span>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Logo visual */}
          <Reveal className="order-first">
            <div className="relative mx-auto w-fit">
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[2.5rem] bg-gold-500/10 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-gold-500/25 bg-white p-3 shadow-2xl sm:p-4">
                <Image
                  src={isRemote(data.image) ? data.image : withBase(data.image)}
                  alt={`لوگوی ${brand.faName}`}
                  width={1024}
                  height={1024}
                  sizes="(max-width:1024px) 90vw, 480px"
                  className="h-auto w-full max-w-md object-contain"
                  priority={false}
                />
              </div>
              <div className="absolute -bottom-5 start-1/2 flex w-max -translate-x-1/2 items-center gap-2 rounded-full border border-gold-500/30 bg-forest-950/90 px-5 py-2.5 text-xs font-bold text-gold-300 backdrop-blur">
                <Flag size={14} className="text-gold-400" />
                {brand.enName}
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-black tracking-[0.25em] text-gold-400">
                <span className="h-px w-10 bg-gold-500/60" />
                {data.kicker}
              </p>
              <h2 className="mt-4 text-3xl font-black leading-snug sm:text-5xl">
                {brand.faName}
              </h2>
              <p className="mt-6 text-sm leading-8 text-cream/75 sm:text-base sm:leading-9">
                {data.desc}
              </p>
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
                  href={data.primaryHref}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400"
                >
                  <Flag size={16} />
                  {data.primaryLabel}
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                </Link>
                <Link
                  href={data.secondaryHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-500/30 px-7 py-3.5 text-sm font-bold text-gold-300 transition-all hover:border-gold-400 hover:bg-gold-500/10"
                >
                  {data.secondaryLabel}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
