import Link from "next/link";
import { FooterMark } from "./footer-mark";
import { Mail, MapPin, MessageCircle, Phone, RefreshCcw, ShieldCheck, Truck, Wallet } from "lucide-react";
import type { Category, Settings } from "@/lib/types";

const Social = ({ href, label, d }: { href: string; label: string; d: string }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/15 transition hover:-translate-y-1 hover:border-primary hover:bg-primary">
      <svg viewBox="0 0 24 24" className="size-4 fill-current"><path d={d} /></svg>
    </a>
  ) : null;

const ICONS = {
  instagram: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8zm5.4-9.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z",
  facebook: "M14 8.5V6.6c0-.8.2-1.3 1.4-1.3H17V2.2C16.7 2.1 15.7 2 14.6 2 12.2 2 10.6 3.4 10.6 6.1v2.4H8v3.2h2.6V22H14V11.7h2.7l.4-3.2H14z",
  tiktok: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z",
};

const TRUST = [
  { icon: Truck, t: "شحن لكل المحافظات", d: "توصيل سريع لباب البيت" },
  { icon: Wallet, t: "الدفع عند الاستلام", d: "افحصي طلبك الأول" },
  { icon: RefreshCcw, t: "استبدال سهل", d: "خلال أيام من الاستلام" },
  { icon: ShieldCheck, t: "تغليف سري وأنيق", d: "خصوصيتك أولويتنا" },
];

export function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  const pays = ["الدفع عند الاستلام", settings.instapay && "InstaPay", settings.vodafoneCash && "فودافون كاش"].filter(Boolean) as string[];
  return (
    <footer className="relative mt-28 overflow-hidden bg-[#0b2340] text-white dark:bg-[#05111f]">
      <div className="brand-stripe"><span /><span /><span /></div>
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)]" />
      <div className="pointer-events-none absolute -top-40 right-1/4 size-[30rem] rounded-full bg-primary/30 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 size-[26rem] rounded-full bg-[#fbbf24]/10 blur-[120px]" />

      <div className="container-z relative pt-14">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.06] p-6 backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,.08)_50%,transparent_65%)] bg-[length:250%_100%] animate-shimmer" />
          <div className="relative flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-right">
            <div>
              <p className="font-serif text-sm italic tracking-[.3em] text-[#5eead4]">STAY CLOSE</p>
              <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">خليكي أول واحدة تعرف <span className="text-gradient animate-shimmer">بالكوليكشن الجديد</span></h3>
              <p className="mt-2 text-sm text-white/60">عروض حصرية وخصومات بتنزل لمتابعينا الأول</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="btn-primary px-7 py-3.5">
                  <MessageCircle className="size-4" /> تابعينا على واتساب
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="btn border border-white/20 bg-white/5 px-7 py-3.5 text-white hover:-translate-y-0.5 hover:border-[#fbbf24] hover:text-[#fbbf24]">
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TRUST.map((x) => (
            <div key={x.t} className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[.03] p-4 transition duration-500 hover:-translate-y-1 hover:border-[#5eead4]/30 hover:bg-white/[.06]">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0e2c4e] shadow-lg shadow-black/20 transition duration-500 group-hover:rotate-[8deg]">
                <x.icon className="size-5 text-[#fbbf24]" />
              </span>
              <span>
                <b className="block text-sm">{x.t}</b>
                <span className="text-xs text-white/50">{x.d}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-z relative grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-4xl tracking-[.2em]">{settings.storeName}</p>
          <p className="mt-4 text-sm leading-7 text-white/60">{settings.aboutText}</p>
          <div className="mt-6 flex gap-2">
            <Social href={settings.instagram} label="Instagram" d={ICONS.instagram} />
            <Social href={settings.facebook} label="Facebook" d={ICONS.facebook} />
            <Social href={settings.tiktok} label="TikTok" d={ICONS.tiktok} />
          </div>
        </div>
        <div>
          <h4 className="mb-5 flex items-center gap-2 font-bold"><span className="h-4 w-1 rounded-full bg-[#14b8a6]" /> الأقسام</h4>
          <ul className="space-y-3 text-sm text-white/70">
            {categories.map((c) => (
              <li key={c.id}><Link href={`/shop?category=${c.slug}`} className="link-dot">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-5 flex items-center gap-2 font-bold"><span className="h-4 w-1 rounded-full bg-[#14b8a6]" /> مساعدة</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link href="/track" className="link-dot">تتبع طلبك</Link></li>
            <li><Link href="/shop" className="link-dot">كل المنتجات</Link></li>
            <li><Link href="/checkout" className="link-dot">إتمام الطلب</Link></li>
            <li className="text-white/50">الاستبدال والاسترجاع خلال {settings.returnDays} يوم</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-5 flex items-center gap-2 font-bold"><span className="h-4 w-1 rounded-full bg-[#14b8a6]" /> تواصلي معانا</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><a href={`tel:${settings.phone}`} className="flex items-center gap-3 hover:text-[#5eead4]"><span className="grid size-9 place-items-center rounded-xl bg-white/5"><Phone className="size-4 text-[#5eead4]" /></span> <span dir="ltr">{settings.phone}</span></a></li>
            <li><a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-[#5eead4]"><span className="grid size-9 place-items-center rounded-xl bg-white/5"><Mail className="size-4 text-[#5eead4]" /></span> {settings.email}</a></li>
            <li className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-white/5"><MapPin className="size-4 text-[#5eead4]" /></span> شحن لكل محافظات مصر</li>
          </ul>
        </div>
      </div>

      <FooterMark name={settings.storeName} />

      <div className="relative border-t border-white/10 bg-black/10">
        <div className="container-z flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.storeName}. جميع الحقوق محفوظة.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {pays.map((p) => <span key={p} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-bold text-white/70">{p}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
