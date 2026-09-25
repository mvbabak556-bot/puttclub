"use client";

import { ACADEMY } from "@/lib/academy";

/**
 * نقطه وصل پنل مستقل آکادمی (قرارداد ایجنت دوم).
 * - هدر/فوتر سایت می‌ماند (SiteShell فقط /admin را لخت می‌کند)
 * - ظرف #academy-root خالی می‌ماند تا پنل مستقل به آن وصل شود
 * - اگر NEXT_PUBLIC_ACADEMY_PANEL_URL پر باشد، همان پنل داخل iframe نمایش داده می‌شود
 * - هیچ فرم ورود/ثبت‌نامی برای پنل مستقل اینجا نیست
 */
export default function AcademyEntryPage() {
  const panelUrl = ACADEMY.panelUrl;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:px-8">
      <p className="text-center text-xs font-black tracking-[0.25em] text-gold-400">
        ورود اعضای آکادمی
      </p>
      <div id="academy-root" className="mt-6 flex-1">
        {panelUrl ? (
          <iframe
            src={panelUrl}
            title="پنل اعضای آکادمی"
            className="h-[75vh] w-full rounded-3xl border border-gold-500/15 bg-forest-900"
            allow="fullscreen"
          />
        ) : null}
      </div>
      {!panelUrl && (
        <p className="mt-6 text-center text-xs text-sage">پنل اعضا به‌زودی از همین‌جا وصل می‌شود.</p>
      )}
    </div>
  );
}
