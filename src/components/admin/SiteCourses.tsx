"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { adminFetch, demoTable, isDemoResponse, saveDemoTable } from "@/lib/admin";
import type { SiteCourse } from "@/lib/site-defaults";
import { faNum } from "@/lib/format";
import SiteCourseForm, { EMPTY_COURSE, courseToPayload, type CoursePayload } from "@/components/admin/SiteCourseForm";

export default function SiteCourses() {
  const [courses, setCourses] = useState<SiteCourse[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SiteCourse | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    const res = await adminFetch("/api/admin/site/courses");
    if (isDemoResponse(res)) {
      setDemo(true);
      try {
        const localPending = localStorage.getItem("puttclub_demo_site-courses");
        if (localPending) {
          setCourses(JSON.parse(localPending));
          return;
        }
      } catch {
        /* noop */
      }
      const rows = await demoTable<SiteCourse>("site-courses");
      setCourses(rows.sort((a, b) => a.sortOrder - b.sortOrder));
      return;
    }
    const data = await res!.json();
    setCourses(data.courses ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (p: CoursePayload) => {
    setError("");
    if (p.title.trim().length < 2) return setError("عنوان دوره را وارد کنید.");
    if (p.shortDesc.trim().length < 5) return setError("معرفی کوتاه را وارد کنید.");
    setSaving(true);
    const payload = {
      ...p,
      title: p.title.trim(),
      subtitle: p.subtitle.trim() || null,
      shortDesc: p.shortDesc.trim(),
      fullDesc: p.fullDesc.trim(),
      titleColor: p.titleColor || null,
      textColor: p.textColor || null,
      accentColor: p.accentColor || null,
      footerItems: p.footerItems.filter((f) => f.label.trim() && f.value.trim()),
      socials: p.socials.filter((s) => s.url.trim()),
    };
    if (demo) {
      const rows = [...(courses ?? [])];
      if (editing) {
        const i = rows.findIndex((r) => r.id === editing.id);
        if (i >= 0) rows[i] = { ...rows[i], ...payload } as SiteCourse;
      } else {
        const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
        rows.push({ ...payload, id } as SiteCourse);
      }
      rows.sort((a, b) => a.sortOrder - b.sortOrder);
      saveDemoTable("site-courses", rows);
      setCourses(rows);
      setFormOpen(false);
      setSaving(false);
      return;
    }
    const res = await adminFetch(
      editing ? `/api/admin/site/courses/${editing.id}` : "/api/admin/site/courses",
      { method: editing ? "PUT" : "POST", body: JSON.stringify(payload) }
    );
    if (!res || !res.ok) {
      setError("ذخیره ناموفق بود.");
      setSaving(false);
      return;
    }
    const data = await res.json();
    if (editing) {
      setCourses((prev) => prev?.map((c) => (c.id === editing.id ? data.course : c)) ?? null);
    } else {
      setCourses((prev) => [...(prev ?? []), data.course].sort((a, b) => a.sortOrder - b.sortOrder));
    }
    setFormOpen(false);
    setSaving(false);
  };

  const remove = async (id: number) => {
    if (!confirm("این دوره حذف شود؟")) return;
    setBusyId(id);
    if (demo) {
      const rows = (courses ?? []).filter((c) => c.id !== id);
      saveDemoTable("site-courses", rows);
      setCourses(rows);
      setBusyId(null);
      return;
    }
    const res = await adminFetch(`/api/admin/site/courses/${id}`, { method: "DELETE" });
    if (res && res.ok) setCourses((prev) => prev?.filter((c) => c.id !== id) ?? null);
    setBusyId(null);
  };

  const toggleActive = async (c: SiteCourse) => {
    setBusyId(c.id);
    if (demo) {
      const rows = (courses ?? []).map((x) => (x.id === c.id ? { ...x, isActive: !x.isActive } : x));
      saveDemoTable("site-courses", rows);
      setCourses(rows);
      setBusyId(null);
      return;
    }
    const res = await adminFetch(`/api/admin/site/courses/${c.id}`, {
      method: "PUT",
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    if (res && res.ok) {
      const data = await res.json();
      setCourses((prev) => prev?.map((x) => (x.id === c.id ? data.course : x)) ?? null);
    }
    setBusyId(null);
  };

  const move = async (index: number, dir: -1 | 1) => {
    const rows = [...(courses ?? [])];
    const j = index + dir;
    if (j < 0 || j >= rows.length) return;
    [rows[index], rows[j]] = [rows[j], rows[index]];
    rows.forEach((r, i) => (r.sortOrder = i + 1));
    setCourses([...rows]);
    if (demo) {
      saveDemoTable("site-courses", rows);
      return;
    }
    await Promise.all(
      [rows[index], rows[j]].map((r) =>
        adminFetch(`/api/admin/site/courses/${r.id}`, {
          method: "PUT",
          body: JSON.stringify({ sortOrder: r.sortOrder }),
        })
      )
    );
  };

  if (!courses) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={30} className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">
            دوره‌های آموزشی <span className="text-base font-bold text-sage">({faNum(courses.length)})</span>
          </h1>
          <p className="mt-1.5 text-xs leading-6 text-sage">
            ترتیب کارت‌ها، متن، عکس‌ها، حالت گالری، رنگ‌ها و آیتم‌های پاورقی هر دوره از اینجا مدیریت می‌شود.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {demo && (
            <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
              حالت نمایشی
            </span>
          )}
          <button
            onClick={() => {
              setEditing(null);
              setError("");
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-black text-forest-950 transition-colors hover:bg-gold-400"
          >
            <Plus size={16} />
            افزودن دوره
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {courses.map((c, i) => (
          <div
            key={c.id}
            className={`flex flex-wrap items-center gap-3 rounded-3xl border p-4 transition-opacity ${
              c.isActive ? "border-gold-500/10 bg-forest-900/70" : "border-forest-700 bg-forest-900/40 opacity-60"
            }`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-800 text-sm font-black text-gold-300">
              {faNum(i + 1)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-black">{c.title}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-sage">
                <span>{c.images.length} عکس</span>
                <span>•</span>
                <span>{c.galleryMode === "featured" ? "ویترینی" : c.galleryMode === "slider" ? "اسلایدر" : "شبکه‌ای"}</span>
                <span>•</span>
                <span>{c.footerItems.length} آیتم پاورقی</span>
                {!c.isActive && <span className="text-red-300">• مخفی</span>}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="بالا" className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:text-gold-300 disabled:opacity-30">
                <ArrowUp size={15} />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === courses.length - 1} aria-label="پایین" className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:text-gold-300 disabled:opacity-30">
                <ArrowDown size={15} />
              </button>
              <button onClick={() => toggleActive(c)} aria-label="نمایش/مخفی" disabled={busyId === c.id} className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:border-gold-500/50 hover:text-gold-300 disabled:opacity-50">
                {c.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button onClick={() => { setEditing(c); setError(""); setFormOpen(true); }} aria-label="ویرایش" className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:border-gold-500/50 hover:text-gold-300">
                <Pencil size={15} />
              </button>
              <button onClick={() => remove(c.id)} aria-label="حذف" disabled={busyId === c.id} className="grid size-9 place-items-center rounded-full border border-forest-600 text-sage transition-colors hover:border-red-500/50 hover:text-red-300 disabled:opacity-50">
                {busyId === c.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {formOpen && (
          <SiteCourseForm
            initial={editing ? courseToPayload(editing) : { ...EMPTY_COURSE, sortOrder: courses.length + 1 }}
            saving={saving}
            error={error}
            onClose={() => setFormOpen(false)}
            onSubmit={submit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
