import {
  DEFAULT_SITE_SETTINGS,
  type CourseSocial,
  type SiteCourse,
  type SiteSettings,
} from "@/lib/site-defaults";

/** خواندن یک فیلد با هر دو قرارداد camelCase و snake_case (اسنپ‌شات قدیمی) */
function pick(row: Record<string, unknown>, camel: string, snake: string): unknown {
  const v = row[camel];
  return v !== undefined ? v : row[snake];
}

/** تبدیل کلیدهای snake_case یک ردیف دوره به camelCase (بدون تغییر بقیه) */
export function camelCourseRow(r: Record<string, unknown>): Record<string, unknown> {
  return {
    ...r,
    shortDesc: pick(r, "shortDesc", "short_desc"),
    fullDesc: pick(r, "fullDesc", "full_desc"),
    galleryMode: pick(r, "galleryMode", "gallery_mode"),
    cardSize: pick(r, "cardSize", "card_size"),
    titleColor: pick(r, "titleColor", "title_color"),
    textColor: pick(r, "textColor", "text_color"),
    accentColor: pick(r, "accentColor", "accent_color"),
    titleSize: pick(r, "titleSize", "title_size"),
    bodySize: pick(r, "bodySize", "body_size"),
    bodyAlign: pick(r, "bodyAlign", "body_align"),
    footerItems: pick(r, "footerItems", "footer_items"),
    sortOrder: pick(r, "sortOrder", "sort_order"),
    isActive: pick(r, "isActive", "is_active"),
  };
}

/** نرمال‌سازی کامل لیست دوره‌ها — هر ورودی خرابی را به شکل سالم برمی‌گرداند */
export function normalizeSiteCourses(rows: unknown): SiteCourse[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((r): r is Record<string, unknown> => !!r && typeof r === "object")
    .map((raw, i) => {
      const r = camelCourseRow(raw);
      return {
        id: typeof r.id === "number" ? r.id : 1000 + i,
        title: typeof r.title === "string" && r.title ? r.title : "دوره آموزشی",
        subtitle: typeof r.subtitle === "string" ? r.subtitle : null,
        shortDesc: typeof r.shortDesc === "string" ? r.shortDesc : "",
        fullDesc: typeof r.fullDesc === "string" ? r.fullDesc : "",
        icon: typeof r.icon === "string" && r.icon ? r.icon : "Sparkles",
        images: Array.isArray(r.images)
          ? r.images.filter((x): x is string => typeof x === "string")
          : [],
        galleryMode: r.galleryMode === "slider" || r.galleryMode === "grid" ? r.galleryMode : "featured",
        layout: r.layout === "image-top" || r.layout === "image-left" ? r.layout : "image-right",
        cardSize: r.cardSize === "compact" || r.cardSize === "large" ? r.cardSize : "default",
        titleColor: typeof r.titleColor === "string" && r.titleColor ? r.titleColor : null,
        textColor: typeof r.textColor === "string" && r.textColor ? r.textColor : null,
        accentColor: typeof r.accentColor === "string" && r.accentColor ? r.accentColor : null,
        titleSize: r.titleSize === "sm" || r.titleSize === "lg" || r.titleSize === "xl" ? r.titleSize : "md",
        bodySize: r.bodySize === "sm" || r.bodySize === "lg" || r.bodySize === "xl" ? r.bodySize : "md",
        bodyAlign: r.bodyAlign === "center" || r.bodyAlign === "justify" ? r.bodyAlign : "right",
        footerItems: Array.isArray(r.footerItems)
          ? r.footerItems.filter(
              (f): f is { label: string; value: string } =>
                !!f &&
                typeof f === "object" &&
                typeof (f as { label?: unknown }).label === "string"
            )
          : [],
        socials: Array.isArray(r.socials)
          ? r.socials.filter(
              (s): s is CourseSocial =>
                !!s && typeof s === "object" && typeof (s as { url?: unknown }).url === "string"
            )
          : [],
        sortOrder: typeof r.sortOrder === "number" ? r.sortOrder : i + 1,
        isActive: r.isActive !== false,
      };
    });
}

/** ترکیب عمیق تنظیمات ذخیره‌شده با پیش‌فرض‌ها — هیچ بخشی ناقص نمی‌ماند */
export function mergeSiteSettings(obj: Record<string, unknown>): SiteSettings {
  const out = { ...DEFAULT_SITE_SETTINGS } as unknown as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    const d = (DEFAULT_SITE_SETTINGS as unknown as Record<string, unknown>)[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      d &&
      typeof d === "object" &&
      !Array.isArray(d)
    ) {
      out[key] = { ...(d as object), ...(value as object) };
    } else if (value !== undefined) {
      out[key] = value;
    }
  }
  return out as unknown as SiteSettings;
}
