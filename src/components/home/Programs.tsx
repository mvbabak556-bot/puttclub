import Link from "next/link";
import { ArrowLeft, Flag, Medal, ShoppingBag, Sparkles, Target, Timer, Trophy } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";

const PROGRAMS = [
  {
    icon: Sparkles,
    title: "آموزش مقدماتی",
    desc: "آشنایی با گریپ، استنس، پات و سوئینگ پایه؛ شروع درست برای کسانی که تازه وارد دنیای گلف شده‌اند.",
  },
  {
    icon: Target,
    title: "کلاس خصوصی",
    desc: "برنامه اختصاصی یک‌به‌یک با مربی؛ تحلیل سوئینگ و رفع ایرادهای تکنیکی در کوتاه‌ترین زمان.",
  },
  {
    icon: Flag,
    title: "گلف نوجوانان",
    desc: "دوره‌های شاد و اصولی برای نسل آینده گلف؛ آموزش پایه همراه با بازی و تمرین گروهی.",
  },
  {
    icon: Timer,
    title: "تمرین در زمین",
    desc: "بازی آموزشی همراه مربی در زمین واقعی؛ مدیریت بازی، انتخاب چوب و استراتژی هر هول.",
  },
  {
    icon: Trophy,
    title: "آمادگی مسابقه",
    desc: "برنامه فشرده برای بازیکنان رقابتی؛ تمرین ذهنی، کنترل فشار و آمادگی تورنمنت.",
  },
  {
    icon: Medal,
    title: "عضویت باشگاه",
    desc: "عضویت در باشگاه پات کلاب با دسترسی به تمرین‌ها، رویدادها و تخفیف فروشگاه تجهیزات.",
  },
];

export default function Programs() {
  return (
    <section id="programs" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-black tracking-[0.25em] text-gold-400">
              <span className="h-px w-10 bg-gold-500/60" />
              دوره‌های آموزشی
            </p>
            <h2 className="mt-4 text-3xl font-black leading-snug sm:text-5xl">
              مسیر رشد شما در <span className="text-gold-grad">آکادمی</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-sage">
              از اولین ضربه تا سکوی قهرمانی؛ برای هر سطح و هر هدف، یک برنامه آموزشی
              مشخص داریم.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/academy"
              className="group inline-flex items-center gap-2 rounded-full border border-gold-500/30 px-5 py-2.5 text-sm font-bold text-gold-300 transition-all hover:border-gold-400 hover:bg-gold-500/10"
            >
              ورود اعضای آکادمی
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <StaggerItem key={p.title}>
              <div className="group h-full rounded-3xl border border-gold-500/10 bg-forest-900 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/30">
                <span className="grid size-13 place-items-center rounded-2xl border border-gold-500/25 bg-forest-800 text-gold-400 transition-all duration-500 group-hover:bg-gold-500 group-hover:text-forest-950">
                  <p.icon size={22} strokeWidth={1.7} />
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
                <span className="block text-base font-black">فروشگاه تجهیزات پات کلاب</span>
                <span className="mt-1 block text-xs text-sage">
                  چوب، توپ، کیف و پوشاک اورجینال با ضمانت اصالت
                </span>
              </span>
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-gold-300">
              ورود به فروشگاه
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
