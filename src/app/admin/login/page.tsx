"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Flag, Globe, Loader2, Lock, ShieldCheck, ShoppingBag, User } from "lucide-react";
import { DEMO_ADMIN, getAdmin, setAdmin } from "@/lib/admin";
import { withBase } from "@/lib/public";

type Panel = "store" | "site";

export default function AdminLoginPage() {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>("store");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dest = panel === "store" ? "/admin" : "/admin/site";

  useEffect(() => {
    if (getAdmin()) router.replace(dest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let res: Response | null = null;
      try {
        res = await fetch(withBase("/api/admin/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identifier, password }),
        });
      } catch {
        res = null;
      }
      // هاست استاتیک — ورود نمایشی محلی
      if (!res || res.status === 404 || res.status === 405) {
        const id = identifier.toLowerCase().trim();
        if (
          (id === DEMO_ADMIN.username || id === DEMO_ADMIN.email) &&
          password === DEMO_ADMIN.password
        ) {
          setAdmin({ id: 0, name: DEMO_ADMIN.name, email: DEMO_ADMIN.email });
          router.push(dest);
          return;
        }
        setError("نام کاربری یا رمز عبور اشتباه است.");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد.");
        return;
      }
      setAdmin(data.user);
      router.push(dest);
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "h-12 w-full rounded-2xl border border-gold-500/15 bg-forest-950/60 ps-11 pe-4 text-sm text-cream outline-none transition-colors placeholder:text-sage/50 focus:border-gold-500/50";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-[2rem] border border-gold-500/15 bg-forest-900/70 p-8 sm:p-10"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-gold-500 text-forest-950">
            <ShieldCheck size={24} />
          </span>
          <div>
            <h1 className="text-xl font-black">ورود مدیران</h1>
            <p className="mt-1 text-xs text-sage">داشبورد مدیریتی پات‌کلاب</p>
          </div>
        </div>

        {/* انتخاب پنل: فروشگاه یا سایت */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {(
            [
              { key: "store", label: "فروشگاه", desc: "سفارش‌ها و محصولات", icon: ShoppingBag },
              { key: "site", label: "سایت", desc: "محتوا، تصاویر و قالب", icon: Globe },
            ] as const
          ).map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPanel(p.key)}
              className={`rounded-2xl border p-4 text-start transition-all ${
                panel === p.key
                  ? "border-gold-500/60 bg-gold-500/10"
                  : "border-gold-500/10 bg-forest-950/40 hover:border-gold-500/30"
              }`}
            >
              <span
                className={`grid size-10 place-items-center rounded-xl ${
                  panel === p.key ? "bg-gold-500 text-forest-950" : "bg-forest-800 text-gold-400"
                }`}
              >
                <p.icon size={19} />
              </span>
              <span className="mt-2.5 block text-sm font-black">{p.label}</span>
              <span className="mt-0.5 block text-[11px] text-sage">{p.desc}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="relative">
            <User size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-sage" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="نام کاربری"
              dir="ltr"
              required
              autoComplete="username"
              className={`${inputCls} text-right`}
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-sage" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
              dir="ltr"
              required
              autoComplete="current-password"
              className={`${inputCls} text-right`}
            />
          </div>
          {error && <p className="text-sm font-bold text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-gold-500 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
          >
            {loading ? <Loader2 size={17} className="animate-spin" /> : <ShieldCheck size={17} />}
            ورود به پنل {panel === "store" ? "فروشگاه" : "سایت"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-sage">
          <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-300">
            <Flag size={12} />
            بازگشت به فروشگاه
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
