"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { adminFetch, demoTable, isDemoResponse, saveDemoTable } from "@/lib/admin";
import { faNum, faPrice } from "@/lib/format";

interface ProductRow {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number | null;
  shortDesc: string;
  description: string;
  features: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  badge: string | null;
  isNew: boolean;
  isFeatured: boolean;
}

const EMPTY = {
  slug: "",
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  shortDesc: "",
  description: "",
  features: "",
  images: "",
  stock: "10",
  badge: "",
  isNew: false,
  isFeatured: false,
};

type FormState = typeof EMPTY;

export default function ProductsManager() {
  const [products, setProducts] = useState<ProductRow[] | null>(null);
  const [cats, setCats] = useState<string[]>([]);
  const [demo, setDemo] = useState(false);
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    const [pRes, cRes] = await Promise.all([
      adminFetch("/api/admin/products"),
      adminFetch("/api/admin/categories"),
    ]);
    if (isDemoResponse(pRes)) {
      setDemo(true);
      const rows = await demoTable<ProductRow>("products");
      setProducts(rows);
      const dcats = await demoTable<{ name: string }>("categories");
      setCats(dcats.map((c) => c.name));
      return;
    }
    const pData = await pRes!.json();
    setProducts(pData.products ?? []);
    if (cRes && cRes.ok) {
      const cData = await cRes.json();
      setCats((cData.categories ?? []).map((c: { name: string }) => c.name));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, category: cats[0] ?? "" });
    setError("");
    setFormOpen(true);
  };

  const openEdit = (p: ProductRow) => {
    setEditing(p);
    setForm({
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      shortDesc: p.shortDesc ?? "",
      description: p.description ?? "",
      features: (p.features ?? []).join("\n"),
      images: (p.images ?? []).join("\n"),
      stock: String(p.stock),
      badge: p.badge ?? "",
      isNew: p.isNew,
      isFeatured: p.isFeatured,
    });
    setError("");
    setFormOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("نام محصول را وارد کنید.");
    if (form.slug.trim().length < 2) return setError("اسلاگ (نام انگلیسی یکتا) را وارد کنید.");
    if (!form.category) return setError("دسته‌بندی را انتخاب کنید.");
    if (!Number(form.price) || Number(form.price) <= 0) return setError("قیمت معتبر نیست.");
    setSaving(true);

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      shortDesc: form.shortDesc.trim(),
      description: form.description.trim(),
      features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock || 0),
      badge: form.badge.trim() || null,
      isNew: form.isNew,
      isFeatured: form.isFeatured,
    };

    if (demo) {
      const rows = [...(products ?? [])];
      if (editing) {
        const i = rows.findIndex((r) => r.id === editing.id);
        if (i >= 0) rows[i] = { ...rows[i], ...payload };
      } else {
        const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
        rows.unshift({ ...payload, id, rating: 4.5, reviewCount: 0 } as ProductRow);
      }
      saveDemoTable("products", rows);
      setProducts(rows);
      setFormOpen(false);
      setSaving(false);
      return;
    }

    const res = await adminFetch(
      editing ? `/api/admin/products/${editing.id}` : "/api/admin/products",
      { method: editing ? "PUT" : "POST", body: JSON.stringify(payload) }
    );
    if (!res) {
      setError("ارتباط با سرور برقرار نشد.");
      setSaving(false);
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "ذخیره ناموفق بود.");
      setSaving(false);
      return;
    }
    if (editing) {
      setProducts((prev) => prev?.map((p) => (p.id === editing.id ? data.product : p)) ?? null);
    } else {
      setProducts((prev) => [data.product, ...(prev ?? [])]);
    }
    setFormOpen(false);
    setSaving(false);
  };

  const remove = async (id: number) => {
    if (!confirm("این محصول حذف شود؟ دیدگاه‌های آن هم پاک می‌شوند.")) return;
    setDeleting(id);
    if (demo) {
      const rows = (products ?? []).filter((p) => p.id !== id);
      saveDemoTable("products", rows);
      setProducts(rows);
      setDeleting(null);
      return;
    }
    const res = await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res && res.ok) setProducts((prev) => prev?.filter((p) => p.id !== id) ?? null);
    setDeleting(null);
  };

  if (!products) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={30} className="animate-spin text-gold-400" />
      </div>
    );
  }

  const filtered = products.filter(
    (p) => q.trim() === "" || p.name.includes(q.trim()) || p.category.includes(q.trim())
  );

  const inputCls =
    "h-11 w-full rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 text-sm outline-none placeholder:text-sage/50 focus:border-gold-500/50";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          محصولات <span className="text-base font-bold text-sage">({faNum(products.length)})</span>
        </h1>
        <div className="flex items-center gap-2">
          {demo && (
            <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
              حالت نمایشی
            </span>
          )}
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400"
          >
            <Plus size={16} />
            افزودن محصول
          </button>
        </div>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-sage" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجوی محصول..."
          className="h-12 w-full rounded-2xl border border-gold-500/15 bg-forest-900/70 ps-11 pe-4 text-sm outline-none placeholder:text-sage/50 focus:border-gold-500/50"
        />
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-4"
          >
            <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-gold-500/10">
              <Image src={p.images?.[0] || "/images/products/driver.jpg"} alt={p.name} fill sizes="64px" className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-black">{p.name}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-sage">
                <span>{p.category}</span>
                <span>•</span>
                <span>{faPrice(p.price)}</span>
                <span>•</span>
                <span className={p.stock <= 4 ? "font-bold text-red-300" : ""}>
                  موجودی: {faNum(p.stock)}
                </span>
                {p.isFeatured && <span className="text-gold-300">• منتخب</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEdit(p)}
                aria-label="ویرایش"
                className="grid size-10 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:border-gold-500/50 hover:text-gold-300"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => remove(p.id)}
                aria-label="حذف"
                disabled={deleting === p.id}
                className="grid size-10 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:border-red-500/50 hover:text-red-300 disabled:opacity-50"
              >
                {deleting === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFormOpen(false)}
              className="absolute inset-0 bg-forest-950/75 backdrop-blur-sm"
            />
            <motion.form
              onSubmit={save}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] border border-gold-500/20 bg-forest-900 p-6 sm:rounded-[2rem] sm:p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black">{editing ? "ویرایش محصول" : "افزودن محصول"}</h2>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  aria-label="بستن"
                  className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sage">نام محصول *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="درایور حرفه‌ای..." />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sage">اسلاگ (انگلیسی، یکتا) *</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} dir="ltr" placeholder="pro-v1-driver" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sage">دسته‌بندی *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    <option value="">انتخاب...</option>
                    {cats.map((c) => (
                      <option key={c} value={c} className="bg-forest-900">{c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-sage">قیمت (تومان) *</label>
                    <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} dir="ltr" inputMode="numeric" placeholder="58000000" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-sage">قیمت قبل</label>
                    <input value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} className={inputCls} dir="ltr" inputMode="numeric" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sage">موجودی</label>
                  <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputCls} dir="ltr" inputMode="numeric" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sage">نشان (مثل پرفروش)</label>
                  <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={inputCls} placeholder="اختیاری" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-sage">معرفی کوتاه</label>
                  <textarea value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} rows={2} className="w-full resize-none rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-sm leading-7 outline-none focus:border-gold-500/50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-sage">توضیح کامل</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full resize-none rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-sm leading-7 outline-none focus:border-gold-500/50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-sage">ویژگی‌ها (هر خط یکی)</label>
                  <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={3} className="w-full resize-none rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-sm leading-7 outline-none focus:border-gold-500/50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-sage">آدرس تصاویر (هر خط یکی)</label>
                  <textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={2} dir="ltr" className="w-full resize-none rounded-xl border border-gold-500/15 bg-forest-950/60 px-4 py-3 text-left text-xs leading-6 outline-none focus:border-gold-500/50" placeholder="/images/products/....jpg" />
                </div>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
                  <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="size-4 accent-[#c9a24b]" />
                  محصول جدید
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="size-4 accent-[#c9a24b]" />
                  نمایش در منتخب صفحه اصلی
                </label>
              </div>

              {error && <p className="mt-4 text-sm font-bold text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-3.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editing ? "ذخیره تغییرات" : "افزودن محصول"}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
