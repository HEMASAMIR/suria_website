"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Confirm, Empty, PageHeader, Skeleton, StatCard, useCollection } from "@/components/admin/ui";
import { egp, fmtDate } from "@/lib/format";
import type { Order, PublicCustomer } from "@/lib/types";

export default function CustomersPage() {
  const { items, loading, remove } = useCollection<PublicCustomer>("customers");
  const { items: orders } = useCollection<Order>("orders");
  const [q, setQ] = useState("");
  const [del, setDel] = useState<PublicCustomer | null>(null);

  const stats = useMemo(() => {
    const m = new Map<string, { count: number; spent: number; last?: string }>();
    orders.forEach((o) => {
      if (!o.customerId) return;
      const s = m.get(o.customerId) ?? { count: 0, spent: 0 };
      s.count += 1;
      if (!["cancelled", "returned"].includes(o.status)) s.spent += o.total;
      if (!s.last || o.createdAt > s.last) s.last = o.createdAt;
      m.set(o.customerId, s);
    });
    return m;
  }, [orders]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((c) => !t || c.name.toLowerCase().includes(t) || c.phone.includes(t) || (c.email ?? "").includes(t));
  }, [items, q]);

  const month = new Date().toISOString().slice(0, 7);
  const buyers = items.filter((c) => (stats.get(c.id)?.count ?? 0) > 0).length;

  return (
    <>
      <PageHeader title="العملاء" sub="كل الحسابات المسجّلة في المتجر وطلباتها" />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي العملاء" value={String(items.length)} />
        <StatCard label="سجّلوا الشهر ده" value={String(items.filter((c) => c.createdAt.startsWith(month)).length)} />
        <StatCard label="عملاء اشتروا" value={String(buyers)} />
        <StatCard label="نسبة التحويل" value={`${items.length ? Math.round((buyers / items.length) * 100) : 0}%`} tone="text-primary" />
      </div>
      <div className="mb-4 flex max-w-md items-center gap-2 rounded-full border border-line bg-surface px-4">
        <Search className="size-4 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="الاسم، الموبايل أو البريد" className="flex-1 bg-transparent py-2.5 text-sm outline-none" />
      </div>
      {loading ? (
        <Skeleton rows={5} />
      ) : list.length === 0 ? (
        <Empty text="لسه مفيش عملاء مسجلين" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-line text-right text-xs text-muted">
                {["العميلة", "التواصل", "العنوان", "الطلبات", "إجمالي المشتريات", "تاريخ التسجيل", ""].map((h) => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.map((c, i) => {
                const s = stats.get(c.id);
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }} className="border-b border-line last:border-0 hover:bg-surface-2/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-[#0e2c4e] font-bold text-white">{c.name[0]}</span>
                        <b>{c.name}</b>
                      </div>
                    </td>
                    <td className="px-4 py-3"><p dir="ltr" className="text-right">{c.phone}</p><p className="text-xs text-muted">{c.email}</p></td>
                    <td className="px-4 py-3 text-xs text-muted">{c.address ? `${c.address.governorate} — ${c.address.city}` : "—"}</td>
                    <td className="px-4 py-3"><span className="chip bg-primary-soft text-primary">{s?.count ?? 0}</span></td>
                    <td className="px-4 py-3 font-bold">{egp(s?.spent ?? 0)}</td>
                    <td className="px-4 py-3 text-xs text-muted">{fmtDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <a href={`https://wa.me/2${c.phone}`} target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-full text-[#1da851] hover:bg-emerald-50 dark:hover:bg-emerald-500/10" title="واتساب"><MessageCircle className="size-4" /></a>
                        <button onClick={() => setDel(c)} className="grid size-8 place-items-center rounded-full hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/15" title="حذف"><Trash2 className="size-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Confirm open={!!del} onClose={() => setDel(null)} text={`حذف حساب "${del?.name}"؟ الطلبات القديمة هتفضل موجودة.`} onConfirm={async () => { if (del) { await remove(del.id); toast.success("تم حذف الحساب"); } }} />
    </>
  );
}
