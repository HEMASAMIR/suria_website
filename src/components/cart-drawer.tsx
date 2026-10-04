"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "./cart-context";
import { egp } from "@/lib/format";

export function CartDrawer({ freeShippingThreshold, categories = [] }: { freeShippingThreshold: number; categories?: { slug: string; name: string }[] }) {
  const { lines, open, setOpen, subtotal, setQty, remove } = useCart();
  const left = Math.max(0, freeShippingThreshold - subtotal);
  const pct = freeShippingThreshold > 0 ? Math.min(100, (subtotal / freeShippingThreshold) * 100) : 100;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm" />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed inset-y-0 left-0 z-[90] flex w-full max-w-md flex-col bg-bg shadow-2xl"
          >
            <div className="relative flex items-center justify-between border-b border-line bg-surface p-5">
              <div className="brand-stripe absolute inset-x-0 top-0"><span /><span /><span /></div>
              <h3 className="flex items-center gap-2 text-lg font-extrabold">
                <ShoppingBag className="size-5 text-primary" /> سلة المشتريات
              </h3>
              <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full border border-line hover:border-primary"><X className="size-4" /></button>
            </div>

            {freeShippingThreshold > 0 && lines.length > 0 && (
              <div className="border-b border-line bg-primary-soft/60 px-5 py-3 text-sm">
                {left > 0 ? (
                  <p>فاضلك <b className="text-primary">{egp(left)}</b> وتاخدي <b>شحن مجاني</b> 🎁</p>
                ) : (
                  <p className="font-bold text-primary">مبروك! طلبك عليه شحن مجاني 🎉</p>
                )}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full rounded-full bg-gradient-to-l from-primary to-gold" />
                </div>
              </div>
            )}

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {lines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="relative mx-auto mb-6 grid size-28 animate-float place-items-center">
                      <span className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/25 to-gold/25 blur-xl" />
                      <span className="relative grid size-28 place-items-center rounded-[2rem] bg-gradient-to-br from-primary to-[#0e2c4e] text-white shadow-2xl shadow-primary/30">
                        <ShoppingBag className="size-11" />
                      </span>
                    </div>
                    <p className="text-xl font-extrabold">سلتك لسه فاضية</p>
                    <p className="mt-1 text-sm text-muted">يلا اختاري اللي يعجبك من تشكيلتنا 💫</p>
                    <Link href="/shop" onClick={() => setOpen(false)} className="btn-primary mt-6 px-8">تسوقي الآن</Link>
                    {categories.length > 0 && (
                      <div className="mt-8">
                        <p className="mb-3 text-xs font-bold text-muted">أو ابدئي من قسم</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {categories.map((c, i) => (
                            <motion.div key={c.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                              <Link href={`/shop?category=${c.slug}`} onClick={() => setOpen(false)} className="block rounded-full border border-line bg-surface px-4 py-2 text-xs font-bold transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary-soft hover:text-primary">{c.name}</Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {lines.map((l) => (
                    <motion.div key={l.key} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }} className="card flex gap-3 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.image} alt={l.name} className="h-24 w-20 rounded-2xl object-cover" />
                      <div className="flex flex-1 flex-col">
                        <Link href={`/product/${l.slug}`} onClick={() => setOpen(false)} className="line-clamp-1 text-sm font-bold hover:text-primary">{l.name}</Link>
                        <p className="mt-0.5 text-xs text-muted">{[l.color, l.size].filter(Boolean).join(" • ")}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-line">
                            <button onClick={() => setQty(l.key, l.qty + 1)} className="grid size-7 place-items-center hover:text-primary"><Plus className="size-3.5" /></button>
                            <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
                            <button onClick={() => setQty(l.key, l.qty - 1)} className="grid size-7 place-items-center hover:text-primary"><Minus className="size-3.5" /></button>
                          </div>
                          <span className="text-sm font-extrabold text-primary">{egp(l.price * l.qty)}</span>
                        </div>
                      </div>
                      <button onClick={() => remove(l.key)} className="self-start text-muted hover:text-rose-500" aria-label="حذف"><Trash2 className="size-4" /></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {lines.length > 0 && (
              <div className="space-y-3 border-t border-line p-5">
                <div className="flex justify-between text-sm"><span className="text-muted">الإجمالي الفرعي</span><b className="text-lg">{egp(subtotal)}</b></div>
                <p className="text-xs text-muted">مصاريف الشحن بتتحسب حسب المحافظة في صفحة الدفع</p>
                <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full py-4 text-base">إتمام الطلب</Link>
                <button onClick={() => setOpen(false)} className="w-full text-center text-sm font-bold text-muted hover:text-primary">كملي تسوق</button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
