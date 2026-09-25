import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import SiteIcon from "@/components/site/SiteIcon";
import { SITE_DEFAULTS, type ProgramsSettings } from "@/lib/site-schema";

export default function Programs({ data = SITE_DEFAULTS.programs }: { data?: ProgramsSettings }) {
  return (
    <section id="programs" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-black tracking-[0.25em] text-gold-400">
              <span className="h-px w-10 bg-gold-500/60" />
              {data.kicker}
            </p>
            <h2 className="mt-4 text-3xl font-black leading-snug sm:text-5xl">
              {data.titleA} <span className="text-gold-grad">{data.titleB}</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-sage">{data.desc}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href={data.linkHref}
              className="group inline-flex items-center gap-2 rounded-full border border-gold-500/30 px-5 py-2.5 text-sm font-bold text-gold-300 transition-all hover:border-gold-400 hover:bg-gold-500/10"
            >
              {data.linkLabel}
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((p) => (
            <StaggerItem key={p.title}>
              <div className="group h-full rounded-3xl border border-gold-500/10 bg-forest-900 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/30">
                <span className="grid size-13 place-items-center rounded-2xl border border-gold-500/25 bg-forest-800 text-gold-400 transition-all duration-500 group-hover:bg-gold-500 group-hover:text-forest-950">
                  <SiteIcon name={p.icon} size={22} strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 text-lg font-black">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-sage">{p.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <Link
            href="/shop"
            className="group mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-gold-500/20 bg-gradient-to-l from-forest-800 to-forest-900 px-7 py-6 sm:flex-row"
          >
            <span className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold-500 text-forest-950">
                <ShoppingBag size={21} strokeWidth={1.9} />
              </span>
              <span>
                <span className="block text-base font-black">{data.bannerTitle}</span>
                <span className="mt-1 block text-xs text-sage">{data.bannerDesc}</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-gold-300">
              {data.bannerLink}
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
