"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Sparkles, Star, Truck } from "lucide-react";

export function Hero({ title, subtitle, images }: { title: string; subtitle: string; images: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % images.length), 4200);
    return () => clearInterval(t);
  }, [images.length]);

  const words = title.split(" ");

  return (
    <section ref={ref} className="grain relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#effcfa] via-white to-[#fffaf0] dark:from-[#0a2636] dark:via-[#07182b] dark:to-[#0b1f33]" />
      <div className="grid-lines absolute inset-0" />
      <div className="pointer-events-none absolute -right-20 top-20 size-96 rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 size-96 rounded-full bg-gold/20 blur-[110px]" />
      <motion.p
        style={{ y: yText }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4 }}
        className="pointer-events-none absolute inset-x-0 top-24 select-none text-center font-serif text-[22vw] leading-none tracking-[.1em] text-primary/[.07] dark:text-white/[.03]"
      >
        ZONA
      </motion.p>

      <div className="container-z relative grid min-h-[calc(100dvh-8.5rem)] items-center gap-10 py-12 lg:grid-cols-2">
        <motion.div style={{ y: yText, opacity: fade }} className="relative z-10 text-center lg:text-right">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="chip mb-6 border border-primary/30 bg-surface/70 text-primary backdrop-blur"
          >
            <Sparkles className="size-3.5" /> كوليكشن ٢٠٢٦ الجديد
          </motion.span>
          <h1 className="text-5xl font-extrabold leading-[1.15] sm:text-6xl lg:text-7xl">
            {words.map((w, k) => (
              <motion.span
                key={k}
                initial={{ opacity: 0, y: 50, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.2 + k * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block ${k === words.length - 1 ? "text-gradient animate-shimmer" : ""}`}
              >
                {w}&nbsp;
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mx-auto mt-6 max-w-lg text-lg leading-8 text-muted lg:mx-0"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start"
          >
            <Link href="/shop" className="btn-primary px-8 py-4 text-base">
              تسوقي الآن <ArrowLeft className="size-4" />
            </Link>
            <Link href="/shop?category=bridal" className="btn-ghost px-8 py-4 text-base">تشكيلة العرايس</Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-10 flex justify-center gap-8 lg:justify-start"
          >
            {[
              ["+5K", "عميلة سعيدة"],
              ["27", "محافظة بنشحن لها"],
              ["4.9", "تقييم العملاء"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-serif text-3xl font-bold text-ink">{n}</p>
                <p className="text-xs text-muted">{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div style={{ y: yImg }} className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-lg">
          <motion.div
            initial={{ opacity: 0, rotate: 8, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 6, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute inset-0 translate-x-6 rounded-[3rem] bg-gradient-to-br from-primary to-[#0e2c4e]"
          />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-hidden rounded-[3rem] border-4 border-surface shadow-2xl shadow-primary/30"
          >
            <AnimatePresence mode="popLayout">
              <motion.img
                key={images[i]}
                src={images[i]}
                alt="ZONA"
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0 size-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, k) => (
                <button key={k} onClick={() => setI(k)} aria-label={`صورة ${k + 1}`} className={`h-1.5 rounded-full bg-white transition-all ${k === i ? "w-6" : "w-1.5 opacity-60"}`} />
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute -right-4 top-10 animate-float rounded-2xl border border-line bg-surface/90 p-3 shadow-xl backdrop-blur sm:-right-10"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary"><Truck className="size-4" /></span>
              <div>
                <p className="text-xs font-extrabold">شحن سريع</p>
                <p className="text-[10px] text-muted">لكل المحافظات</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            style={{ animationDelay: "1.5s" }}
            className="absolute -left-4 bottom-16 animate-float rounded-2xl border border-line bg-surface/90 p-3 shadow-xl backdrop-blur sm:-left-10"
          >
            <div className="flex items-center gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-3.5 fill-current" />)}
            </div>
            <p className="mt-1 text-xs font-extrabold">ستان فاخر ودانتيل</p>
          </motion.div>
        </motion.div>
      </div>

      <motion.div style={{ opacity: fade }} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted lg:flex">
        <span>انزلي تحت</span>
        <span className="flex h-9 w-5 justify-center rounded-full border-2 border-muted/50 pt-1.5">
          <motion.span animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="size-1.5 rounded-full bg-primary" />
        </span>
      </motion.div>
    </section>
  );
}
