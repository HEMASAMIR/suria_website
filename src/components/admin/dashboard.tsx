"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, Banknote, ShoppingCart, TrendingUp, Truck, Wallet, Receipt, PiggyBank } from "lucide-react";
import { PageHeader, StatCard } from "./ui";
import { STATUS, egp, fmtDateTime } from "@/lib/format";
import type { Expense, Order, OrderStatus } from "@/lib/types";

const PERIODS = [
  { d: 7, l: "آخر 7 أيام" },
  { d: 30, l: "آخر 30 يوم" },
  { d: 90, l: "آخر 3 شهور" },
  { d: 0, l: "الكل" },
];
const PIE: Record<OrderStatus, string> = {
  pending: "#f59e0b", confirmed: "#0ea5e9", shipped: "#8b5cf6", delivered: "#10b981", cancelled: "#f43f5e", returned: "#71717a",
};
const DEAD: OrderStatus[] = ["cancelled", "returned"];
const cogs = (o: Order) => o.items.reduce((s, it) => s + it.cost * it.qty, 0);
const sales = (o: Order) => o.subtotal - o.discount;

type Low = { id: string; name: string; image: string; stock: number; model: string };

export function Dashboard({ orders, expenses, lowStock, now }: { orders: Order[]; expenses: Expense[]; lowStock: Low[]; now: number }) {
  const [days, setDays] = useState(30);

  const m = useMemo(() => {
    const since = days ? now - days * 86400000 : 0;
    const inP = orders.filter((o) => new Date(o.createdAt).getTime() >= since);
    const valid = inP.filter((o) => !DEAD.includes(o.status));
    const delivered = inP.filter((o) => o.status === "delivered");
    const exp = expenses.filter((e) => new Date(e.date).getTime() >= since).reduce((s, e) => s + e.amount, 0);
    const sum = (list: Order[], f: (o: Order) => number) => list.reduce((s, o) => s + f(o), 0);

    const revenue = sum(valid, sales);
    const gross = revenue - sum(valid, cogs);
    const realized = sum(delivered, sales) - sum(delivered, cogs);

    const span = days || Math.max(7, Math.ceil((now - Math.min(...orders.map((o) => +new Date(o.createdAt)), now)) / 86400000) + 1);
    const chart = Array.from({ length: Math.min(span, 90) }, (_, i) => {
      const d = new Date(now - (Math.min(span, 90) - 1 - i) * 86400000);
      const key = d.toISOString().slice(0, 10);
      const day = valid.filter((o) => o.createdAt.slice(0, 10) === key);
      return { day: d.toLocaleDateString("ar-EG", { day: "numeric", month: "short" }), "المبيعات": sum(day, sales), "الربح": sum(day, sales) - sum(day, cogs) };
    });

    const pie = (Object.keys(PIE) as OrderStatus[]).map((s) => ({ name: STATUS[s].label, value: inP.filter((o) => o.status === s).length, color: PIE[s] })).filter((x) => x.value);

    const top = new Map<string, { name: string; image: string; qty: number; revenue: number }>();
    valid.forEach((o) => o.items.forEach((it) => {
      const t = top.get(it.productId) ?? { name: it.name, image: it.image, qty: 0, revenue: 0 };
      t.qty += it.qty;
      t.revenue += it.qty * it.price;
      top.set(it.productId, t);
    }));

    return {
      count: inP.length, valid: valid.length, revenue, gross, realized, exp, net: realized - exp, expectedNet: gross - exp,
      shipping: sum(valid, (o) => o.shippingFee), aov: valid.length ? revenue / valid.length : 0,
      pending: inP.filter((o) => o.status === "pending").length,
      chart, pie, top: [...top.values()].sort((a, b) => b.qty - a.qty).slice(0, 5),
    };
  }, [orders, expenses, days, now]);

  return (
    <>
      <PageHeader title="لوحة التحكم والأرباح" sub="ملخص أداء المتجر والمبيعات وصافي الربح">
        <div className="flex rounded-full border border-line bg-surface p-1">
          {PERIODS.map((p) => (
            <button key={p.d} onClick={() => setDays(p.d)} className={`relative rounded-full px-3 py-1.5 text-xs font-bold ${days === p.d ? "text-white" : "text-muted"}`}>
              {days === p.d && <motion.span layoutId="period" className="absolute inset-0 rounded-full bg-primary" />}
              <span className="relative">{p.l}</span>
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="relative mb-6 overflow-hidden rounded-[2rem] bg-welcome p-6 text-white sm:p-8">
        <p className="pointer-events-none absolute -bottom-6 left-4 select-none font-serif text-8xl text-white/10">ZONA</p>
        <div className="relative grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-white/80">صافي الربح المحقق</p>
            <motion.p key={m.net + days} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-4xl font-extrabold">{egp(m.net)}</motion.p>
            <p className="mt-1 text-xs text-white/70">أرباح الطلبات المسلّمة − المصروفات</p>
          </div>
          <div>
            <p className="text-sm text-white/80">صافي الربح المتوقع</p>
            <p className="mt-1 text-3xl font-extrabold">{egp(m.expectedNet)}</p>
            <p className="mt-1 text-xs text-white/70">لو كل الطلبات النشطة اتسلمت</p>
          </div>
          <div>
            <p className="text-sm text-white/80">طلبات محتاجة مراجعة</p>
            <p className="mt-1 text-3xl font-extrabold">{m.pending}</p>
            <Link href="/admin/orders" className="mt-1 inline-block text-xs font-bold underline">راجعيها دلوقتي ←</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Banknote} label="المبيعات (بدون الشحن)" value={egp(m.revenue)} hint={`${m.valid} طلب نشط`} />
        <StatCard icon={TrendingUp} label="إجمالي الربح" value={egp(m.gross)} tone="text-emerald-600 dark:text-emerald-400" hint={`المحقق منه ${egp(m.realized)}`} />
        <StatCard icon={Receipt} label="المصروفات" value={egp(m.exp)} tone="text-rose-600" />
        <StatCard icon={ShoppingCart} label="عدد الطلبات" value={String(m.count)} hint={`متوسط الطلب ${egp(m.aov)}`} />
        <StatCard icon={Truck} label="مصاريف شحن محصّلة" value={egp(m.shipping)} hint="بتتدفع لشركة الشحن" />
        <StatCard icon={PiggyBank} label="هامش الربح" value={`${m.revenue ? Math.round((m.gross / m.revenue) * 100) : 0}%`} />
        <StatCard icon={Wallet} label="إجمالي التحصيل المتوقع" value={egp(m.revenue + m.shipping)} />
        <StatCard icon={AlertTriangle} label="منتجات قربت تخلص" value={String(lowStock.length)} tone={lowStock.length ? "text-amber-600" : ""} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="card p-5">
          <p className="mb-4 font-extrabold">المبيعات والأرباح</p>
          <div className="h-72" dir="ltr">
            <ResponsiveContainer>
              <AreaChart data={m.chart} margin={{ left: 0, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} /><stop offset="100%" stopColor="#0d9488" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} /><stop offset="100%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#64748b22" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} minTickGap={20} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={50} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", fontFamily: "inherit", direction: "rtl" }} formatter={(v) => egp(Number(v))} />
                <Area type="monotone" dataKey="المبيعات" stroke="#0d9488" strokeWidth={2.5} fill="url(#gS)" />
                <Area type="monotone" dataKey="الربح" stroke="#f59e0b" strokeWidth={2.5} fill="url(#gP)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <p className="mb-2 font-extrabold">حالة الطلبات</p>
          {m.pie.length ? (
            <>
              <div className="h-48">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={m.pie} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                      {m.pie.map((p) => <Cell key={p.name} fill={p.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 16, fontFamily: "inherit" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {m.pie.map((p) => <span key={p.name} className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: p.color }} />{p.name} ({p.value})</span>)}
              </div>
            </>
          ) : (
            <p className="py-16 text-center text-sm text-muted">لسه مفيش طلبات في الفترة دي</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5">
          <p className="mb-4 font-extrabold">الأكثر مبيعًا</p>
          {m.top.length ? m.top.map((t, i) => (
            <div key={t.name} className="flex items-center gap-3 border-b border-line py-2.5 last:border-0">
              <span className="w-4 font-serif text-sm font-bold text-primary">{i + 1}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.image} alt="" className="size-10 rounded-xl object-cover" />
              <p className="line-clamp-1 flex-1 text-sm font-bold">{t.name}</p>
              <span className="text-xs text-muted">{t.qty} قطعة</span>
            </div>
          )) : <p className="py-8 text-center text-sm text-muted">لا توجد بيانات</p>}
        </div>
        <div className="card p-5">
          <p className="mb-4 font-extrabold">أحدث الطلبات</p>
          {orders.slice(0, 6).map((o) => (
            <Link href="/admin/orders" key={o.id} className="flex items-center justify-between border-b border-line py-2.5 last:border-0 hover:text-primary">
              <div>
                <p className="text-sm font-bold">{o.customer.name}</p>
                <p className="text-[11px] text-muted">#{o.number} • {fmtDateTime(o.createdAt)}</p>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">{egp(o.total)}</p>
                <span className={`chip px-2 py-0.5 text-[10px] ${STATUS[o.status].tone}`}>{STATUS[o.status].label}</span>
              </div>
            </Link>
          ))}
          {!orders.length && <p className="py-8 text-center text-sm text-muted">لسه مفيش طلبات</p>}
        </div>
        <div className="card p-5">
          <p className="mb-4 flex items-center gap-2 font-extrabold"><AlertTriangle className="size-4 text-amber-500" /> مخزون قليل</p>
          {lowStock.length ? lowStock.slice(0, 6).map((p) => (
            <Link href="/admin/products" key={p.id} className="flex items-center gap-3 border-b border-line py-2.5 last:border-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" className="size-10 rounded-xl object-cover" />
              <p className="line-clamp-1 flex-1 text-sm font-bold">{p.name}</p>
              <span className={`chip ${p.stock ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"}`}>{p.stock}</span>
            </Link>
          )) : <p className="py-8 text-center text-sm text-muted">كل المنتجات متوفرة 👌</p>}
        </div>
      </div>
    </>
  );
}
