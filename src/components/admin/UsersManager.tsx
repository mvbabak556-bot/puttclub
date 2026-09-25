"use client";

import { useEffect, useState } from "react";
import { Crown, Loader2, User } from "lucide-react";
import { adminFetch, isDemoResponse } from "@/lib/admin";
import { faDate, faNum } from "@/lib/format";

interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

const DEMO_USERS: UserRow[] = [
  {
    id: 0,
    name: "مدیر فروشگاه",
    email: "admin@puttclub.ir",
    phone: "09123456780",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: 1,
    name: "عضو نمونه",
    email: "demo@puttclub.ir",
    phone: "09123456789",
    role: "member",
    createdAt: new Date().toISOString(),
  },
];

export default function UsersManager() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await adminFetch("/api/admin/users");
      if (isDemoResponse(res)) {
        setDemo(true);
        setUsers(DEMO_USERS);
        return;
      }
      const data = await res!.json();
      setUsers(data.users ?? []);
    })();
  }, []);

  if (!users) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={30} className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          کاربران <span className="text-base font-bold text-sage">({faNum(users.length)})</span>
        </h1>
        {demo && (
          <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold text-gold-300">
            حالت نمایشی
          </span>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex flex-wrap items-center gap-4 rounded-3xl border border-gold-500/10 bg-forest-900/70 p-5"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-800 text-gold-400">
              {u.role === "admin" ? <Crown size={20} /> : <User size={20} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-black">{u.name}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                    u.role === "admin"
                      ? "bg-gold-500 text-forest-950"
                      : "bg-forest-800 text-sage"
                  }`}
                >
                  {u.role === "admin" ? "مدیر" : "عضو"}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-sage">
                <span dir="ltr">{u.email}</span>
                {u.phone && <span dir="ltr">{u.phone}</span>}
                <span>{faDate(u.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
