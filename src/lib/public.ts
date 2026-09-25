import type { SessionUser } from "@/lib/types";

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}

const USERS_KEY = "puttclub_local_users";
const ORDERS_KEY = "puttclub_local_orders";
const REVIEWS_KEY = "puttclub_local_reviews";

export const DEMO_USER = {
  id: 1,
  name: "عضو نمونه",
  email: "demo@puttclub.ir",
  phone: "09123456789",
  password: "demo1234",
};

interface StoredUser extends SessionUser {
  password: string;
}

export interface StoredOrder {
  id: number;
  code: string;
  total: number;
  status: string;
  createdAt: string;
  email: string;
  city: string;
  items: { productId: number; name: string; qty: number; image: string }[];
}

export interface StoredReview {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function users(): StoredUser[] {
  const list = readJson<StoredUser[]>(USERS_KEY, []);
  if (!list.some((u) => u.email === DEMO_USER.email)) {
    list.push({ ...DEMO_USER });
  }
  return list;
}

export function localLogin(email: string, password: string): SessionUser | null {
  const user = users().find((u) => u.email === email.toLowerCase().trim() && u.password === password);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, phone: user.phone };
}

export function localRegister(name: string, email: string, password: string): SessionUser | "exists" {
  const normalized = email.toLowerCase().trim();
  const list = users();
  if (list.some((u) => u.email === normalized)) return "exists";
  const user: StoredUser = {
    id: Date.now(),
    name: name.trim(),
    email: normalized,
    phone: null,
    password,
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([...list, user]));
  return { id: user.id, name: user.name, email: user.email, phone: user.phone };
}

export function saveLocalOrder(order: StoredOrder) {
  const list = readJson<StoredOrder[]>(ORDERS_KEY, []);
  localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...list]));
}

export function localOrders(email: string): StoredOrder[] {
  return readJson<StoredOrder[]>(ORDERS_KEY, []).filter((o) => o.email === email);
}

export function saveLocalReview(review: StoredReview) {
  const list = readJson<StoredReview[]>(REVIEWS_KEY, []);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify([review, ...list]));
}

export function localReviews(productId: number): StoredReview[] {
  return readJson<StoredReview[]>(REVIEWS_KEY, []).filter((r) => r.productId === productId);
}
