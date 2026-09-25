"use client";

import { withBase } from "@/lib/public";

export interface AdminSession {
  id: number;
  name: string;
  email: string;
}

const KEY = "puttclub_admin";

export const DEMO_ADMIN = {
  email: "admin@puttclub.ir",
  password: "admin1234",
  name: "مدیر فروشگاه",
};

export function getAdmin(): AdminSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

export function setAdmin(a: AdminSession) {
  localStorage.setItem(KEY, JSON.stringify(a));
}

export function clearAdmin() {
  localStorage.removeItem(KEY);
}

/** درخواست به API مدیریتی؛ روی هاست استاتیک null برمی‌گرداند (حالت نمایشی) */
export async function adminFetch(path: string, init?: RequestInit): Promise<Response | null> {
  const admin = getAdmin();
  try {
    const res = await fetch(withBase(path), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(admin ? { "x-admin-email": admin.email } : {}),
        ...(init?.headers || {}),
      },
    });
    if (res.status === 404 || res.status === 405) return null;
    return res;
  } catch {
    return null;
  }
}

export function isDemoResponse(res: Response | null): boolean {
  return res === null;
}

/* ---------- حالت نمایشی (هاست استاتیک): دیتای محلی ---------- */

function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** خواندن اسنپ‌شات استاتیک + ترکیب با تغییرات محلی */
export async function demoTable<T>(name: "products" | "categories" | "reviews"): Promise<T[]> {
  const key = `puttclub_demo_${name}`;
  const local = readLocal<T[]>(key);
  if (local) return local;
  try {
    const res = await fetch(withBase(`/data/${name}.json`));
    if (!res.ok) return [];
    const data = (await res.json()) as T[];
    writeLocal(key, data);
    return data;
  } catch {
    return [];
  }
}

export function saveDemoTable(name: "products" | "categories" | "reviews", rows: unknown[]) {
  writeLocal(`puttclub_demo_${name}`, rows);
}
