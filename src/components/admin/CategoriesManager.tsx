"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { adminFetch, demoTable, isDemoResponse, saveDemoTable } from "@/lib/admin";
import { faNum } from "@/lib/format";

interface CatRow {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  productCount?: number;
}

export default function CategoriesManager() {
  const [cats, setCats] = useState<CatRow[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [editing, setEditing] = useState<CatRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const res = await adminFetch("/api/admin/categories");
    if (isDemoResponse(res)) {
      setDemo(true);
      const rows = await demoTable<CatRow>("categories");
      const prods = await demoTable<{ category: string }>("products");
      setCats(
        rows.map((c) => ({
          ...c,
          productCount: prods.filter((p) => p.category === c.name).length,
        }))
      );
      return;
    }
    const data = await res!.json();
    setCats(data.categories ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("نام دسته را وارد کنید.");
    setBusy(true);
    if (demo) {
      const rows = [...(cats ?? [])];
      if (rows.some((c) => c.name === name.trim())) {
        setError("این دسته قبلاً وجود دارد.");
        setBusy(false);
        return;
      }
      rows.push({ id: Date.now(), name: name.trim(), description: desc.trim() || null, image: null, productCount: 0 });
      saveDemoTable("categories", rows);
      setCats(rows);
      setName("");
      setDesc("");
      setBusy(false);
      return;
    }
    const res = await adminFetch("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name: name.trim(), description: desc.trim() }),
    });
    if (res && res.ok) {
      const data = await res.json();
      setCats((prev) => [...(prev ?? []), { ...data.category, productCount: 0 }]);
      setName("");
      setDesc("");
    } else {
      const data = res ? await res.json().catch(() => ({})) : {};
      setError(data.error || "افزودن دسته ناموفق بود.");
    }
    setBusy(false);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setError("");
    if (editName.trim().length < 2) return setError("نام جدید معتبر نیست.");
    setBusy(true);
    if (demo) {
      const rows = (cats ?? []).map((c) =>
        c.id === editing.id ? { ...c, name: editName.trim(), description: editDesc.trim() || null } : c
      );
      saveDemoTable("categories", rows);
      const prods = await demoTable<{ id: number; category: string }>("products");
      saveDemoTable(
        "products",
        prods.map((p) => (p.category === editing.name ? { ...p, category: editName.trim() } : p))
      );
      setCats(rows.map((c) => ({ ...c, productCount: c.productCount ?? 0 })));
      setEditing(null);
      setBusy(false);
      return;
    }
    const res = await adminFetch(`/api/admin/categories/${encodeURIComponent(editing.name)}`, {
      method: "PUT",
      body: JSON.stringify({ name: editName.trim(), description: editDesc.trim() }),
    });
    if (res && res.ok) {
      load();
      setEditing(null);
    } else {
      setError("ذخیره ناموفق بود.");
    }
    setBusy(false);
  };

  const remove = async (c: CatRow) => {
    if ((c.productCount ?? 0) > 0) {
      setError(`«${c.name}» دارای ${faNum(c.productCount ?? 0)} محصول است؛ اول آن‌ها را جابه‌جا کنید.`);
      return;
    }
    if (!confirm(`دسته «${c.name}» حذف شود؟`)) return;
    setBusy(true);
    if (demo) {
      const rows = (cats ?? []).filter((x) => x.id !== c.id);
      saveDemoTable("categories", rows);
      setCats(rows);
      setBusy(false);
      return;
    }
    const res = await adminFetch(`/api/admin/categories/${encodeURIComponent(c.name)}`, { method: "DELETE" });
    if (res && res.ok) {
      setCats((prev) => prev?.filter((x) => x.id !== c.id) ?? null);
    } else {
      const data = res ? await res.json().catch(() => ({})) : {};
      setError(data.error || "حذف ناموفق بود.");
    }
    setBusy(false);
  };

  if (!cats) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={30} className="animate-spin text-gold-400" />
      </div>
    );
  }

  const inputCls =
    "h-12 w-full rounded-2xl border border-gold-500/15 bg-forest-950/60 px-4 text-sm outline-none placeholder:text-sage/50 focus:border-gold-500/50";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          دسته‌بندی‌ها <span className="text-base font-bold text-sage">({faNum(cats.length)})</span>
        </h1>
        {demo && (
          <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
            حالت نمایشی
          </span>
        )}
      </div>

      <form
        onSubmit={add}
        className="mt-6 grid gap-3 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-5 sm:grid-cols-[1fr_1fr_auto]"
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="نام دسته جدید..." className={inputCls} />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="توضیح (اختیاری)..." className={inputCls} />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-2xl bg-gold-500 px-6 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
        >
          <Plus size={16} />
          افزودن
        </button>
      </form>
      {error && <p className="mt-3 text-sm font-bold text-red-400">{error}</p>}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {cats.map((c) => (
          <div key={c.id} className="rounded-3xl border border-gold-500/10 bg-forest-900/70 p-5">
            {editing?.id === c.id ? (
              <div className="space-y-3">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={inputCls}
                  placeholder="نام جدید"
                />
                <input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className={inputCls}
                  placeholder="توضیح"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    disabled={busy}
                    className="flex-1 rounded-full bg-gold-500 py-2.5 text-sm font-black text-forest-950 disabled:opacity-60"
                  >
                    ذخیره
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="flex-1 rounded-full border border-forest-600 py-2.5 text-sm font-bold text-sage"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-800 text-gold-400">
                  <FolderOpen size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black">{c.name}</div>
                  <div className="mt-1 text-[11px] text-sage">
                    {faNum(c.productCount ?? 0)} محصول
                    {c.description ? ` • ${c.description}` : ""}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditing(c);
                    setEditName(c.name);
                    setEditDesc(c.description ?? "");
                    setError("");
                  }}
                  aria-label="ویرایش"
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:border-gold-500/50 hover:text-gold-300"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove(c)}
                  aria-label="حذف"
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:border-red-500/50 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
