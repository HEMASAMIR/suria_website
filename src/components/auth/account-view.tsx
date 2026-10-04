"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, KeyRound, Loader2, LogOut, MapPin, Package, Save, ShoppingBag, User, Wallet } from "lucide-react";
import { toast } from "sonner";
import { OrderTimeline } from "../order-timeline";
import { PAYMENT, STATUS, egp, fmtDate } from "@/lib/format";
import type { Order, PublicCustomer } from "@/lib/types";

type Tab = "orders" | "profile" | "address" | "password";
const TABS: { id: Tab; l: string; icon: typeof Package }[] = [
  { id: "orders", l: "طلباتي", icon: Package },
  { id: "profile", l: "بياناتي", icon: User },
  { id: "address", l: "عنوان الشحن", icon: MapPin },
  { id: "password", l: "كلمة السر", icon: KeyRound },
];

async function put(body: unknown) {
  const r = await fetch("/api/auth/me", { method: "PUT", body: JSON.stringify(body) });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error);
  return d.customer as PublicCustomer;
}

export function AccountView({ me: initial, orders, governorates }: { me: PublicCustomer; orders: Order[]; governorates: string[] }) {
  const router = useRouter();
  const [me, setMe] = useState(initial);
  const [tab, setTab] = useState<Tab>("orders");
  const [open, setOpen] = useState<string | null>(orders[0]?.id ?? null);
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState({ name: me.name, phone: me.phone, email: me.email ?? "" });
  const [addr, setAddr] = useState(me.address ?? { governorate: "", city: "", address: "" });
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  const active = orders.filter((o) => !["delivered", "cancelled", "returned"].includes(o.status)).length;
  const spent = orders.filter((o) => !["cancelled", "returned"].includes(o.status)).reduce((s, o) => s + o.total, 0);

  const run = async (body: unknown, msg: string, after?: () => void) => {
    setBusy(true);
    try {
      setMe(await put(body));
      toast.success(msg);
      after?.();
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    toast("تم تسجيل الخروج، نشوفك قريب 👋");
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="soft-wash relative overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div className="container-z relative py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bridal-card relative overflow-hidden rounded-[2.5rem] p-7 text-white sm:p-10">
          <div className="bridal-orb pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-[#14b8a6]/40 blur-[90px]" />
          <div className="relative flex flex-wrap items-center gap-5">
            <span className="grid size-20 place-items-center rounded-[1.75rem] bg-gradient-to-br from-[#fcd34d] to-[#f59e0b] text-3xl font-extrabold text-[#0e2c4e] shadow-2xl shadow-[#f59e0b]/30 ring-4 ring-white/20">
              {me.name[0]}
            </span>
            <div className="flex-1">
              <p className="text-sm text-white/60">أهلاً بيكي 💗</p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">{me.name}</h1>
              <p className="mt-1 text-sm text-white/60" dir="ltr" style={{ textAlign: "right" }}>{me.phone}</p>
            </div>
            <button onClick={logout} className="btn border border-white/20 bg-white/5 py-2.5 text-white hover:border-rose-300 hover:text-rose-200">
              <LogOut className="size-4" /> تسجيل الخروج
            </button>
          </div>
          <div className="relative mt-8 grid grid-cols-3 gap-3">
            {[
              [ShoppingBag, "كل الطلبات", String(orders.length)],
              [Package, "طلبات جارية", String(active)],
              [Wallet, "إجمالي مشترياتك", egp(spent)],
            ].map(([I, l, v]) => {
              const Icon = I as typeof Package;
              return (
                <div key={l as string} className="rounded-2xl bg-white/[.07] p-4 ring-1 ring-white/10">
                  <Icon className="size-5 text-[#fbbf24]" />
                  <p className="mt-2 text-xl font-extrabold sm:text-2xl">{v as string}</p>
                  <p className="text-xs text-white/60">{l as string}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <nav className="card flex gap-1 overflow-x-auto p-2 lg:flex-col lg:self-start">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${tab === t.id ? "text-white" : "text-muted hover:text-primary"}`}>
                {tab === t.id && <motion.span layoutId="acct-tab" className="absolute inset-0 rounded-2xl bg-primary shadow-lg shadow-primary/30" />}
                <t.icon className="relative size-[18px]" />
                <span className="relative">{t.l}</span>
              </button>
            ))}
          </nav>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              {tab === "orders" &&
                (orders.length === 0 ? (
                  <div className="card py-16 text-center">
                    <span className="mx-auto grid size-20 animate-float place-items-center rounded-[1.75rem] bg-gradient-to-br from-primary to-[#0e2c4e] text-white"><ShoppingBag className="size-9" /></span>
                    <p className="mt-5 text-lg font-extrabold">لسه معملتيش طلبات</p>
                    <p className="mt-1 text-sm text-muted">أول طلب ليكي هيظهر هنا وتقدري تتابعيه</p>
                    <Link href="/shop" className="btn-primary mt-6">تسوقي الآن</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div key={o.id} className="card overflow-hidden">
                        <button onClick={() => setOpen(open === o.id ? null : o.id)} className="flex w-full flex-wrap items-center gap-4 p-5 text-right">
                          <div className="flex -space-x-3 space-x-reverse">
                            {o.items.slice(0, 3).map((it, i) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={i} src={it.image} alt="" className="size-12 rounded-xl border-2 border-surface object-cover" />
                            ))}
                          </div>
                          <div className="flex-1">
                            <p className="font-serif font-bold text-primary">#{o.number}</p>
                            <p className="text-xs text-muted">{fmtDate(o.createdAt)} • {o.items.reduce((s, x) => s + x.qty, 0)} قطعة</p>
                          </div>
                          <span className={`chip ${STATUS[o.status].tone}`}>{STATUS[o.status].label}</span>
                          <b>{egp(o.total)}</b>
                          <ChevronDown className={`size-5 text-muted transition ${open === o.id ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {open === o.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="space-y-6 border-t border-line p-5">
                                <OrderTimeline status={o.status} history={o.history} />
                                <div className="space-y-2">
                                  {o.items.map((it, i) => (
                                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-surface-2 p-2.5">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={it.image} alt="" className="h-14 w-12 rounded-xl object-cover" />
                                      <div className="flex-1">
                                        <p className="text-sm font-bold">{it.name}</p>
                                        <p className="text-xs text-muted">{[it.color, it.size, `× ${it.qty}`].filter(Boolean).join(" • ")}</p>
                                      </div>
                                      <b className="text-sm">{egp(it.price * it.qty)}</b>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex flex-wrap justify-between gap-2 text-sm text-muted">
                                  <span>الشحن لـ {o.customer.governorate}: {o.shippingFee ? egp(o.shippingFee) : "مجاني"}</span>
                                  {o.discount > 0 && <span>خصم: {egp(o.discount)}</span>}
                                  <span>{PAYMENT[o.paymentMethod]}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                ))}

              {tab === "profile" && (
                <form onSubmit={(e) => { e.preventDefault(); run(profile, "تم حفظ بياناتك ✨"); }} className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                  <div className="sm:col-span-2"><label className="label">الاسم بالكامل</label><input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input" /></div>
                  <div><label className="label">رقم الموبايل</label><input required dir="ltr" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input text-right" /></div>
                  <div><label className="label">البريد الإلكتروني</label><input type="email" dir="ltr" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input text-right" /></div>
                  <div className="sm:col-span-2"><button disabled={busy} className="btn-primary">{busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} حفظ</button></div>
                </form>
              )}

              {tab === "address" && (
                <form onSubmit={(e) => { e.preventDefault(); run({ address: addr }, "تم حفظ العنوان 📍"); }} className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                  <p className="text-sm text-muted sm:col-span-2">العنوان ده هيتكتب تلقائي في صفحة الدفع، وبيتحدّث مع كل طلب جديد.</p>
                  <div>
                    <label className="label">المحافظة</label>
                    <select required value={addr.governorate} onChange={(e) => setAddr({ ...addr, governorate: e.target.value })} className="input">
                      <option value="">اختاري المحافظة</option>
                      {governorates.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div><label className="label">المدينة / المنطقة</label><input required value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className="input" /></div>
                  <div className="sm:col-span-2"><label className="label">العنوان بالتفصيل</label><input required value={addr.address} onChange={(e) => setAddr({ ...addr, address: e.target.value })} className="input" /></div>
                  <div className="sm:col-span-2"><button disabled={busy} className="btn-primary">{busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} حفظ العنوان</button></div>
                </form>
              )}

              {tab === "password" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (pw.newPassword !== pw.confirm) return toast.error("كلمتين السر مش زي بعض");
                    run({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }, "تم تغيير كلمة السر 🔐", () => setPw({ currentPassword: "", newPassword: "", confirm: "" }));
                  }}
                  className="card grid max-w-lg gap-4 p-6 sm:p-8"
                >
                  <div><label className="label">كلمة السر الحالية</label><input required type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} className="input" autoComplete="current-password" /></div>
                  <div><label className="label">كلمة السر الجديدة</label><input required minLength={6} type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} className="input" autoComplete="new-password" /></div>
                  <div><label className="label">تأكيد كلمة السر الجديدة</label><input required type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="input" autoComplete="new-password" /></div>
                  <div><button disabled={busy} className="btn-primary">{busy ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />} تغيير كلمة السر</button></div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
