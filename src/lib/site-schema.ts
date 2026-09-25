import { STOCK } from "@/lib/data";

/* ---------- تایپ‌های بخش‌های سایت ---------- */

export interface BrandSettings {
  faName: string;
  faShort: string;
  enName: string;
  enShort: string;
  loginTitle: string;
  domain: string;
  siteUrl: string;
  email: string;
  phone: string;
  phoneFa: string;
  address: string;
  instagram: string;
  instagramUrl: string;
  logo: string;
  logoHd: string;
  panelUrl: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface NavSettings {
  links: NavLink[];
  academyButton: string;
}

export interface HeroSettings {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  video: string;
  poster: string;
  stats: { value: string; label: string }[];
}

export interface MarqueeSettings {
  items: string[];
}

export interface AboutSettings {
  kicker: string;
  desc: string;
  image: string;
  bgWord: string;
  infoLabels: { location: string; phone: string; email: string; instagram: string };
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface ProgramItem {
  icon: string;
  title: string;
  desc: string;
}

export interface ProgramsSettings {
  kicker: string;
  titleA: string;
  titleB: string;
  desc: string;
  linkLabel: string;
  linkHref: string;
  items: ProgramItem[];
  bannerTitle: string;
  bannerDesc: string;
  bannerLink: string;
}

export interface FeaturedSettings {
  kicker: string;
  titleA: string;
  titleB: string;
  desc: string;
  linkLabel: string;
  count: number;
}

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export interface FeaturesSettings {
  items: FeatureItem[];
}

export interface QuoteSettings {
  image: string;
  imageAlt: string;
  line1: string;
  line1Gold: string;
  line2: string;
  author: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface TestimonialsSettings {
  kicker: string;
  titleA: string;
  titleB: string;
  items: TestimonialItem[];
}

export interface ContactSettings {
  kicker: string;
  titleA: string;
  titleB: string;
  desc: string;
  titles: { phone: string; email: string; address: string; instagram: string };
}

export interface CtaSettings {
  badge: string;
  titleA: string;
  titleB: string;
  desc: string;
  placeholder: string;
  button: string;
  success: string;
}

export interface FooterSettings {
  tagline: string;
  quickTitle: string;
  quickLinks: NavLink[];
  catsTitle: string;
  contactTitle: string;
  copyright: string;
  credit: string;
  adminLink: string;
}

export interface AcademyEntrySettings {
  badge: string;
  title: string;
  waitingTitle: string;
  waitingDesc: string;
  loadingText: string;
  panelButton: string;
  backLabel: string;
  image: string;
}

export interface ThemeSettings {
  preset: string;
  bg: string;
  surface: string;
  card: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  text: string;
  muted: string;
}

export interface LayoutSettings {
  visibility: {
    marquee: boolean;
    about: boolean;
    programs: boolean;
    featured: boolean;
    features: boolean;
    quote: boolean;
    testimonials: boolean;
    contact: boolean;
    cta: boolean;
  };
}

export interface SeoSettings {
  title: string;
  description: string;
  favicon: string;
}

export interface SiteSettings {
  brand: BrandSettings;
  nav: NavSettings;
  hero: HeroSettings;
  marquee: MarqueeSettings;
  about: AboutSettings;
  programs: ProgramsSettings;
  featured: FeaturedSettings;
  features: FeaturesSettings;
  quote: QuoteSettings;
  testimonials: TestimonialsSettings;
  contact: ContactSettings;
  cta: CtaSettings;
  footer: FooterSettings;
  academy: AcademyEntrySettings;
  theme: ThemeSettings;
  layout: LayoutSettings;
  seo: SeoSettings;
}

export type SiteSectionKey = keyof SiteSettings;

/* ---------- مقادیر پیش‌فرض (وضعیت فعلی سایت) ---------- */

export const SITE_DEFAULTS: SiteSettings = {
  brand: {
    faName: "آکادمی گلف پات کلاب",
    faShort: "پات کلاب",
    enName: "Putt Club Golf Academy",
    enShort: "Putt Club",
    loginTitle: "آکادمی گلف",
    domain: "puttclub.ir",
    siteUrl: "https://puttclub.ir",
    email: "info@puttclub.ir",
    phone: "09369018285",
    phoneFa: "۰۹۳۶۹۰۱۸۲۸۵",
    address: "اهواز",
    instagram: "Puttclub.Golfacademy",
    instagramUrl: "https://www.instagram.com/Puttclub.Golfacademy",
    logo: "/images/academy-logo.jpg",
    logoHd: "/images/academy-logo-hd.jpg",
    panelUrl: process.env.NEXT_PUBLIC_ACADEMY_PANEL_URL || "",
  },
  nav: {
    links: [
      { href: "/", label: "خانه" },
      { href: "/#academy", label: "آکادمی" },
      { href: "/#programs", label: "دوره‌ها" },
      { href: "/shop", label: "فروشگاه" },
      { href: "/#contact", label: "تماس" },
    ],
    academyButton: "ورود اعضای آکادمی",
  },
  hero: {
    badge: "Putt Club Golf Academy — اهواز",
    title1: "آکادمی گلف",
    title2: "پات کلاب",
    subtitle:
      "از اولین سوئینگ تا آمادگی مسابقه؛ آموزش اصولی گلف با مربیان حرفه‌ای در اهواز، همراه با فروشگاه تخصصی تجهیزات اورجینال.",
    primaryLabel: "ورود اعضای آکادمی",
    primaryHref: "/academy",
    secondaryLabel: "فروشگاه تجهیزات",
    secondaryHref: "/shop",
    video: "/videos/golf-hero.mp4",
    poster: STOCK.courseDawn,
    stats: [
      { value: "اهواز", label: "خانه آکادمی" },
      { value: "مبتدی تا حرفه‌ای", label: "سطوح آموزشی" },
      { value: "puttclub.ir", label: "وب‌سایت رسمی" },
    ],
  },
  marquee: {
    items: [
      "آکادمی گلف پات کلاب — اهواز",
      "آموزش از مبتدی تا حرفه‌ای",
      "فروشگاه تجهیزات اورجینال",
      "مشاوره تخصصی خرید",
      "ارسال به سراسر کشور",
      "ضمانت اصالت کالا",
    ],
  },
  about: {
    kicker: "آکادمی ما",
    desc: "آکادمی گلف پات کلاب در اهواز، خانه‌ای برای شروع و رشد در دنیای گلف است؛ از آشنایی با گریپ و استنس تا سوئینگ حرفه‌ای و آمادگی مسابقه. در کنار آموزش، فروشگاه تخصصی ما تجهیزات اورجینال را با ضمانت اصالت در اختیار هنرجوها و گلف‌بازان سراسر کشور می‌گذارد.",
    image: "/images/academy-logo-hd.jpg",
    bgWord: "GOLF",
    infoLabels: { location: "موقعیت", phone: "تلفن", email: "ایمیل", instagram: "اینستاگرام" },
    primaryLabel: "ورود اعضای آکادمی",
    primaryHref: "/academy",
    secondaryLabel: "فروشگاه تجهیزات",
    secondaryHref: "/shop",
  },
  programs: {
    kicker: "دوره‌های آموزشی",
    titleA: "مسیر رشد شما در",
    titleB: "آکادمی",
    desc: "از اولین ضربه تا سکوی قهرمانی؛ برای هر سطح و هر هدف، یک برنامه آموزشی مشخص داریم.",
    linkLabel: "ورود اعضای آکادمی",
    linkHref: "/academy",
    items: [
      { icon: "Sparkles", title: "آموزش مقدماتی", desc: "آشنایی با گریپ، استنس، پات و سوئینگ پایه؛ شروع درست برای کسانی که تازه وارد دنیای گلف شده‌اند." },
      { icon: "Target", title: "کلاس خصوصی", desc: "برنامه اختصاصی یک‌به‌یک با مربی؛ تحلیل سوئینگ و رفع ایرادهای تکنیکی در کوتاه‌ترین زمان." },
      { icon: "Flag", title: "گلف نوجوانان", desc: "دوره‌های شاد و اصولی برای نسل آینده گلف؛ آموزش پایه همراه با بازی و تمرین گروهی." },
      { icon: "Timer", title: "تمرین در زمین", desc: "بازی آموزشی همراه مربی در زمین واقعی؛ مدیریت بازی، انتخاب چوب و استراتژی هر هول." },
      { icon: "Trophy", title: "آمادگی مسابقه", desc: "برنامه فشرده برای بازیکنان رقابتی؛ تمرین ذهنی، کنترل فشار و آمادگی تورنمنت." },
      { icon: "Medal", title: "عضویت باشگاه", desc: "عضویت در باشگاه پات کلاب با دسترسی به تمرین‌ها، رویدادها و تخفیف فروشگاه تجهیزات." },
    ],
    bannerTitle: "فروشگاه تجهیزات پات کلاب",
    bannerDesc: "چوب، توپ، کیف و پوشاک اورجینال با ضمانت اصالت",
    bannerLink: "ورود به فروشگاه",
  },
  featured: {
    kicker: "فروشگاه پات کلاب",
    titleA: "از",
    titleB: "فروشگاه",
    desc: "تجهیزات اورجینال با ضمانت اصالت؛ همان چیزی که در آکادمی با آن تمرین می‌کنید، برای خانه شما.",
    linkLabel: "همه محصولات",
    count: 4,
  },
  features: {
    items: [
      { icon: "Truck", title: "ارسال سریع", desc: "بسته‌بندی ایمن و تحویل ۲۴ ساعته در تهران" },
      { icon: "ShieldCheck", title: "ضمانت اصالت", desc: "همه کالاها اورجینال با کد رهگیری برند" },
      { icon: "RefreshCw", title: "۷ روز بازگشت", desc: "بدون قید و شرط، اگر راضی نبودید" },
      { icon: "Headphones", title: "مشاوره تخصصی", desc: "انتخاب چوب بر اساس هندیکپ شما" },
    ],
  },
  quote: {
    image: STOCK.fairway,
    imageAlt: "فرینج گلف در غروب",
    line1: "گلف بازیِ",
    line1Gold: "فرصت‌هاست",
    line2: "هر ضربه، یک شروع تازه است.",
    author: "— تیم پات‌کلاب",
  },
  testimonials: {
    kicker: "نظر اعضا",
    titleA: "از زبان",
    titleB: "گلف‌بازان",
    items: [
      { name: "امیرحسین رضایی", role: "عضو پات‌کلاب — هندیکپ ۴", text: "درایور Pro V1 دقیقاً همان چیزی بود که بازی‌ام کم داشت. مشاوره تیم پات‌کلاب بر اساس شینگل من بی‌نقص بود و ارسال هم فردای همان روز انجام شد.", rating: 5 },
      { name: "سارا محمدی", role: "بازیکن تازه‌کار", text: "برای شروع، ست کامل از پات‌کلاب خریدم. کیف چرمی‌اش آن‌قدر شیک بود که در کلوب‌هاوس همه پرسیدند از کجا گرفته‌ام!", rating: 5 },
      { name: "رضا توکلی", role: "مربی گلف", text: "به شاگردهایم همیشه توپ‌های تور پات‌کلاب را پیشنهاد می‌دهم؛ اسپین روی گرین فوق‌العاده است و قیمت‌ها منصفانه.", rating: 4 },
    ],
  },
  contact: {
    kicker: "تماس با ما",
    titleA: "آکادمی در",
    titleB: "یک قدمی",
    desc: "برای ثبت‌نام در دوره‌ها، رزرو کلاس خصوصی یا مشاوره خرید تجهیزات، با ما در تماس باشید.",
    titles: { phone: "تلفن آکادمی", email: "ایمیل", address: "آدرس", instagram: "اینستاگرام" },
  },
  cta: {
    badge: "۱۰٪ تخفیف اولین خرید اعضا",
    titleA: "به باشگاه",
    titleB: "پات‌کلاب",
    desc: "زودتر از همه از کالکشن‌های جدید، تخفیف‌های اختصاصی و نکات مربیان حرفه‌ای باخبر شوید.",
    placeholder: "ایمیل شما",
    button: "عضویت",
    success: "خوش آمدید! کد تخفیف برایتان ایمیل شد.",
  },
  footer: {
    tagline:
      "آکادمی گلف پات کلاب در اهواز؛ آموزش اصولی گلف از مبتدی تا حرفه‌ای، همراه با فروشگاه تخصصی تجهیزات اورجینال.",
    quickTitle: "دسترسی سریع",
    quickLinks: [
      { href: "/", label: "خانه آکادمی" },
      { href: "/#programs", label: "دوره‌های آموزشی" },
      { href: "/shop", label: "فروشگاه تجهیزات" },
      { href: "/academy", label: "ورود اعضای آکادمی" },
      { href: "/login", label: "ورود اعضای فروشگاه" },
    ],
    catsTitle: "دسته‌بندی فروشگاه",
    contactTitle: "تماس با آکادمی",
    copyright: "© ۱۴۰۴ آکادمی گلف پات کلاب — تمامی حقوق محفوظ است.",
    credit: "برای گلف‌بازان ایران",
    adminLink: "ورود مدیران",
  },
  academy: {
    badge: "Putt Club Golf Academy",
    title: "ورود اعضای آکادمی",
    waitingTitle: "پنل اعضای آکادمی در حال آماده‌سازی است.",
    waitingDesc: "به‌زودی ورود اعضا از همین‌جا انجام می‌شود.",
    loadingText: "در حال انتقال به پنل آکادمی...",
    panelButton: "انتقال به پنل آکادمی",
    backLabel: "بازگشت به خانه آکادمی",
    image: "/images/academy-logo-hd.jpg",
  },
  theme: {
    preset: "forest",
    bg: "#050d09",
    surface: "#0a1712",
    card: "#12271e",
    primary: "#c9a24b",
    primaryLight: "#e3c98f",
    primaryDark: "#a98335",
    text: "#f2ecdd",
    muted: "#93aa9c",
  },
  layout: {
    visibility: {
      marquee: true,
      about: true,
      programs: true,
      featured: true,
      features: true,
      quote: true,
      testimonials: true,
      contact: true,
      cta: true,
    },
  },
  seo: {
    title: "آکادمی گلف پات کلاب | Putt Club Golf Academy",
    description:
      "آکادمی گلف پات کلاب در اهواز؛ آموزش گلف از مبتدی تا حرفه‌ای، ورود اعضای آکادمی و فروشگاه تخصصی تجهیزات اورجینال گلف.",
    favicon: "/favicon.ico",
  },
};

/* ---------- آیکون‌های مجاز برای کارت‌ها ---------- */

export const ICON_OPTIONS = [
  "Sparkles",
  "Target",
  "Flag",
  "Timer",
  "Trophy",
  "Medal",
  "Truck",
  "ShieldCheck",
  "RefreshCw",
  "Headphones",
  "ShoppingBag",
  "Camera",
  "Globe",
  "Mail",
  "MapPin",
  "Phone",
  "Gift",
  "Send",
  "Quote",
  "Star",
  "Heart",
  "Zap",
  "Award",
  "BookOpen",
  "Users",
  "Calendar",
  "MessageCircle",
  "CreditCard",
  "Package",
  "BadgeCheck",
];

/* ---------- قالب‌های رنگی آماده ---------- */

export interface ThemePreset {
  label: string;
  desc: string;
  colors: Omit<ThemeSettings, "preset">;
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  forest: {
    label: "سبز جنگلی",
    desc: "قالب فعلی سایت",
    colors: {
      bg: "#050d09",
      surface: "#0a1712",
      card: "#12271e",
      primary: "#c9a24b",
      primaryLight: "#e3c98f",
      primaryDark: "#a98335",
      text: "#f2ecdd",
      muted: "#93aa9c",
    },
  },
  midnight: {
    label: "سرمه‌ای سلطنتی",
    desc: "پس‌زمینه سرمه‌ای با لهجه طلایی",
    colors: {
      bg: "#060b18",
      surface: "#0b1428",
      card: "#14203c",
      primary: "#d4af6a",
      primaryLight: "#ecdcb2",
      primaryDark: "#9a7c3a",
      text: "#eef1f8",
      muted: "#8e9bb8",
    },
  },
  noir: {
    label: "مشکی مدرن",
    desc: "مشکی خالص با طلایی درخشان",
    colors: {
      bg: "#000000",
      surface: "#0d0d0d",
      card: "#1a1a1a",
      primary: "#d4af37",
      primaryLight: "#f4e5b0",
      primaryDark: "#8a6d1f",
      text: "#f5f5f0",
      muted: "#9a9a92",
    },
  },
  wine: {
    label: "شرابی تیره",
    desc: "ته‌مایه شرابی با طلایی گرم",
    colors: {
      bg: "#120609",
      surface: "#1e0c12",
      card: "#2c1220",
      primary: "#d29a4b",
      primaryLight: "#f0d3a0",
      primaryDark: "#8f6423",
      text: "#f6ece4",
      muted: "#a8939a",
    },
  },
};
