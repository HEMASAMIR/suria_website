"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BadgePercent, CheckCircle2, Loader2, Lock, LogIn, Smartphone, Truck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./cart-context";
import { egp } from "@/lib/format";
import type { PaymentMethod, PublicCustomer, Settings, ShippingZone } from "@/lib/types";

type Pay = { id: PaymentMethod; label: string; sub: string; icon: typeof Wallet };

export function CheckoutForm({ zones, settings, me }: { zones: ShippingZone[]; settings: Settings; me: PublicCustomer | null }) {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();
  const [f, setF] = useState({
    name: me?.name ?? "", phone: me?.phone ?? "", phone2: "",
    governorate: me?.address && zones.some((z) => z.governorate === me.address!.governorate) ? me.address.governorate : "",
    city: me?.address?.city ?? "", address: me?.address?.address ?? "", notes: "",
  });
  const [pay, setPay] = useState<PaymentMethod>("cod");
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);

  const zone = zones.find((z) => z.governorate === f.governorate);
  const discount = coupon?.discount ?? 0;
  const free = settings.freeShippingThreshold > 0 && subtotal - discount >= settings.freeShippingThreshold;
  const shipping = zone ? (free ? 0 : zone.fee) : 0;
  const total = subtotal - discount + shipping;

  const pays = useMemo<Pay[]>(
    () => [
      { id: "cod", label: "الدفع عند الاستلام", sub: "ادفعي كاش لما الأوردر يوصلك", icon: Wallet },
      ...(settings.instapay ? [{ id: "instapay" as const, label: "InstaPay", sub: `حوّلي على ${settings.instapay}`, icon: Smartphone }] : []),
      ...(settings.vodafoneCash ? [{ id: "vodafone_cash" as const, label: "فودافون كاش", sub: `حوّلي على ${settings.vodafoneCash}`, icon: Smartphone }] : []),
    ],
    [settings.instapay, settings.vodafoneCash],
  );

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const applyCoupon = async () => {
    if (!code.trim()) return;
    setChecking(true);
    const r = await fetch("/api/coupons", { method: "POST", body: JSON.stringify({ code, subtotal }) });
    const d = await r.json();
    setChecking(false);
    if (!r.ok) return toast.error(d.error);
    setCoupon(d);
    toast.success(`تم تطبيق الكود — وفّرتي ${egp(d.discount)} 🎉`);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lines.length) return;
    setBusy(true);
    const r = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customer: f,
        paymentMethod: pay,
        couponCode: coupon?.code,
        items: lines.map((l) => ({ productId: l.productId, qty: l.qty, color: l.color, size: l.size })),
      }),
    });
    const d = await r.json();
    if (!r.ok) {
      setBusy(false);
      return toast.error(d.error);
    }
    clear();
    router.push(`/order/${d.number}?phone=${encodeURIComponent(f.phone)}`);
  };

  if (!lines.length)
    return (
      <div className="card mx-auto max-w-md py-20 text-center">
        <p className="text-xl font-bold">السلة فاضية</p>
        <Link href="/shop" className="btn-primary mt-6">تسوقي الآن</Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        {me ? (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary-soft p-4 text-sm">
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-[#0e2c4e] font-bold text-white">{me.name[0]}</span>
            <span className="flex-1">مسجّلة باسم <b>{me.name}</b> — بياناتك اتكتبت تلقائي والطلب هيظهر في <Link href="/account" className="font-bold text-primary underline">حسابك</Link></span>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-surface p-4 text-sm">
            <LogIn className="size-5 text-primary" />
            <span className="flex-1">عندك حساب؟ سجّلي دخولك عشان بياناتك تتكتب تلقائي وتتابعي طلبك من حسابك</span>
            <Link href="/login?next=/checkout" className="btn-primary px-5 py-2 text-xs">دخول</Link>
          </motion.div>
        )}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold"><span className="grid size-8 place-items-center rounded-full bg-primary text-sm text-white">1</span> بيانات الشحن</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="label">الاسم بالكامل *</label><input required value={f.name} onChange={set("name")} className="input" placeholder="مثال: سارة محمد" /></div>
            <div><label className="label">رقم الموبايل *</label><input required dir="ltr" inputMode="tel" pattern="01[0125][0-9]{8}" value={f.phone} onChange={set("phone")} className="input text-right" placeholder="01xxxxxxxxx" /></div>
            <div><label className="label">رقم تاني (اختياري)</label><input dir="ltr" inputMode="tel" value={f.phone2} onChange={set("phone2")} className="input text-right" placeholder="01xxxxxxxxx" /></div>
            <div>
              <label className="label">المحافظة *</label>
              <select required value={f.governorate} onChange={set("governorate")} className="input">
                <option value="">اختاري المحافظة</option>
                {zones.map((z) => <option key={z.id} value={z.governorate}>{z.governorate} — {egp(z.fee)}</option>)}
              </select>
            </div>
            <div><label className="label">المدينة / المنطقة *</label><input required value={f.city} onChange={set("city")} className="input" placeholder="مثال: مدينة نصر" /></div>
            <div className="sm:col-span-2"><label className="label">العنوان بالتفصيل *</label><input required value={f.address} onChange={set("address")} className="input" placeholder="الشارع، رقم العمارة، الدور، الشقة" /></div>
            <div className="sm:col-span-2"><label className="label">ملاحظات (اختياري)</label><textarea value={f.notes} onChange={set("notes")} rows={3} className="input resize-none" placeholder="أي تفاصيل تساعد المندوب" /></div>
          </div>
          <AnimatePresence>
            {zone && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 flex items-center gap-2 rounded-2xl bg-primary-soft px-4 py-3 text-sm">
                <Truck className="size-4 text-primary" /> التوصيل لـ {zone.governorate} خلال <b>{zone.days}</b> — مصاريف الشحن <b className="text-primary">{free ? "مجاني 🎁" : egp(zone.fee)}</b>
              </motion.p>
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold"><span className="grid size-8 place-items-center rounded-full bg-primary text-sm text-white">2</span> طريقة الدفع</h2>
          <div className="grid gap-3">
            {pays.map((p) => (
              <label key={p.id} className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition ${pay === p.id ? "border-primary bg-primary-soft/50" : "border-line hover:border-primary/40"}`}>
                <input type="radio" name="pay" checked={pay === p.id} onChange={() => setPay(p.id)} className="sr-only" />
                <span className={`grid size-11 place-items-center rounded-xl ${pay === p.id ? "bg-primary text-white" : "bg-surface-2 text-muted"}`}><p.icon className="size-5" /></span>
                <span className="flex-1">
                  <b className="block">{p.label}</b>
                  <span className="text-xs text-muted">{p.sub}</span>
                </span>
                {pay === p.id && <CheckCircle2 className="size-5 text-primary" />}
              </label>
            ))}
          </div>
          {pay !== "cod" && <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">بعد تأكيد الطلب ابعتي صورة التحويل على واتساب مع رقم الأوردر.</p>}
        </motion.section>
      </div>

      <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <h2 className="mb-5 text-lg font-extrabold">ملخص الطلب</h2>
          <div className="max-h-72 space-y-3 overflow-y-auto">
            {lines.map((l) => (
              <div key={l.key} className="flex items-center gap-3">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.image} alt="" className="h-16 w-14 rounded-xl object-cover" />
                  <span className="absolute -left-2 -top-2 grid size-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-bg">{l.qty}</span>
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-bold">{l.name}</p>
                  <p className="text-xs text-muted">{[l.color, l.size].filter(Boolean).join(" • ")}</p>
                </div>
                <b className="text-sm">{egp(l.price * l.qty)}</b>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-2 border-t border-line pt-5">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-line px-3">
              <BadgePercent className="size-4 text-primary" />
              <input value={code} onChange={(e) => setCode(e.target.value)} disabled={!!coupon} placeholder="كود الخصم" className="w-full bg-transparent py-2.5 text-sm uppercase outline-none" />
            </div>
            {coupon ? (
              <button type="button" onClick={() => { setCoupon(null); setCode(""); }} className="btn-ghost px-4 py-2">إلغاء</button>
            ) : (
              <button type="button" onClick={applyCoupon} disabled={checking} className="btn-dark px-4 py-2">{checking ? <Loader2 className="size-4 animate-spin" /> : "تطبيق"}</button>
            )}
          </div>

          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">المنتجات</dt><dd className="font-bold">{egp(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-emerald"><dt>الخصم ({coupon?.code})</dt><dd className="font-bold">- {egp(discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">الشحن</dt><dd className="font-bold">{zone ? (shipping ? egp(shipping) : "مجاني") : "اختاري المحافظة"}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 text-lg"><dt className="font-extrabold">الإجمالي</dt><dd className="font-extrabold text-primary">{egp(total)}</dd></div>
          </dl>
          <button disabled={busy} className="btn-primary mt-6 w-full py-4 text-base">
            {busy ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-4" />} تأكيد الطلب
          </button>
          <p className="mt-3 text-center text-xs text-muted">بياناتك محمية ومش هتتشارك مع أي حد</p>
        </div>
      </motion.aside>
    </form>
  );
}
