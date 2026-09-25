"use client";

import { Camera, Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { useSiteSettings } from "@/components/SiteProvider";

export default function Contact() {
  const settings = useSiteSettings();
  const c = settings.contact;

  const CARDS = [
    { icon: Phone, title: "تلفن آکادمی", value: c.phoneFa, href: `tel:${c.phone}`, ltr: true },
    { icon: Mail, title: "ایمیل", value: c.email, href: `mailto:${c.email}`, ltr: true },
    { icon: MapPin, title: "آدرس", value: c.address, href: undefined, ltr: false },
    { icon: Camera, title: "اینستاگرام", value: `@${c.instagram}`, href: c.instagramUrl, ltr: true },
  ];

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="inline-flex items-center gap-3 text-xs font-black tracking-[0.25em] text-gold-400">
            <span className="h-px w-10 bg-gold-500/60" />
            تماس با ما
            <span className="h-px w-10 bg-gold-500/60" />
          </p>
          <h2 className="mt-4 text-3xl font-black leading-snug sm:text-5xl">
            آکادمی در <span className="text-gold-grad">یک قدمی</span> شماست
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-sage">
            برای ثبت‌نام در دوره‌ها، رزرو کلاس خصوصی یا مشاوره خرید تجهیزات، با ما در
            تماس باشید.
          </p>
          {c.hours && (
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-gold-300">
              <Clock size={14} />
              {c.hours}
            </p>
          )}
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => {
            const inner = (
              <>
                <span className="grid size-13 place-items-center rounded-2xl border border-gold-500/25 bg-forest-800 text-gold-400 transition-all duration-500 group-hover:bg-gold-500 group-hover:text-forest-950">
                  <card.icon size={22} strokeWidth={1.7} />
                </span>
                <span className="mt-5 block text-sm font-black">{card.title}</span>
                <span
                  className="mt-2 block text-sm font-bold text-gold-300"
                  dir={card.ltr ? "ltr" : "rtl"}
                >
                  {card.value}
                </span>
              </>
            );
            return (
              <StaggerItem key={card.title}>
                {card.href ? (
                  <a
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel={card.href.startsWith("http") ? "noreferrer" : undefined}
                    className="group block h-full rounded-3xl border border-gold-500/10 bg-forest-900 p-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/30"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group block h-full rounded-3xl border border-gold-500/10 bg-forest-900 p-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/30">
                    {inner}
                  </div>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.15}>
          <div className="mt-8 text-center">
            <a
              href={c.siteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 px-6 py-3 text-sm font-bold text-gold-300 transition-all hover:border-gold-400 hover:bg-gold-500/10"
            >
              <Globe size={16} />
              <span dir="ltr">{c.domain}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
