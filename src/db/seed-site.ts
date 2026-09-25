import { db } from "./index";
import { siteCourses, siteSettings, siteTestimonials } from "./schema";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-defaults";

const COURSES = [
  {
    title: "آموزش مقدماتی",
    subtitle: "شروع درست از روز اول",
    shortDesc:
      "آشنایی با گریپ، استنس، پات و سوئینگ پایه؛ شروع درست برای کسانی که تازه وارد دنیای گلف شده‌اند.",
    fullDesc:
      "دوره مقدماتی پات کلاب برای کسانی طراحی شده که تا امروز چوب گلف دست نگرفته‌اند. در ۸ جلسه آموزشی با مفاهیم پایه آشنا می‌شوید: گرفتن صحیح چوب (گریپ)، ایستادن درست (استنس)، ضربه کوتاه (پات و چیپ) و سوئینگ پایه با آیرون‌های کوتاه.\n\nهر جلسه ۹۰ دقیقه است و همه تجهیزات لازم (چوب، توپ و دستکش تمرینی) در اختیار شما قرار می‌گیرد؛ بدون نیاز به خرید اولیه. در پایان دوره، هنرجو می‌تواند یک دور ۹ هول تمرینی را با راهنمایی مربی کامل کند.",
    icon: "Sparkles",
    images: ["/images/academy-about.jpg", "/images/products/balls.jpg", "/images/products/glove.jpg"],
    galleryMode: "featured",
    layout: "image-right",
    cardSize: "default",
    titleSize: "md",
    bodySize: "md",
    bodyAlign: "right",
    footerItems: [
      { label: "تعداد جلسات", value: "۸ جلسه ۹۰ دقیقه‌ای" },
      { label: "سطح", value: "صفر تا پایه" },
      { label: "پیش‌نیاز", value: "ندارد — تجهیزات با آکادمی" },
    ],
    socials: [{ network: "instagram", url: "https://www.instagram.com/Puttclub.Golfacademy" }],
    sortOrder: 1,
  },
  {
    title: "کلاس خصوصی",
    subtitle: "یک‌به‌یک با مربی",
    shortDesc:
      "برنامه اختصاصی یک‌به‌یک با مربی؛ تحلیل سوئینگ و رفع ایرادهای تکنیکی در کوتاه‌ترین زمان.",
    fullDesc:
      "در کلاس خصوصی، تمام توجه مربی فقط به شماست. ابتدا سوئینگ شما با فیلم‌برداری فریم‌به‌فریم تحلیل می‌شود و سپس یک برنامه تمرینی کاملاً شخصی بر اساس نقاط قوت و ضعف شما نوشته می‌شود.\n\nاین دوره برای کسانی مناسب است که زمان محدود دارند یا روی یک ایراد خاص (مثل اسلایس، فاصله کوتاه یا پات ناپایدار) می‌خواهند تمرکز کنند. ساعت کلاس‌ها با هماهنگی شما و به‌صورت منعطف برگزار می‌شود.",
    icon: "Target",
    images: ["/images/products/driver.jpg", "/images/products/rangefinder.jpg"],
    galleryMode: "slider",
    layout: "image-left",
    cardSize: "default",
    titleSize: "md",
    bodySize: "md",
    bodyAlign: "right",
    footerItems: [
      { label: "مدت هر جلسه", value: "۶۰ دقیقه" },
      { label: "تحلیل", value: "فیلم فریم‌به‌فریم سوئینگ" },
      { label: "زمان‌بندی", value: "منعطف با هماهنگی" },
    ],
    socials: [],
    sortOrder: 2,
  },
  {
    title: "گلف نوجوانان",
    subtitle: "نسل آینده گلف",
    shortDesc:
      "دوره‌های شاد و اصولی برای نسل آینده گلف؛ آموزش پایه همراه با بازی و تمرین گروهی.",
    fullDesc:
      "باشگاه نوجوانان پات کلاب برای سنین ۷ تا ۱۵ سال طراحی شده است. آموزش در قالب بازی، مسابقه‌های دوستانه و تمرین گروهی انجام می‌شود تا بچه‌ها هم تکنیک یاد بگیرند و هم عاشق گلف شوند.\n\nچوب‌های مخصوص سنین پایین، توپ‌های تمرینی نرم و محیط امن زمین تمرینی، تجربه‌ای شاد و بدون استرس می‌سازد. والدین می‌توانند از جایگاه تماشا، پیشرفت فرزندشان را دنبال کنند.",
    icon: "Flag",
    images: ["/images/products/balls.jpg", "/images/academy-about.jpg", "/images/products/glove.jpg"],
    galleryMode: "grid",
    layout: "image-top",
    cardSize: "default",
    titleSize: "md",
    bodySize: "md",
    bodyAlign: "right",
    footerItems: [
      { label: "رده سنی", value: "۷ تا ۱۵ سال" },
      { label: "شیوه", value: "گروهی + بازی" },
      { label: "تجهیزات", value: "مخصوص سنین پایین با آکادمی" },
    ],
    socials: [],
    sortOrder: 3,
  },
  {
    title: "تمرین در زمین",
    subtitle: "بازی واقعی با مربی",
    shortDesc:
      "بازی آموزشی همراه مربی در زمین واقعی؛ مدیریت بازی، انتخاب چوب و استراتژی هر هول.",
    fullDesc:
      "فرق تمرین در رنج با بازی در زمین، مثل فرق کلاس زبان با سفر خارجی است! در این دوره همراه مربی وارد زمین واقعی می‌شوید و روی مهارت‌هایی کار می‌کنید که فقط در بازی واقعی یاد گرفته می‌شوند: مدیریت بازی، انتخاب هوشمندانه چوب، خواندن شیب گرین و تصمیم‌گیری زیر فشار.\n\nهر جلسه شامل بازی ۹ هول همراه با مربی است و بعد از بازی، نکات کلیدی هر هول با شما مرور می‌شود.",
    icon: "Timer",
    images: ["/images/products/bag.jpg", "/images/products/umbrella.jpg"],
    galleryMode: "featured",
    layout: "image-right",
    cardSize: "default",
    titleSize: "md",
    bodySize: "md",
    bodyAlign: "right",
    footerItems: [
      { label: "فرمت", value: "۹ هول با مربی" },
      { label: "سطح", value: "متوسط به بالا" },
      { label: "همراه", value: "تحلیل هول‌به‌هول پس از بازی" },
    ],
    socials: [],
    sortOrder: 4,
  },
  {
    title: "آمادگی مسابقه",
    subtitle: "برای سکوی قهرمانی",
    shortDesc:
      "برنامه فشرده برای بازیکنان رقابتی؛ تمرین ذهنی، کنترل فشار و آمادگی تورنمنت.",
    fullDesc:
      "اگر قرار است در مسابقات استانی یا کشوری شرکت کنید، این دوره برای شماست. برنامه فشرده ۶ هفته‌ای شامل تمرین تکنیکی روزانه، شبیه‌سازی شرایط مسابقه، تمرین ذهنی و مدیریت استرس روز تورنمنت است.\n\nمربیان ما سابقه همراهی بازیکنان در مسابقات رسمی را دارند و در روز مسابقه هم کنار شما خواهند بود. ظرفیت هر دوره محدود به ۶ بازیکن است.",
    icon: "Trophy",
    images: ["/images/products/irons.jpg", "/images/products/putter.jpg", "/images/products/shoes.jpg"],
    galleryMode: "slider",
    layout: "image-left",
    cardSize: "large",
    titleSize: "lg",
    bodySize: "md",
    bodyAlign: "right",
    footerItems: [
      { label: "مدت دوره", value: "۶ هفته فشرده" },
      { label: "ظرفیت", value: "فقط ۶ بازیکن" },
      { label: "همراهی", value: "حضور مربی در روز مسابقه" },
    ],
    socials: [],
    sortOrder: 5,
  },
  {
    title: "عضویت باشگاه",
    subtitle: "خانواده پات کلاب",
    shortDesc:
      "عضویت در باشگاه پات کلاب با دسترسی به تمرین‌ها، رویدادها و تخفیف فروشگاه تجهیزات.",
    fullDesc:
      "با عضویت در باشگاه پات کلاب، بخشی از یک خانواده گلفی می‌شوید: دسترسی نامحدود به زمین تمرینی در ساعات باشگاه، شرکت در تورنمنت‌های داخلی ماهانه، تخفیف ویژه فروشگاه تجهیزات و دعوت به رویدادها و دورهمی‌های باشگاه.\n\nعضویت در سه طرح ماهانه، فصلی و سالانه ارائه می‌شود و برای هنرجویان دوره‌های آموزشی، ماه اول با تخفیف ویژه محاسبه می‌شود.",
    icon: "Medal",
    images: ["/images/products/polo.jpg", "/images/products/shoes.jpg"],
    galleryMode: "grid",
    layout: "image-top",
    cardSize: "default",
    titleSize: "md",
    bodySize: "md",
    bodyAlign: "right",
    footerItems: [
      { label: "طرح‌ها", value: "ماهانه / فصلی / سالانه" },
      { label: "مزایا", value: "تورنمنت داخلی + تخفیف فروشگاه" },
      { label: "هنرجویان", value: "ماه اول با تخفیف ویژه" },
    ],
    socials: [],
    sortOrder: 6,
  },
] as const;

const TESTIMONIALS = [
  { name: "امیرحسین رضایی", phone: "09120000001", role: "عضو پات‌کلاب — هندیکپ ۴", text: "درایور Pro V1 دقیقاً همان چیزی بود که بازی‌ام کم داشت. مشاوره تیم پات‌کلاب بی‌نقص بود و ارسال هم فردای همان روز انجام شد.", rating: 5, status: "approved" },
  { name: "سارا محمدی", phone: "09120000002", role: "بازیکن تازه‌کار", text: "برای شروع، ست کامل از پات‌کلاب خریدم. کیف چرمی‌اش آن‌قدر شیک بود که در کلوب‌هاوس همه پرسیدند از کجا گرفته‌ام!", rating: 5, status: "approved" },
  { name: "رضا توکلی", phone: "09120000003", role: "مربی گلف", text: "به شاگردهایم همیشه توپ‌های تور پات‌کلاب را پیشنهاد می‌دهم؛ اسپین روی گرین فوق‌العاده است و قیمت‌ها منصفانه.", rating: 4, status: "approved" },
  { name: "مریم کریمی", phone: "09120000004", role: "هنرجو دوره مقدماتی", text: "از صفر شروع کردم و بعد از دو ماه اولین ۹ هولم را کامل کردم. مربی‌ها صبور و حرفه‌ای‌اند.", rating: 5, status: "approved" },
  { name: "علی نادری", phone: "09120000005", role: "بازیکن باشگاه", text: "زمین تمرینی همیشه مرتب است و تورنمنت‌های ماهانه انگیزه تمرین را چند برابر می‌کند.", rating: 5, status: "approved" },
  { name: "نگار احمدی", phone: "09120000006", role: "والد هنرجو", text: "پسرم عاشق کلاس‌های نوجوانان شده؛ هم بازی می‌کند هم تکنیک یاد می‌گیرد. ممنون از تیم خوبتان.", rating: 5, status: "approved" },
  { name: "حسین مرادی", phone: "09120000007", role: "بازیکن مسابقه‌ای", text: "دوره آمادگی مسابقه واقعاً فرق داشت؛ مدیریت فشار روز تورنمنت را همان‌جا یاد گرفتم.", rating: 5, status: "approved" },
  { name: "فاطمه صادقی", phone: "09120000008", role: "هنرجو کلاس خصوصی", text: "اسلایس ده‌ساله‌ام در سه جلسه خصوصی درست شد. تحلیل فریم‌به‌فریم سوئینگ عالی بود.", rating: 5, status: "approved" },
  { name: "کیانوش فرهادی", phone: "09120000009", role: "عضو باشگاه", text: "تخفیف فروشگاه برای اعضا واقعاً به‌صرفه است؛ ست کاملم را با مشاوره خودشان جمع کردم.", rating: 4, status: "approved" },
  { name: "زهرا موسوی", phone: "09120000010", role: "هنرجو", text: "کلاس‌ها سر وقت و منظم برگزار می‌شود و برخورد پرسنل خیلی گرم و محترمانه است.", rating: 5, status: "pending" },
] as const;

export async function seedSiteContent() {
  await db.insert(siteCourses).values(
    COURSES.map((c) => ({
      ...c,
      subtitle: c.subtitle,
      images: [...c.images],
      footerItems: [...c.footerItems],
      socials: c.socials.map((s) => ({ ...s })) as { network: "instagram"; url: string }[],
    }))
  );
  await db.insert(siteTestimonials).values(TESTIMONIALS.map((t) => ({ ...t })));
  const entries = Object.entries(DEFAULT_SITE_SETTINGS) as [string, unknown][];
  await db.insert(siteSettings).values(entries.map(([key, value]) => ({ key, value })));
  console.log("[puttclub] site content seeded (courses, testimonials, settings)");
}
