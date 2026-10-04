"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCheck, Hash, Loader2, PackageSearch, Phone, Truck } from "lucide-react";
import { OrderTimeline } from "@/components/order-timeline";
import { egp, fmtDate } from "@/lib/format";
import type { Order } from "@/lib/types";

type Result = Pick<Order, "number" | "status" | "history" | "total" | "createdAt"> & { items: { name: string; qty: number; image: string }[] };

const STEPS = [
  { icon: Hash, t: "رقم الطلب", d: "بيوصلك في صفحة التأكيد بعد الطلب" },
  { icon: ClipboardCheck, t: "تأكيد سريع", d: "بنكلمك نأكد الطلب خلال ساعات" },
  { icon: Truck, t: "متابعة لحظة بلحظة", d: "من التجهيز لحد ما يوصل بابك" },
];

export default function TrackPage() {
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState("");

  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch(`/api/orders?number=${encodeURIComponent(number)}&phone=${encodeURIComponent(phone)}`);
    const d = await r.json();
    setBusy(false);
    if (!r.ok) {
      setRes(null);
      return setErr(d.error);
    }
    setRes(d);
  };

  return (
    <div className="soft-wash relative overflow-hidden">
    <div className="grid-lines pointer-events-none absolute inset-0" />
    <div className="pointer-events-none absolute -right-24 top-10 size-80 rounded-full bg-primary/15 blur-[100px]" />
    <div className="pointer-events-none absolute -left-24 bottom-10 size-80 rounded-full bg-gold/15 blur-[100px]" />
    <div className="container-z relative max-w-3xl py-16 sm:py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <span className="relative mx-auto grid size-24 animate-float place-items-center rounded-[2rem] bg-gradient-to-br from-primary to-[#0e2c4e] text-white shadow-2xl shadow-primary/30">
          <span className="absolute inset-0 animate-ping rounded-[2rem] bg-primary/20 [animation-duration:2.5s]" />
          <PackageSearch className="relative size-10" />
        </span>
        <span className="mt-6 block font-serif text-sm italic tracking-[.3em] text-primary">ORDER TRACKING</span>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">تتبعي <span className="text-gradient animate-shimmer">طلبك</span></h1>
        <p className="mt-3 text-muted">اكتبي رقم الطلب ورقم الموبايل اللي طلبتي بيه، وهتعرفي طلبك فين بالظبط</p>
      </motion.div>
      <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} onSubmit={go} className="card mt-10 grid gap-3 p-4 shadow-[0_20px_50px_-20px_rgba(14,44,78,.25)] sm:grid-cols-[1fr_1fr_auto] sm:p-5">
        <label className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2 px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
          <Hash className="size-4 text-primary" />
          <input required value={number} onChange={(e) => setNumber(e.target.value)} placeholder="رقم الطلب (مثال ZN10001)" className="w-full bg-transparent py-3.5 text-sm uppercase outline-none" />
        </label>
        <label className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2 px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
          <Phone className="size-4 text-primary" />
          <input required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" className="w-full bg-transparent py-3.5 text-right text-sm outline-none" />
        </label>
        <button disabled={busy} className="btn-primary px-8">{busy ? <Loader2 className="size-4 animate-spin" /> : <><PackageSearch className="size-4" /> تتبع</>}</button>
      </motion.form>
      {!res && !err && (
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {STEPS.map((s, k) => (
            <motion.div key={s.t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + k * 0.1 }} className="card group p-5 text-center transition duration-500 hover:-translate-y-1 hover:border-primary/40">
              <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-white"><s.icon className="size-5" /></span>
              <p className="mt-3 text-sm font-bold">{s.t}</p>
              <p className="mt-1 text-xs text-muted">{s.d}</p>
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence mode="wait">
        {err && <motion.p key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 text-center font-bold text-rose-500">{err}</motion.p>}
        {res && (
          <motion.div key={res.number} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card mt-8 p-6 sm:p-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
              <p className="font-serif text-xl font-bold text-primary">#{res.number}</p>
              <p className="text-sm text-muted">{fmtDate(res.createdAt)} • {egp(res.total)}</p>
            </div>
            <OrderTimeline status={res.status} history={res.history} />
            <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
              {res.items.map((it, i) => (
                <div key={i} className="flex items-center gap-2 rounded-2xl bg-surface-2 p-2 pl-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt="" className="size-10 rounded-xl object-cover" />
                  <span className="text-xs font-bold">{it.name} × {it.qty}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
