"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Crown, Gem, MapPin, MessageCircle, Search, Share2, ShoppingBag, Sparkles, Trash2, TrendingUp, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Confirm, EmptyState, PageHeader, Skeleton, StatCard, useCollection } from "@/components/admin/ui";
import { egp, fmtDate } from "@/lib/format";
import type { Order, PublicCustomer } from "@/lib/types";

type Stat = { count: number; spent: number; last?: string };

function tier(spent: number) {
  if (spent >= 3000) return { label: "VIP", icon: Crown, cls: "bg-gradient-to-l from-[#f59e0b] to-[#fcd34d] text-[#0e2c4e]" };
  if (spent >= 1000) return { label: "مميزة", icon: Gem, cls: "bg-gradient-to-l from-[#0f766e] to-[#14b8a6] text-white" };
  if (spent > 0) return { label: "مشترية", icon: ShoppingBag, cls: "bg-primary-soft text-primary" };
  return { label: "جديدة", icon: Sparkles, cls: "bg-surface-2 text-muted" };
}

const MEDALS = [
  { ring: "from-[#fcd34d] to-[#f59e0b]", h: "sm:h-56", label: "🥇", order: "sm:order-2" },
  { ring: "from-[#e2e8f0] to-[#94a3b8]", h: "sm:h-48", label: "🥈", order: "sm:order-1" },
  { ring: "from-[#fdba74] to-[#c2410c]", h: "sm:h-44", label: "🥉", order: "sm:order-3" },
];

export default function CustomersPage() {
  const { items, loading, remove } = useCollection<PublicCustomer>("customers");
  const { items: orders } = useCollection<Order>("orders");
  const [q, setQ] = useState("");
  const [del, setDel] = useState<PublicCustomer | null>(null);

  const stats = useMemo(() => {
    const m = new Map<string, Stat>();
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

  const st = (id: string): Stat => stats.get(id) ?? { count: 0, spent: 0 };
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items
      .filter((c) => !t || c.name.toLowerCase().includes(t) || c.phone.includes(t) || (c.email ?? "").includes(t))
      .sort((a, b) => (stats.get(b.id)?.spent ?? 0) - (stats.get(a.id)?.spent ?? 0));
  }, [items, q, stats]);
  const top = list.filter((c) => st(c.id).spent > 0).slice(0, 3);

  const month = new Date().toISOString().slice(0, 7);
  const buyers = items.filter((c) => st(c.id).count > 0).length;
  const revenue = items.reduce((s, c) => s + st(c.id).spent, 0);

  const registerUrl = () => `${window.location.origin}/register`;
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(registerUrl());
      toast.success("تم نسخ لينك التسجيل 🔗", { description: "ابعتيه لعميلاتك أو حطيه في البايو" });
    } catch {
      toast(registerUrl());
    }
  };
  const shareWa = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(`اعملي حسابك على ZONA وتابعي طلباتك وخدي العروض قبل أي حد 💗\n${registerUrl()}`)}`, "_blank", "noopener");

  return (
    <>
      <PageHeader title="العملاء" sub="كل الحسابات المسجّلة في المتجر وطلباتها">
        <button onClick={copyLink} className="btn-ghost py-2.5"><Copy className="size-4" /> لينك التسجيل</button>
        <button onClick={shareWa} className="btn bg-[#25D366] py-2.5 text-white shadow-lg shadow-[#25D366]/25 hover:-translate-y-0.5"><Share2 className="size-4" /> شاركي على واتساب</button>
      </PageHeader>

      <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="إجمالي العملاء" value={String(items.length)} hint="حسابات مسجلة" />
        <StatCard icon={UserPlus} label="سجّلوا الشهر ده" value={String(items.filter((c) => c.createdAt.startsWith(month)).length)} hint="عميلات جدد" />
        <StatCard icon={ShoppingBag} label="عملاء اشتروا" value={String(buyers)} hint={`مبيعات الأعضاء ${egp(revenue)}`} />
        <StatCard icon={TrendingUp} label="نسبة التحويل" value={`${items.length ? Math.round((buyers / items.length) * 100) : 0}%`} tone="text-primary" hint="من التسجيل للشراء" />
      </div>

      {loading ? (
        <Skeleton rows={5} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Users}
          title="لسه مفيش عميلات مسجلين"
          text="أول ما أي عميلة تعمل حساب من صفحة التسجيل هتظهر هنا، بعدد طلباتها وإجمالي مشترياتها. شاركي لينك التسجيل عشان تبدئي تبني قاعدة عملائك 💗"
          action={
            <>
              <button onClick={copyLink} className="btn-primary"><Copy className="size-4" /> انسخي لينك التسجيل</button>
              <button onClick={shareWa} className="btn bg-[#25D366] text-white shadow-lg shadow-[#25D366]/25 hover:-translate-y-0.5"><MessageCircle className="size-4" /> ابعتيه على واتساب</button>
            </>
          }
        />
      ) : (
        <>
          {top.length > 0 && (
            <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-welcome p-6 text-white shadow-[0_30px_60px_-30px_rgba(14,44,78,.6)] sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,.12)_50%,transparent_65%)] bg-[length:250%_100%] animate-shimmer" />
              <div className="relative mb-6 flex items-center gap-2">
                <Crown className="size-5 text-[#fbbf24]" />
                <h2 className="text-lg font-extrabold">أفضل عميلاتك</h2>
                <span className="text-xs text-white/60">— حسب إجمالي المشتريات</span>
              </div>
              <div className="relative grid items-end gap-4 sm:grid-cols-3">
                {top.map((c, i) => {
                  const m = MEDALS[i];
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 * i, type: "spring", stiffness: 120 }}
                      className={`${m.order} flex flex-col items-center justify-end rounded-[1.75rem] bg-white/[.08] p-5 text-center ring-1 ring-white/15 backdrop-blur ${m.h}`}
                    >
                      <span className="text-2xl">{m.label}</span>
                      <span className={`mt-2 grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br ${m.ring} p-[3px]`}>
                        <span className="grid size-full place-items-center rounded-full bg-[#0e2c4e] text-xl font-extrabold">{c.name[0]}</span>
                      </span>
                      <p className="mt-3 font-extrabold">{c.name}</p>
                      <p className="text-gold-shimmer text-lg font-extrabold">{egp(st(c.id).spent)}</p>
                      <p className="text-xs text-white/60">{st(c.id).count} طلب</p>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          <div className="mb-5 flex items-center gap-2 rounded-[1.5rem] border border-line bg-surface/80 p-2.5 backdrop-blur">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-surface-2 px-4">
              <Search className="size-4 text-primary" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="الاسم، الموبايل أو البريد" className="flex-1 bg-transparent py-2.5 text-sm outline-none" />
            </div>
            <span className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-extrabold text-primary">{list.length} عميلة</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((c, i) => {
                const s = st(c.id);
                const t = tier(s.spent);
                return (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: Math.min(i * 0.05, 0.5) }}
                    className="glow-border group relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-5 shadow-[0_20px_50px_-35px_rgba(14,44,78,.5)] transition duration-500 hover:-translate-y-1.5"
                  >
                    <span className="pointer-events-none absolute -left-10 -top-10 size-32 rounded-full bg-primary/5 transition duration-500 group-hover:scale-150" />
                    <div className="relative flex items-center gap-3">
                      <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[#0e2c4e] text-xl font-extrabold text-white shadow-lg shadow-primary/25 transition group-hover:-rotate-6">{c.name[0]}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold">{c.name}</p>
                        <p dir="ltr" className="text-right text-xs text-muted">{c.phone}</p>
                      </div>
                      <span className={`chip gap-1 ${t.cls}`}><t.icon className="size-3.5" /> {t.label}</span>
                    </div>
                    <div className="relative mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl bg-surface-2 p-3">
                        <p className="text-[11px] text-muted">الطلبات</p>
                        <p className="text-lg font-extrabold">{s.count}</p>
                      </div>
                      <div className="rounded-2xl bg-surface-2 p-3">
                        <p className="text-[11px] text-muted">إجمالي المشتريات</p>
                        <p className="text-lg font-extrabold text-primary">{egp(s.spent)}</p>
                      </div>
                    </div>
                    <div className="relative mt-3 space-y-1 text-xs text-muted">
                      {c.address && <p className="flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" /> {c.address.governorate} — {c.address.city}</p>}
                      <p>عضوة من {fmtDate(c.createdAt)}{s.last && ` • آخر طلب ${fmtDate(s.last)}`}</p>
                    </div>
                    <div className="relative mt-4 flex gap-2 border-t border-line pt-4">
                      <a href={`https://wa.me/2${c.phone}?text=${encodeURIComponent(`أهلاً ${c.name} 💗 معاكي ZONA`)}`} target="_blank" rel="noreferrer" className="btn flex-1 bg-[#25D366]/10 py-2 text-xs text-[#1da851] hover:bg-[#25D366] hover:text-white">
                        <MessageCircle className="size-4" /> واتساب
                      </a>
                      <button onClick={() => setDel(c)} className="grid size-9 place-items-center rounded-xl border border-line transition hover:border-rose-500 hover:bg-rose-500 hover:text-white" title="حذف"><Trash2 className="size-4" /></button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {list.length === 0 && <EmptyState title="مفيش نتايج مطابقة" text="جربي اسم أو رقم تاني" />}
        </>
      )}

      <Confirm open={!!del} onClose={() => setDel(null)} text={`حذف حساب "${del?.name}"؟ الطلبات القديمة هتفضل موجودة.`} onConfirm={async () => { if (del) { await remove(del.id); toast.success("تم حذف الحساب"); } }} />
    </>
  );
}
