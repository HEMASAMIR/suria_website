"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import {
  ArrowLeft, ArrowUp, Clock, FolderHeart, LifeBuoy, LogIn, Mail, MapPin, MessageCircle, Package, Phone, RefreshCcw, ShoppingBag, Star, Truck,
} from "lucide-react";
import type { Category, Settings } from "@/lib/types";

const ICONS = {
  instagram: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8zm5.4-9.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z",
  facebook: "M14 8.5V6.6c0-.8.2-1.3 1.4-1.3H17V2.2C16.7 2.1 15.7 2 14.6 2 12.2 2 10.6 3.4 10.6 6.1v2.4H8v3.2h2.6V22H14V11.7h2.7l.4-3.2H14z",
  tiktok: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z",
};

const SOCIAL_STYLE: Record<keyof typeof ICONS, string> = {
  instagram: "hover:bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)] hover:shadow-[#dc2743]/40",
  facebook: "hover:bg-[#1877f2] hover:shadow-[#1877f2]/40",
  tiktok: "hover:bg-black hover:shadow-[#25f4ee]/40",
};

const col = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }),
};

function ColTitle({ icon: Icon, children }: { icon: typeof Package; children: React.ReactNode }) {
  return (
    <h4 className="mb-5 flex items-center gap-2.5 text-base font-extrabold">
      <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0e2c4e] shadow-lg shadow-black/20">
        <Icon className="size-4 text-[#fbbf24]" />
      </span>
      {children}
      <span className="h-px flex-1 bg-gradient-to-l from-white/0 via-white/10 to-white/20" />
    </h4>
  );
}

function NavLink({ href, icon: Icon, children }: { href: string; icon: typeof Package; children: React.ReactNode }) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-white/70 transition hover:bg-white/[.05] hover:text-white">
      <Icon className="size-4 text-[#5eead4]/70 transition group-hover:text-[#5eead4]" />
      <span className="flex-1">{children}</span>
      <ArrowLeft className="size-3.5 translate-x-2 text-[#fbbf24] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  );
}

/** "Open now" based on Cairo time; computed after mount to avoid hydration mismatch. */
function useOpenNow() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => {
      const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Africa/Cairo" }).format(new Date()));
      setOpen(h >= 10 && h < 24);
    };
    check();
    const t = setInterval(check, 60_000);
    return () => clearInterval(t);
  }, []);
  return open;
}

export function FooterColumns({ settings, categories }: { settings: Settings; categories: Category[] }) {
  const open = useOpenNow();
  const socials = (["instagram", "facebook", "tiktok"] as const).filter((k) => settings[k]);

  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="container-z relative grid gap-6 py-14 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_.9fr_1.15fr]">
      {/* Brand */}
      <motion.div custom={0} variants={col} className="relative">
        <p className="text-gold-shimmer inline-block font-serif text-5xl tracking-[.2em]">{settings.storeName}</p>
        <p className="mt-1 font-serif text-xs italic tracking-[.35em] text-[#5eead4]/80">EST. 2026 • CAIRO</p>
        <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">{settings.aboutText}</p>

        <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3">
          <span className="font-serif text-2xl font-bold">4.9</span>
          <span>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-3.5 fill-[#fbbf24] text-[#fbbf24]" />)}
            </span>
            <span className="text-[11px] text-white/50">من +5,000 عميلة سعيدة</span>
          </span>
        </div>

        {socials.length > 0 && (
          <div className="mt-6 flex gap-2.5">
            {socials.map((k, i) => (
              <motion.a
                key={k}
                href={settings[k]}
                target="_blank"
                rel="noreferrer"
                aria-label={k}
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 260 }}
                className={`group relative grid size-11 place-items-center rounded-2xl border border-white/15 bg-white/[.04] transition duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl ${SOCIAL_STYLE[k]}`}
              >
                <svg viewBox="0 0 24 24" className="size-[18px] fill-current transition group-hover:scale-110"><path d={ICONS[k]} /></svg>
                <span className="pointer-events-none absolute -top-9 rounded-lg bg-white px-2 py-1 text-[10px] font-bold capitalize text-[#0e2c4e] opacity-0 transition group-hover:-top-10 group-hover:opacity-100">{k}</span>
              </motion.a>
            ))}
          </div>
        )}
      </motion.div>

      {/* Categories with thumbnails */}
      <motion.div custom={1} variants={col} className="rounded-[1.75rem] border border-white/[.07] bg-white/[.025] p-5 backdrop-blur-sm">
        <ColTitle icon={FolderHeart}>الأقسام</ColTitle>
        <ul className="space-y-1">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/shop?category=${c.slug}`} className="group flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-white/[.06]">
                <span className="relative size-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 transition group-hover:ring-[#5eead4]/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="" className="size-full object-cover transition duration-500 group-hover:scale-125" />
                </span>
                <span className="flex-1 text-sm text-white/75 transition group-hover:text-white">{c.name}</span>
                <ArrowLeft className="size-3.5 translate-x-2 text-[#fbbf24] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Help */}
      <motion.div custom={2} variants={col} className="rounded-[1.75rem] border border-white/[.07] bg-white/[.025] p-5 backdrop-blur-sm">
        <ColTitle icon={LifeBuoy}>مساعدة</ColTitle>
        <div className="space-y-0.5">
          <NavLink href="/track" icon={Truck}>تتبع طلبك</NavLink>
          <NavLink href="/shop" icon={ShoppingBag}>كل المنتجات</NavLink>
          <NavLink href="/account" icon={Package}>حسابي وطلباتي</NavLink>
          <NavLink href="/login" icon={LogIn}>دخول / حساب جديد</NavLink>
          <NavLink href="/checkout" icon={ArrowLeft}>إتمام الطلب</NavLink>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fbbf24]/10 p-3 text-xs text-[#fde68a]">
          <RefreshCcw className="mt-0.5 size-3.5 shrink-0" /> استبدال واسترجاع سهل خلال {settings.returnDays} يوم من الاستلام
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div custom={3} variants={col} className="rounded-[1.75rem] border border-white/[.07] bg-white/[.025] p-5 backdrop-blur-sm">
        <ColTitle icon={MessageCircle}>تواصلي معانا</ColTitle>
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-white/[.04] px-3 py-2.5 text-xs">
          <span className="relative flex size-2.5">
            {open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
            <span className={`relative inline-flex size-2.5 rounded-full ${open === null ? "bg-white/30" : open ? "bg-emerald-400" : "bg-amber-400"}`} />
          </span>
          <b className={open ? "text-emerald-300" : "text-amber-300"}>{open === null ? "…" : open ? "متاحين دلوقتي" : "هنرد عليكي الصبح"}</b>
          <span className="mr-auto flex items-center gap-1 text-white/50"><Clock className="size-3.5" /> 10 ص – 12 م</span>
        </div>
        <div className="space-y-2">
          {[
            { href: `tel:${settings.phone}`, icon: Phone, label: "اتصلي بينا", value: settings.phone, ltr: true },
            { href: `mailto:${settings.email}`, icon: Mail, label: "البريد الإلكتروني", value: settings.email, ltr: true },
            { href: "/track", icon: MapPin, label: "التوصيل", value: "لكل محافظات مصر" },
          ].map((x) => (
            <a key={x.label} href={x.href} className="group flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-white/[.06]">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[.06] ring-1 ring-white/10 transition group-hover:bg-[#14b8a6] group-hover:ring-transparent">
                <x.icon className="size-4 text-[#5eead4] transition group-hover:text-white" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] text-white/45">{x.label}</span>
                <span dir={x.ltr ? "ltr" : undefined} className="block truncate text-sm font-bold text-white/85">{x.value}</span>
              </span>
            </a>
          ))}
        </div>
        {settings.whatsapp && (
          <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="btn mt-4 w-full bg-[#25D366] py-3 text-white shadow-lg shadow-[#25D366]/25 hover:-translate-y-0.5 hover:shadow-xl">
            <MessageCircle className="size-4" /> كلمينا على واتساب
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Floating back-to-top button with a scroll-progress ring. */
export function BackToTop() {
  const { scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useEffect(() => scrollYProgress.on("change", (v) => setShow(v > 0.15)), [scrollYProgress]);
  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="لفوق"
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6, y: show ? 0 : 20 }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      className="group fixed bottom-24 right-5 z-40 grid size-14 place-items-center rounded-full bg-surface shadow-xl shadow-black/10 ring-1 ring-line"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
        <circle cx="24" cy="24" r="21" className="fill-none stroke-line" strokeWidth="3" />
        <motion.circle cx="24" cy="24" r="21" className="fill-none" stroke="url(#btt)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: scrollYProgress }} />
        <defs>
          <linearGradient id="btt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#14b8a6" /><stop offset="100%" stopColor="#fbbf24" /></linearGradient>
        </defs>
      </svg>
      <ArrowUp className="size-5 text-primary transition group-hover:-translate-y-0.5" />
    </motion.button>
  );
}
