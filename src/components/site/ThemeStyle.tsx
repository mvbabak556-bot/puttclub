import type { ThemeSettings } from "@/lib/site-schema";
import { THEME_PRESETS } from "@/lib/site-schema";

const HEX = /^#[0-9a-fA-F]{6}$/;
const safe = (v: string, fallback: string) => (HEX.test(v?.trim() || "") ? v.trim() : fallback);

/** تزریق متغیرهای رنگی قالب انتخابی مدیر (فقط hex معتبر قبول می‌شود) */
export default function ThemeStyle({ theme }: { theme: ThemeSettings }) {
  const d = THEME_PRESETS.forest.colors;
  const bg = safe(theme.bg, d.bg);
  const surface = safe(theme.surface, d.surface);
  const card = safe(theme.card, d.card);
  const primary = safe(theme.primary, d.primary);
  const light = safe(theme.primaryLight, d.primaryLight);
  const dark = safe(theme.primaryDark, d.primaryDark);
  const text = safe(theme.text, d.text);
  const muted = safe(theme.muted, d.muted);

  const css = `:root{--color-forest-950:${bg};--color-forest-900:${surface};--color-forest-850:${surface};--color-forest-800:${card};--color-forest-700:${card};--color-forest-600:${card};--color-gold-100:${light};--color-gold-200:${light};--color-gold-300:${light};--color-gold-400:${primary};--color-gold-500:${primary};--color-gold-600:${dark};--color-cream:${text};--color-sage:${muted};}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
