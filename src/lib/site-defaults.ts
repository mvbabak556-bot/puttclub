/* داده‌ها و تایپ‌های پیش‌فرض محتوای سایت (پنل /admin/site) */

export interface CourseFooterItem {
  label: string;
  value: string;
}

export interface CourseSocial {
  network: "instagram" | "telegram" | "whatsapp" | "site" | "phone";
  url: string;
  label?: string;
}

export type GalleryMode = "featured" | "slider" | "grid";
export type CourseLayout = "image-top" | "image-right" | "image-left";
export type CourseCardSize = "compact" | "default" | "large";
export type TextSize = "sm" | "md" | "lg" | "xl";
export type BodyAlign = "right" | "center" | "justify";

export interface SiteCourse {
  id: number;
  title: string;
  subtitle: string | null;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  images: string[];
  galleryMode: GalleryMode;
  layout: CourseLayout;
  cardSize: CourseCardSize;
  titleColor: string | null;
  textColor: string | null;
  accentColor: string | null;
  titleSize: TextSize;
  bodySize: TextSize;
  bodyAlign: BodyAlign;
  footerItems: CourseFooterItem[];
  socials: CourseSocial[];
  sortOrder: number;
  isActive: boolean;
}

export interface SiteTestimonial {
  id: number;
  name: string;
  phone?: string;
  role: string | null;
  text: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface MenuItem {
  label: string;
  href: string;
  visible: boolean;
}

export interface SiteSettings {
  brand: {
    faName: string;
    faShort: string;
    enName: string;
    tagline: string;
    logo: string;
    logoHd: string;
  };
  theme: {
    gold500: string;
    gold400: string;
    gold300: string;
    gold600: string;
    forest950: string;
    forest900: string;
    forest800: string;
    cream: string;
    sage: string;
  };
  contact: {
    phone: string;
    phoneFa: string;
    email: string;
    address: string;
    instagram: string;
    instagramUrl: string;
    telegram: string;
    whatsapp: string;
    siteUrl: string;
    domain: string;
    hours: string;
  };
  menu: MenuItem[];
  hero: {
    badge: string;
    line1: string;
    line2: string;
    subtitle: string;
    stats: { value: string; label: string }[];
  };
  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    image: string;
    imageCaption: string;
  };
  coursesSection: { kicker: string; title: string; titleAccent: string; desc: string };
  testimonialsSection: { kicker: string; title: string; titleAccent: string; desc: string };
  footer: { aboutText: string };
  shopGate: {
    enabled: boolean;
    showOnShop: boolean;
    showOnCheckout: boolean;
    title: string;
    message: string;
    backLabel: string;
    code: string;
    overlayOpacity: number;
    overlayBlur: number;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand: {
    faName: "آکادمی گلف پات کلاب",
    faShort: "پات کلاب",
    enName: "Putt Club Golf Academy",
    tagline: "آکادمی گلف",
    logo: "/images/academy-logo.jpg",
    logoHd: "/images/academy-logo-hd.jpg",
  },
  theme: {
    gold500: "#c9a24b",
    gold400: "#d4af6a",
    gold300: "#e3c98f",
    gold600: "#a98335",
    forest950: "#050d09",
    forest900: "#0a1712",
    forest800: "#12271e",
    cream: "#f2ecdd",
    sage: "#93aa9c",
  },
  contact: {
    phone: "09369018285",
    phoneFa: "۰۹۳۶۹۰۱۸۲۸۵",
    email: "info@puttclub.ir",
    address: "اهواز",
    instagram: "Puttclub.Golfacademy",
    instagramUrl: "https://www.instagram.com/Puttclub.Golfacademy",
    telegram: "",
    whatsapp: "",
    siteUrl: "https://puttclub.ir",
    domain: "puttclub.ir",
    hours: "شنبه تا پنجشنبه — ۸ صبح تا ۸ شب",
  },
  menu: [
    { label: "خانه", href: "/", visible: true },
    { label: "آکادمی", href: "/#academy", visible: true },
    { label: "دوره‌ها", href: "/#programs", visible: true },
    { label: "فروشگاه", href: "/shop", visible: true },
    { label: "تماس", href: "/#contact", visible: true },
  ],
  hero: {
    badge: "Putt Club Golf Academy — اهواز",
    line1: "آکادمی گلف",
    line2: "پات کلاب",
    subtitle:
      "از اولین سوئینگ تا آمادگی مسابقه؛ آموزش اصولی گلف با مربیان حرفه‌ای در اهواز، همراه با فروشگاه تخصصی تجهیزات اورجینال.",
    stats: [
      { value: "اهواز", label: "خانه آکادمی" },
      { value: "مبتدی تا حرفه‌ای", label: "سطوح آموزشی" },
      { value: "puttclub.ir", label: "وب‌سایت رسمی" },
    ],
  },
  about: {
    kicker: "آکادمی ما",
    title: "آکادمی گلف پات کلاب",
    paragraphs: [
      "آکادمی گلف پات کلاب در اهواز، خانه‌ای برای شروع و رشد در دنیای گلف است؛ از آشنایی با گریپ و استنس تا سوئینگ حرفه‌ای و آمادگی مسابقه.",
      "در کنار آموزش، فروشگاه تخصصی ما تجهیزات اورجینال را با ضمانت اصالت در اختیار هنرجوها و گلف‌بازان سراسر کشور می‌گذارد.",
    ],
    image: "/images/academy-about.jpg",
    imageCaption: "Putt Club Golf Academy",
  },
  coursesSection: {
    kicker: "دوره‌های آموزشی",
    title: "مسیر رشد شما در",
    titleAccent: "آکادمی",
    desc: "از اولین ضربه تا سکوی قهرمانی؛ برای هر سطح و هر هدف، یک برنامه آموزشی مشخص داریم. برای دیدن جزئیات هر دوره، روی آن بزنید.",
  },
  testimonialsSection: {
    kicker: "نظر اعضا",
    title: "از زبان",
    titleAccent: "گلف‌بازان",
    desc: "تجربه‌تان را با ما به اشتراک بگذارید؛ پس از تأیید مدیر نمایش داده می‌شود.",
  },
  footer: {
    aboutText:
      "آکادمی گلف پات کلاب در اهواز؛ آموزش اصولی گلف از مبتدی تا حرفه‌ای، همراه با فروشگاه تخصصی تجهیزات اورجینال.",
  },
  shopGate: {
    enabled: true,
    showOnShop: true,
    showOnCheckout: true,
    title: "فروشگاه به‌زودی باز می‌شود",
    message:
      "فروشگاه پات‌کلاب در حال آماده‌سازی نهایی است و فعلاً فقط به‌صورت آزمایشی باز است؛ سفارش‌ها در این مرحله نهایی نمی‌شوند. از شکیبایی شما سپاسگزاریم — به‌زودی با فروشگاه کامل در خدمتیم.",
    backLabel: "برگشت به سایت",
    code: "B",
    overlayOpacity: 60,
    overlayBlur: 16,
  },
};

export const COURSE_ICONS = [
  "Sparkles",
  "Target",
  "Flag",
  "Timer",
  "Trophy",
  "Medal",
  "Star",
  "Zap",
  "Heart",
  "Gift",
  "Crown",
  "Shield",
] as const;

export const GALLERY_MODES: { value: GalleryMode; label: string; hint: string }[] = [
  { value: "featured", label: "ویترینی (فروشگاهی)", hint: "عکس بزرگ بالا + بندانگشتی‌های کوچک پایین" },
  { value: "slider", label: "اسلایدر", hint: "یک عکس با دکمه قبلی/بعدی و نقطه‌چین" },
  { value: "grid", label: "شبکه‌ای", hint: "همه عکس‌ها کنار هم در دو ستون" },
];

export const COURSE_LAYOUTS: { value: CourseLayout; label: string }[] = [
  { value: "image-top", label: "عکس بالا، متن پایین" },
  { value: "image-right", label: "عکس راست، متن چپ" },
  { value: "image-left", label: "عکس چپ، متن راست" },
];

export const CARD_SIZES: { value: CourseCardSize; label: string }[] = [
  { value: "compact", label: "جمع‌وجور" },
  { value: "default", label: "استاندارد" },
  { value: "large", label: "بزرگ و کشیده" },
];

export const TEXT_SIZES: { value: TextSize; label: string }[] = [
  { value: "sm", label: "کوچک" },
  { value: "md", label: "متوسط" },
  { value: "lg", label: "بزرگ" },
  { value: "xl", label: "خیلی بزرگ" },
];

export const SOCIAL_NETWORKS: { value: CourseSocial["network"]; label: string }[] = [
  { value: "instagram", label: "اینستاگرام" },
  { value: "telegram", label: "تلگرام" },
  { value: "whatsapp", label: "واتساپ" },
  { value: "site", label: "وب‌سایت" },
  { value: "phone", label: "تلفن" },
];

export const SUGGESTED_COURSE_IMAGES = [
  { label: "عکس آکادمی (پیش‌فرض بخش درباره)", url: "/images/academy-about.jpg" },
  { label: "درایور", url: "/images/products/driver.jpg" },
  { label: "ست آیرون", url: "/images/products/irons.jpg" },
  { label: "پوتر", url: "/images/products/putter.jpg" },
  { label: "کیف تور", url: "/images/products/bag.jpg" },
  { label: "دستکش", url: "/images/products/glove.jpg" },
  { label: "کفش", url: "/images/products/shoes.jpg" },
  { label: "توپ تور", url: "/images/products/balls.jpg" },
  { label: "پولو", url: "/images/products/polo.jpg" },
  { label: "چتر", url: "/images/products/umbrella.jpg" },
  { label: "رنج‌فایندر", url: "/images/products/rangefinder.jpg" },
];
