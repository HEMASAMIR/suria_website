import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/motion";
import { OrderTimeline } from "@/components/order-timeline";
import { readDB } from "@/lib/db";
import { PAYMENT, egp } from "@/lib/format";

export default async function OrderPage({ params, searchParams }: PageProps<"/order/[number]">) {
  await connection();
  const { number } = await params;
  const { phone } = await searchParams;
  const db = await readDB();
  const o = db.orders.find((x) => x.number === number && x.customer.phone === phone);
  if (!o) notFound();
  const s = db.settings;

  return (
    <div className="container-z max-w-3xl py-14">
      <Reveal className="text-center">
        <div className="relative mx-auto grid size-24 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <span className="relative grid size-24 place-items-center rounded-full bg-primary text-white shadow-2xl shadow-primary/40">
            <CheckCircle2 className="size-12" />
          </span>
        </div>
        <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">شكرًا يا {o.customer.name.split(" ")[0]} 💗</h1>
        <p className="mt-2 text-muted">طلبك وصلنا وهنكلمك قريب لتأكيده</p>
        <p className="mt-4 inline-block rounded-full bg-primary-soft px-5 py-2 font-serif text-lg font-bold text-primary">#{o.number}</p>
      </Reveal>

      <Reveal delay={0.2} className="card mt-10 p-6 sm:p-8">
        <OrderTimeline status={o.status} history={o.history} />
      </Reveal>

      <Reveal delay={0.3} className="card mt-6 p-6 sm:p-8">
        <div className="space-y-3">
          {o.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt="" className="h-16 w-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-bold">{it.name}</p>
                <p className="text-xs text-muted">{[it.color, it.size, `× ${it.qty}`].filter(Boolean).join(" • ")}</p>
              </div>
              <b className="text-sm">{egp(it.price * it.qty)}</b>
            </div>
          ))}
        </div>
        <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted">المنتجات</dt><dd>{egp(o.subtotal)}</dd></div>
          {o.discount > 0 && <div className="flex justify-between text-emerald"><dt>الخصم</dt><dd>- {egp(o.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">الشحن ({o.customer.governorate})</dt><dd>{o.shippingFee ? egp(o.shippingFee) : "مجاني"}</dd></div>
          <div className="flex justify-between text-lg font-extrabold"><dt>الإجمالي</dt><dd className="text-primary">{egp(o.total)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">طريقة الدفع</dt><dd className="font-bold">{PAYMENT[o.paymentMethod]}</dd></div>
        </dl>
        {o.paymentMethod !== "cod" && (
          <p className="mt-4 rounded-2xl bg-primary-soft p-4 text-sm">
            حوّلي <b>{egp(o.total)}</b> على <b dir="ltr">{o.paymentMethod === "instapay" ? s.instapay : s.vodafoneCash}</b> وابعتي صورة التحويل على واتساب مع رقم الطلب.
          </p>
        )}
      </Reveal>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-primary">كملي تسوق</Link>
        <a href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(`طلب رقم ${o.number}`)}`} target="_blank" rel="noreferrer" className="btn-ghost">تابعي على واتساب</a>
      </div>
    </div>
  );
}
