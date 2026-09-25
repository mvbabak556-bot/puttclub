import Image from "next/image";
import Link from "next/link";
import { Camera, Flag, Globe, Mail, MapPin, Phone } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { ACADEMY } from "@/lib/academy";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-gold-500/10 bg-forest-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-gold-500/40 bg-black">
                <Image
                  src={ACADEMY.logo}
                  alt="لوگوی آکادمی گلف پات کلاب"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl italic text-cream">
                  Putt <span className="text-gold-400">Club</span>
                </span>
                <span className="mt-1 block text-xs font-medium text-sage">
                  {ACADEMY.faName}
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-sage">
              {ACADEMY.faName} در {ACADEMY.address}؛ آموزش اصولی گلف از مبتدی تا حرفه‌ای،
              همراه با فروشگاه تخصصی تجهیزات اورجینال.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={ACADEMY.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="اینستاگرام آکادمی"
                className="grid size-10 place-items-center rounded-full border border-forest-600/70 text-cream/70 transition-all hover:border-gold-400 hover:text-gold-300"
              >
                <Camera size={17} strokeWidth={1.7} />
              </a>
              <a
                href={ACADEMY.siteUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="وب‌سایت آکادمی"
                className="grid size-10 place-items-center rounded-full border border-forest-600/70 text-cream/70 transition-all hover:border-gold-400 hover:text-gold-300"
              >
                <Globe size={17} strokeWidth={1.7} />
              </a>
              <a
                href={`mailto:${ACADEMY.email}`}
                aria-label="ایمیل آکادمی"
                className="grid size-10 place-items-center rounded-full border border-forest-600/70 text-cream/70 transition-all hover:border-gold-400 hover:text-gold-300"
              >
                <Mail size={17} strokeWidth={1.7} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-black tracking-wide text-gold-400">دسترسی سریع</h3>
            <ul className="mt-5 space-y-3 text-sm text-sage">
              {[
                { href: "/", label: "خانه آکادمی" },
                { href: "/#programs", label: "دوره‌های آموزشی" },
                { href: "/shop", label: "فروشگاه تجهیزات" },
                { href: "/academy", label: "ورود اعضای آکادمی" },
                { href: "/login", label: "ورود اعضای فروشگاه" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition-colors hover:text-gold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-black tracking-wide text-gold-400">دسته‌بندی فروشگاه</h3>
            <ul className="mt-5 space-y-3 text-sm text-sage">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link
                    href={`/shop?cat=${encodeURIComponent(c)}`}
                    className="transition-colors hover:text-gold-300"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-black tracking-wide text-gold-400">تماس با آکادمی</h3>
            <ul className="mt-5 space-y-4 text-sm text-sage">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-500" />
                {ACADEMY.address}
              </li>
              <li className="flex items-center gap-3" dir="ltr">
                <Phone size={16} className="shrink-0 text-gold-500" />
                <a href={`tel:${ACADEMY.phone}`} className="transition-colors hover:text-gold-300">
                  {ACADEMY.phoneFa}
                </a>
              </li>
              <li className="flex items-center gap-3" dir="ltr">
                <Mail size={16} className="shrink-0 text-gold-500" />
                <a
                  href={`mailto:${ACADEMY.email}`}
                  className="transition-colors hover:text-gold-300"
                >
                  {ACADEMY.email}
                </a>
              </li>
              <li className="flex items-center gap-3" dir="ltr">
                <Globe size={16} className="shrink-0 text-gold-500" />
                <a
                  href={ACADEMY.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-gold-300"
                >
                  {ACADEMY.domain}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-gold-500/10 pt-7 text-xs text-sage sm:flex-row">
          <p>© ۱۴۰۴ {ACADEMY.faName} — تمامی حقوق محفوظ است.</p>
          <p className="flex items-center gap-1.5">
            طراحی‌شده با
            <Flag size={13} className="text-gold-500" />
            برای گلف‌بازان ایران
          </p>
        </div>
      </div>
    </footer>
  );
}
