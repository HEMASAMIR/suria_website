"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, BadgeCheck, Copy, Gem, Gift, Heart, Quote, RefreshCcw, ShieldCheck, Sparkles, Star, Truck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Reveal, Stagger, StaggerItem } from "../motion";
import type { Testimonial } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Bridal banner                                                       */
/* ------------------------------------------------------------------ */

// Deterministic sparkle layout (no Math.random during render).
const SPARKS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 4 + ((i * 7) % 6),
  delay: (i % 8) * 0.45,
}));

export function BridalBanner({ image, image2, coupon = "BRIDE200" }: { image: string; image2: string; coupon?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  // Mouse-driven 3D tilt for the photo stack.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 15 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 15 });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon);
      toast.success(`تم نسخ الكود ${coupon} 💍`, { description: "استخدميه في صفحة الدفع" });
    } catch {
      toast(coupon);
    }
  };

  return (
    <div ref={ref} className="container-z">
      <div className="bridal-card relative overflow-hidden rounded-[2.75rem] text-white">
        <div className="bridal-orb pointer-events-none absolute -left-24 -top-24 size-[28rem] rounded-full bg-[#14b8a6]/40 blur-[110px]" />
        <div className="bridal-orb pointer-events-none absolute -bottom-32 right-10 size-[24rem] rounded-full bg-[#fbbf24]/25 blur-[110px] [animation-delay:-4s]" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.05)_1px,transparent_1px)]" />
        {SPARKS.map((s, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-[#fde68a] shadow-[0_0_12px_2px_rgba(253,230,138,.7)]"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4], y: [0, -18, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}

        <div className="relative grid items-center gap-12 p-8 sm:p-14 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur">
              <Sparkles className="size-3.5 text-[#fbbf24]" />
              <span className="font-serif italic tracking-[.25em]">BRIDAL COLLECTION</span>
            </span>
            <h2 className="mt-5 text-4xl font-extrabold leading-[1.25] sm:text-5xl lg:text-6xl">
              لليلة العمر…
              <br />
              <span className="text-gold-shimmer">إطلالة ما تتنسيش</span>
            </h2>
            <p className="mt-5 max-w-lg leading-8 text-white/75">
              أطقم قمصان وروبات ستان ودانتيل وتول، مختارة بعناية لجهاز كل عروسة — بتغليف هدية فاخر يليق بفرحتك.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                [Gift, "تغليف هدية مجاني"],
                [Heart, "+300 عروسة اختارتنا"],
                [Gem, "ستان ودانتيل فاخر"],
              ].map(([I, t], k) => {
                const Icon = I as typeof Gift;
                return (
                  <motion.span
                    key={t as string}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + k * 0.1 }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-xs font-bold ring-1 ring-white/10"
                  >
                    <Icon className="size-3.5 text-[#5eead4]" /> {t as string}
                  </motion.span>
                );
              })}
            </div>

            <button onClick={copy} className="group mt-8 flex w-full max-w-md items-center gap-4 rounded-2xl border border-dashed border-[#fbbf24]/60 bg-white/[.06] p-3 pr-4 text-right backdrop-blur transition hover:border-[#fbbf24] hover:bg-white/10">
              <span className="flex-1">
                <span className="block text-xs text-white/60">خصم 200 ج.م على طلبات العرايس</span>
                <span className="mt-0.5 block text-sm font-bold">دوسي وانسخي الكود</span>
              </span>
              <span className="ticker-code flex items-center gap-2 rounded-xl px-4 py-2.5 font-sans text-base font-extrabold tracking-widest text-[#0e2c4e]">
                {coupon} <Copy className="size-4 transition group-hover:rotate-12" />
              </span>
            </button>

            <Link href="/shop?category=bridal" className="btn-primary mt-6 px-9 py-4 text-base">
              اكتشفي التشكيلة <ArrowLeft className="size-4" />
            </Link>
          </Reveal>

          <motion.div
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mx.set((e.clientX - r.left) / r.width - 0.5);
              my.set((e.clientY - r.top) / r.height - 0.5);
            }}
            onMouseLeave={() => { mx.set(0); my.set(0); }}
            style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
            className="relative grid h-[28rem] grid-cols-2 gap-5 sm:h-[32rem]"
          >
            <motion.div style={{ y: y1 }} className="group relative overflow-hidden rounded-[2rem] border-[5px] border-white/90 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="size-full object-cover transition duration-[1.2s] group-hover:scale-110" />
              <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,.35)_50%,transparent_65%)] bg-[length:250%_100%] animate-shimmer opacity-60" />
            </motion.div>
            <motion.div style={{ y: y2 }} className="group relative mt-14 overflow-hidden rounded-[2rem] border-[5px] border-white/90 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image2} alt="" className="size-full object-cover transition duration-[1.2s] group-hover:scale-110" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: -8 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.5 }}
              className="absolute -top-4 left-1/2 z-10 grid size-24 -translate-x-1/2 animate-float place-items-center rounded-full bg-gradient-to-br from-[#fcd34d] to-[#f59e0b] text-center text-[#0e2c4e] shadow-2xl shadow-[#f59e0b]/40 ring-4 ring-white/30"
            >
              <span className="leading-tight">
                <b className="block text-xl">200</b>
                <span className="text-[10px] font-extrabold">ج.م خصم</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { icon: Truck, title: "شحن لكل المحافظات", text: "توصيل سريع لباب البيت", stat: "27 محافظة" },
  { icon: Wallet, title: "الدفع عند الاستلام", text: "أو InstaPay وفودافون كاش", stat: "أمان 100%" },
  { icon: RefreshCcw, title: "استبدال سهل", text: "خلال 14 يوم من الاستلام", stat: "بدون تعقيد" },
  { icon: Gem, title: "خامات فاخرة", text: "ستان، دانتيل، وقطن ريب", stat: "جودة مضمونة" },
  { icon: ShieldCheck, title: "تغليف سري وأنيق", text: "خصوصيتك أولويتنا", stat: "هدية جاهزة" },
];

export function Features() {
  return (
    <div className="relative">
      <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {FEATURES.map((f, i) => (
          <StaggerItem key={f.title} className={i === 4 ? "col-span-2 md:col-span-1" : ""}>
            <div
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
              }}
              className="spotlight glow-border group relative h-full overflow-hidden rounded-[1.75rem] border border-line bg-surface p-6 text-center transition duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-20px_rgba(13,148,136,.35)]"
            >
              <span className="relative mx-auto grid size-16 place-items-center">
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-[#0e2c4e] opacity-20 blur-lg transition duration-500 group-hover:opacity-60" />
                <span className="relative grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[#0e2c4e] text-white shadow-lg transition duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <f.icon className="size-7" />
                </span>
                <span className="absolute -left-1 -top-1 size-3 rounded-full bg-gold ring-4 ring-surface transition duration-500 group-hover:scale-150" />
              </span>
              <h3 className="relative mt-5 font-extrabold">{f.title}</h3>
              <p className="relative mt-1 text-xs text-muted">{f.text}</p>
              <span className="relative mt-4 inline-block rounded-full bg-primary-soft px-3 py-1 text-[11px] font-extrabold text-primary transition duration-500 group-hover:bg-primary group-hover:text-white">
                {f.stat}
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials — two infinite rows moving in opposite directions      */
/* ------------------------------------------------------------------ */

function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <div className="glow-border group relative w-[300px] shrink-0 overflow-hidden rounded-[1.75rem] border border-line bg-surface/90 p-6 shadow-[0_15px_40px_-25px_rgba(14,44,78,.35)] backdrop-blur transition duration-500 hover:-translate-y-1.5 sm:w-[360px]" dir="rtl">
      <Quote className="absolute left-5 top-5 size-10 text-primary/10 transition duration-500 group-hover:rotate-12 group-hover:text-primary/25" />
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, k) => (
          <Star key={k} className={`size-4 ${k < t.rating ? "fill-gold text-gold" : "text-line"}`} />
        ))}
      </div>
      <p className="mt-4 min-h-[5.25rem] text-sm leading-7 text-ink/85">{t.text}</p>
      <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span className="relative grid size-11 place-items-center rounded-full bg-gradient-to-br from-primary to-[#0e2c4e] p-[2px]">
          <span className="grid size-full place-items-center rounded-full bg-gradient-to-br from-primary to-[#0e2c4e] font-bold text-white ring-2 ring-surface">{t.name[0]}</span>
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold">{t.name}</p>
          <p className="text-xs text-muted">{t.city}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <BadgeCheck className="size-3.5" /> مشترية فعلًا
        </span>
      </div>
    </div>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  const avg = items.reduce((s, t) => s + t.rating, 0) / items.length;
  const fill = (list: Testimonial[]) => Array.from({ length: Math.max(2, Math.ceil(8 / list.length)) }, () => list).flat();
  const rowA = fill(items);
  const rowB = fill([...items].reverse());

  const row = (list: Testimonial[], reverse: boolean) => (
    <div className="ticker-mask group flex overflow-hidden py-3" dir="ltr">
      <div className={`flex w-max gap-5 pl-5 group-hover:[animation-play-state:paused] ${reverse ? "reviews-track-rev" : "reviews-track"}`}>
        {[...list, ...list].map((t, i) => <ReviewCard key={i} t={t} />)}
      </div>
    </div>
  );

  return (
    <div>
      <Reveal className="container-z mb-10 flex flex-col items-center gap-6 text-center">
        <span className="text-gradient animate-shimmer font-serif text-sm italic tracking-[.3em]">REVIEWS</span>
        <h2 className="-mt-3 text-3xl font-extrabold sm:text-4xl">آراء عميلاتنا 💗</h2>
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-[1.75rem] border border-line bg-surface/80 px-6 py-4 shadow-[0_15px_40px_-25px_rgba(14,44,78,.35)] backdrop-blur">
          <p className="font-serif text-5xl font-bold text-ink">{avg.toFixed(1)}</p>
          <div className="text-right">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, k) => (
                <motion.span key={k} initial={{ scale: 0, rotate: -90 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + k * 0.1, type: "spring" }}>
                  <Star className="size-5 fill-gold text-gold" />
                </motion.span>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted">متوسط تقييم عميلاتنا — ثقتكم هي سر نجاحنا</p>
          </div>
          <span className="hidden h-10 w-px bg-line sm:block" />
          <div className="flex -space-x-2 space-x-reverse">
            {items.slice(0, 4).map((t) => (
              <span key={t.id} className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-[#0e2c4e] text-xs font-bold text-white ring-2 ring-surface">{t.name[0]}</span>
            ))}
            <span className="grid size-9 place-items-center rounded-full bg-gold text-[10px] font-extrabold text-[#0e2c4e] ring-2 ring-surface">+5K</span>
          </div>
        </div>
      </Reveal>
      {row(rowA, false)}
      {items.length > 2 && row(rowB, true)}
    </div>
  );
}
