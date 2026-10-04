"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, MessageCircle, Phone, Printer, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Confirm, Empty, Modal, PageHeader, Skeleton, useCollection } from "@/components/admin/ui";
import { PAYMENT, STATUS, egp, fmtDateTime } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const ALL: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];
const profitOf = (o: Order) => o.items.reduce((s, it) => s + (it.price - it.cost) * it.qty, 0) - o.discount;
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const waPhone = (p: string) => `2${p.replace(/^\+?2?/, "")}`;

export default function OrdersPage() {
  const { items, loading, save, remove } = useCollection<Order>("orders");
  const [tab, setTab] = useState<OrderStatus | "">("");
  const [q, setQ] = useState("");
  const [view, setView] = useState<Order | null>(null);
  const [del, setDel] = useState<Order | null>(null);

  const counts = useMemo(() => Object.fromEntries(ALL.map((s) => [s, items.filter((o) => o.status === s).length])), [items]);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((o) => (!tab || o.status === tab) && (!t || o.number.toLowerCase().includes(t) || o.customer.name.toLowerCase().includes(t) || o.customer.phone.includes(t)));
  }, [items, tab, q]);

  const setStatus = async (o: Order, status: OrderStatus) => {
    try {
      const saved = await save({ status } as Partial<Order>, o.id);
      if (view?.id === o.id) setView(saved);
      toast.success(`الطلب ${o.number}: ${STATUS[status].label}`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <>
      <PageHeader title="الطلبات" sub="تابعي كل طلب من المراجعة لحد التسليم" />
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
        {[{ k: "" as const, l: "الكل", n: items.length }, ...ALL.map((s) => ({ k: s, l: STATUS[s].label, n: counts[s] }))].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${tab === t.k ? "text-white" : "bg-surface text-muted hover:text-primary"}`}>
            {tab === t.k && <motion.span layoutId="order-tab" className="absolute inset-0 rounded-full bg-primary" />}
            <span className="relative">{t.l} <span className="opacity-70">({t.n})</span></span>
          </button>
        ))}
      </div>
      <div className="mb-4 flex max-w-md items-center gap-2 rounded-full border border-line bg-surface px-4">
        <Search className="size-4 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="رقم الطلب، اسم العميلة أو الموبايل" className="flex-1 bg-transparent py-2.5 text-sm outline-none" />
      </div>

      {loading ? (
        <Skeleton rows={6} />
      ) : list.length === 0 ? (
        <Empty text="لا توجد طلبات هنا" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-line text-right text-xs text-muted">
                {["الطلب", "العميلة", "المحافظة", "القطع", "الإجمالي", "الربح", "الدفع", "الحالة", ""].map((h) => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }} className="border-b border-line last:border-0 hover:bg-surface-2/60">
                  <td className="px-4 py-3"><b className="font-serif text-primary">#{o.number}</b><p className="text-xs text-muted">{fmtDateTime(o.createdAt)}</p></td>
                  <td className="px-4 py-3"><b>{o.customer.name}</b><p className="text-xs text-muted" dir="ltr">{o.customer.phone}</p></td>
                  <td className="px-4 py-3">{o.customer.governorate}</td>
                  <td className="px-4 py-3">{o.items.reduce((s, x) => s + x.qty, 0)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-bold">{egp(o.total)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">{egp(profitOf(o))}</td>
                  <td className="px-4 py-3 text-xs">{PAYMENT[o.paymentMethod]}</td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={(e) => setStatus(o, e.target.value as OrderStatus)} className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-bold outline-none ${STATUS[o.status].tone}`}>
                      {ALL.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setView(o)} className="grid size-8 place-items-center rounded-full hover:bg-primary-soft hover:text-primary" title="التفاصيل"><Eye className="size-4" /></button>
                      <button onClick={() => setDel(o)} className="grid size-8 place-items-center rounded-full hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/15" title="حذف"><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal wide open={!!view} onClose={() => setView(null)} title={`طلب #${view?.number ?? ""}`}>
        {view && <OrderDetails o={view} onStatus={(s) => setStatus(view, s)} />}
      </Modal>
      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        text={`حذف الطلب #${del?.number}؟ لو الطلب مش ملغي هترجع كمياته للمخزون.`}
        onConfirm={async () => { if (del) { await remove(del.id); toast.success("تم حذف الطلب"); } }}
      />
    </>
  );
}

function OrderDetails({ o, onStatus }: { o: Order; onStatus: (s: OrderStatus) => void }) {
  const profit = profitOf(o);
  const print = () => {
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    const rows = o.items.map((it) => `<tr><td>${esc(it.name)} <small>#${esc(it.model)}</small><br/><small>${esc([it.color, it.size].filter(Boolean).join(" • "))}</small></td><td>${it.qty}</td><td>${it.price}</td><td>${it.price * it.qty}</td></tr>`).join("");
    w.document.write(`<html dir="rtl"><head><title>فاتورة ${esc(o.number)}</title><style>body{font-family:Tahoma,sans-serif;padding:32px;color:#0f172a}h1{font-family:Georgia,serif;letter-spacing:.2em;margin:0}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border-bottom:1px solid #eee;padding:10px;text-align:right}th{background:#e3f5f3}.t{font-size:18px;font-weight:bold;color:#0d9488}.box{display:flex;justify-content:space-between;margin-top:20px}</style></head><body>
    <div class="box"><h1>ZONA</h1><div>فاتورة رقم <b>${esc(o.number)}</b><br/>${new Date(o.createdAt).toLocaleString("ar-EG")}</div></div>
    <div class="box"><div><b>${esc(o.customer.name)}</b><br/>${esc(o.customer.phone)}${o.customer.phone2 ? " / " + esc(o.customer.phone2) : ""}<br/>${esc(o.customer.governorate)} - ${esc(o.customer.city)}<br/>${esc(o.customer.address)}</div><div>طريقة الدفع: ${PAYMENT[o.paymentMethod]}</div></div>
    <table><tr><th>المنتج</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>${rows}</table>
    <p>المنتجات: ${o.subtotal} ج.م<br/>${o.discount ? `الخصم: -${o.discount} ج.م<br/>` : ""}الشحن: ${o.shippingFee} ج.م</p><p class="t">المطلوب تحصيله: ${o.paymentMethod === "cod" ? o.total : 0} ج.م</p>
    ${o.customer.notes ? `<p>ملاحظات: ${esc(o.customer.notes)}</p>` : ""}<script>window.print()</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <div className="space-y-3">
          {o.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt="" className="h-16 w-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-bold">{it.name} <span className="font-serif text-xs text-muted">#{it.model}</span></p>
                <p className="text-xs text-muted">{[it.color, it.size].filter(Boolean).join(" • ")}</p>
              </div>
              <div className="text-left text-sm">
                <p className="font-bold">{it.qty} × {egp(it.price)}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">ربح {egp((it.price - it.cost) * it.qty)}</p>
              </div>
            </div>
          ))}
        </div>
        <dl className="card space-y-2 p-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted">المنتجات</dt><dd>{egp(o.subtotal)}</dd></div>
          {o.discount > 0 && <div className="flex justify-between"><dt className="text-muted">الخصم {o.couponCode && `(${o.couponCode})`}</dt><dd>- {egp(o.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">الشحن</dt><dd>{egp(o.shippingFee)}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-extrabold"><dt>الإجمالي</dt><dd className="text-primary">{egp(o.total)}</dd></div>
          <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400"><dt>صافي ربح الطلب</dt><dd>{egp(profit)}</dd></div>
        </dl>
        <div>
          <p className="label">سجل الحالة</p>
          <ol className="space-y-2 border-r-2 border-primary/30 pr-4">
            {o.history.map((h, i) => (
              <li key={i} className="relative text-sm">
                <span className="absolute -right-[23px] top-1.5 size-3 rounded-full bg-primary ring-4 ring-bg" />
                <b>{STATUS[h.status].label}</b> <span className="text-xs text-muted">— {fmtDateTime(h.at)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="space-y-4">
        <div className="card space-y-1.5 p-4 text-sm">
          <p className="text-lg font-extrabold">{o.customer.name}</p>
          <p dir="ltr" className="text-right">{o.customer.phone}{o.customer.phone2 && ` / ${o.customer.phone2}`}</p>
          <p className="text-muted">{o.customer.governorate} — {o.customer.city}</p>
          <p className="text-muted">{o.customer.address}</p>
          {o.customer.notes && <p className="rounded-xl bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">{o.customer.notes}</p>}
          <p className="pt-2 text-xs">الدفع: <b>{PAYMENT[o.paymentMethod]}</b></p>
          <div className="flex gap-2 pt-2">
            <a href={`tel:${o.customer.phone}`} className="btn-ghost flex-1 px-3 py-2 text-xs"><Phone className="size-3.5" /> اتصال</a>
            <a href={`https://wa.me/${waPhone(o.customer.phone)}?text=${encodeURIComponent(`أهلاً ${o.customer.name} 💗 بخصوص طلبك رقم ${o.number} من ZONA`)}`} target="_blank" rel="noreferrer" className="btn flex-1 bg-[#25D366] px-3 py-2 text-xs text-white"><MessageCircle className="size-3.5" /> واتساب</a>
          </div>
        </div>
        <div>
          <p className="label">تغيير الحالة</p>
          <div className="grid grid-cols-2 gap-2">
            {ALL.map((s) => (
              <button key={s} disabled={o.status === s} onClick={() => onStatus(s)} className={`rounded-2xl px-3 py-2.5 text-xs font-bold transition disabled:ring-2 disabled:ring-primary ${STATUS[s].tone} hover:opacity-80`}>
                {STATUS[s].label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={print} className="btn-dark w-full py-3"><Printer className="size-4" /> طباعة الفاتورة / بوليصة</button>
      </div>
    </div>
  );
}
