"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, Package, ShieldCheck, Sparkles } from "lucide-react";

const PERKS = [
  { icon: Package, t: "تابعي كل طلباتك", d: "حالة كل أوردر لحظة بلحظة" },
  { icon: Gift, t: "عروض حصرية", d: "خصومات بتوصل للأعضاء الأول" },
  { icon: ShieldCheck, t: "دفع أسرع", d: "عنوانك وبياناتك محفوظين" },
];

export function AuthShell({ title, sub, children, footer }: { title: string; sub: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="soft-wash relative overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div className="container-z relative grid min-h-[calc(100dvh-8.5rem)] items-center gap-10 py-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="card relative mx-auto w-full max-w-md p-7 shadow-[0_30px_70px_-30px_rgba(14,44,78,.35)] sm:p-9"
        >
          <div className="brand-stripe absolute inset-x-8 top-0 overflow-hidden rounded-b-full"><span /><span /><span /></div>
          <Link href="/" className="font-serif text-2xl tracking-[.25em]">ZONA</Link>
          <h1 className="mt-6 text-3xl font-extrabold">{title}</h1>
          <p className="mt-2 text-sm text-muted">{sub}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 border-t border-line pt-5 text-center text-sm text-muted">{footer}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bridal-card relative hidden overflow-hidden rounded-[2.5rem] p-10 text-white lg:block"
        >
          <div className="bridal-orb pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-[#14b8a6]/40 blur-[100px]" />
          <div className="bridal-orb pointer-events-none absolute -bottom-24 right-0 size-72 rounded-full bg-[#fbbf24]/25 blur-[100px] [animation-delay:-5s]" />
          <span className="relative inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold ring-1 ring-white/15">
            <Sparkles className="size-3.5 text-[#fbbf24]" /> <span className="font-serif italic tracking-[.25em]">ZONA MEMBERS</span>
          </span>
          <h2 className="relative mt-5 text-4xl font-extrabold leading-tight">
            انضمي لعيلة <span className="text-gold-shimmer">ZONA</span>
          </h2>
          <p className="relative mt-3 max-w-sm leading-7 text-white/70">حساب واحد يخليكي تتابعي طلباتك، وتطلبي أسرع، وتوصلك العروض قبل أي حد.</p>

          <div className="relative mt-8 grid grid-cols-3 gap-3">
            {["/products/p04.webp", "/products/p03.webp", "/products/p25.webp"].map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 40, rotate: i === 1 ? 0 : i === 0 ? -6 : 6 }}
                animate={{ opacity: 1, y: i === 1 ? -14 : 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.8 }}
                className="aspect-[3/4] overflow-hidden rounded-2xl border-4 border-white/90 shadow-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full object-cover" />
              </motion.div>
            ))}
          </div>

          <div className="relative mt-8 space-y-3">
            {PERKS.map((p, i) => (
              <motion.div key={p.t} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }} className="flex items-center gap-3 rounded-2xl bg-white/[.06] p-3 ring-1 ring-white/10">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0e2c4e]"><p.icon className="size-5 text-[#fbbf24]" /></span>
                <span>
                  <b className="block text-sm">{p.t}</b>
                  <span className="text-xs text-white/60">{p.d}</span>
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function Field({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2 px-4 transition focus-within:border-primary focus-within:bg-surface focus-within:ring-4 focus-within:ring-primary/10">
        <Icon className="size-4 shrink-0 text-primary" />
        {children}
      </div>
    </div>
  );
}

export const fieldInput = "w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted/70";
