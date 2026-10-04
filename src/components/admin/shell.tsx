"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronLeft, ExternalLink, LogOut, Menu, Plus, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { NAV_GROUPS, navFor } from "./nav";

function useGreeting() {
  const [g, setG] = useState<{ hello: string; date: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Africa/Cairo" }).format(now));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- time-of-day is only known on the client
    setG({
      hello: h < 12 ? "صباح الخير ☀️" : h < 18 ? "مساء النور 🌤️" : "مساء الخير 🌙",
      date: now.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Cairo" }),
    });
  }, []);
  return g;
}

/** Fade/slide every admin card into view while scrolling (works for all pages). */
function useAutoReveal(pathname: string) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -40px 0px" },
    );
    const scan = () =>
      document.querySelectorAll("main .card:not(.reveal), main section:not(.reveal)").forEach((el, i) => {
        el.classList.add("reveal");
        (el as HTMLElement).style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
        io.observe(el);
      });
    scan();
    const mo = new MutationObserver(scan);
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);
}

export function AdminShell({ children, pending }: { children: React.ReactNode; pending: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const greet = useGreeting();
  const current = navFor(pathname);
  useAutoReveal(pathname);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/login");
  };

  const Side = (
    <div className="admin-side relative flex h-full flex-col overflow-hidden text-white">
      <div className="bridal-orb pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#14b8a6]/30 blur-[90px]" />
      <div className="bridal-orb pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-[#fbbf24]/15 blur-[90px] [animation-delay:-6s]" />
      <div className="brand-stripe relative"><span /><span /><span /></div>

      <div className="relative flex items-center justify-between px-6 pb-4 pt-6">
        <Link href="/admin" className="group">
          <span className="text-gold-shimmer font-serif text-3xl tracking-[.22em]">ZONA</span>
          <span className="mt-1 flex items-center gap-1.5 text-[10px] font-bold tracking-[.3em] text-[#5eead4]/80">
            <Sparkles className="size-3" /> ADMIN STUDIO
          </span>
        </Link>
        <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full bg-white/10 lg:hidden"><X className="size-4" /></button>
      </div>

      <nav className="relative flex-1 space-y-5 overflow-y-auto px-3 pb-4 [scrollbar-width:none]">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title}>
            <p className="mb-1.5 px-4 text-[10px] font-extrabold tracking-wider text-white/35">{g.title}</p>
            <div className="space-y-0.5">
              {g.items.map((n, i) => {
                const active = current.href === n.href;
                return (
                  <motion.div key={n.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * (gi * 3 + i) }}>
                    <Link href={n.href} onClick={() => setOpen(false)} className={`group relative flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${active ? "text-white" : "text-white/60 hover:bg-white/[.06] hover:text-white"}`}>
                      {active && (
                        <motion.span layoutId="admin-nav" className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-l from-[#14b8a6]/90 to-[#0f766e]/70 shadow-lg shadow-[#14b8a6]/25 ring-1 ring-white/15" transition={{ type: "spring", stiffness: 400, damping: 32 }}>
                          <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,.25)_50%,transparent_65%)] bg-[length:250%_100%] animate-shimmer" />
                          <span className="absolute inset-y-2 right-0 w-1 rounded-l-full bg-[#fbbf24]" />
                        </motion.span>
                      )}
                      <span className={`relative grid size-8 place-items-center rounded-xl transition ${active ? "bg-white/15" : "bg-white/[.04] group-hover:bg-white/10"}`}>
                        <n.icon className={`size-4 ${active ? "text-[#fde68a]" : "text-[#5eead4]/80"}`} />
                      </span>
                      <span className="relative flex-1">{n.label}</span>
                      {n.href === "/admin/orders" && pending > 0 && (
                        <span className="relative grid min-w-6 place-items-center rounded-full bg-[#fbbf24] px-1.5 text-[11px] font-extrabold text-[#0e2c4e]">{pending}</span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative space-y-2 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/[.06] p-3 ring-1 ring-white/10">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#fcd34d] to-[#f59e0b] font-extrabold text-[#0e2c4e]">A</span>
          <span className="min-w-0 flex-1">
            <b className="block text-sm">مدير المتجر</b>
            <span className="flex items-center gap-1.5 text-[11px] text-white/50">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> متصل الآن
            </span>
          </span>
          <button onClick={logout} title="تسجيل الخروج" className="grid size-9 place-items-center rounded-xl text-white/60 transition hover:bg-rose-500/20 hover:text-rose-300"><LogOut className="size-4" /></button>
        </div>
        <Link href="/" target="_blank" className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 py-2.5 text-xs font-bold text-white/70 transition hover:border-[#5eead4]/50 hover:text-white">
          <ExternalLink className="size-3.5" /> عرض المتجر
        </Link>
      </div>
    </div>
  );

  return (
    <div className="soft-wash relative min-h-dvh">
      <div className="grid-lines pointer-events-none fixed inset-0 opacity-70" />
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-[17.5rem] lg:block">{Side}</aside>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }} className="fixed inset-y-0 right-0 z-50 w-[17.5rem] lg:hidden">{Side}</motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="relative lg:mr-[17.5rem]">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/75 backdrop-blur-xl">
          <div className="flex h-[4.5rem] items-center gap-3 px-4 sm:px-8">
            <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-2xl border border-line bg-surface lg:hidden"><Menu className="size-5" /></button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold">{greet?.hello ?? " "} <span className="font-bold text-muted">— أهلاً بيك في ZONA</span></p>
              <p className="flex items-center gap-1 truncate text-xs text-muted">
                {greet?.date ?? " "}
                <ChevronLeft className="size-3" />
                <span className="font-bold text-primary">{current.label}</span>
              </p>
            </div>
            <Link href="/admin/products" className="btn-primary hidden px-4 py-2.5 text-xs md:inline-flex"><Plus className="size-4" /> منتج جديد</Link>
            <Link href="/admin/orders" title="طلبات جديدة" className="relative grid size-10 place-items-center rounded-2xl border border-line bg-surface transition hover:border-primary hover:text-primary">
              <Bell className={`size-[18px] ${pending ? "origin-top animate-[ring_2.5s_ease-in-out_infinite]" : ""}`} />
              {pending > 0 && (
                <span className="absolute -left-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-extrabold text-white ring-2 ring-bg">{pending}</span>
              )}
            </Link>
            <Link href="/" target="_blank" title="عرض المتجر" className="hidden size-10 place-items-center rounded-2xl border border-line bg-surface transition hover:border-primary hover:text-primary sm:grid"><ExternalLink className="size-[18px]" /></Link>
            <ThemeToggle />
          </div>
        </header>
        <motion.main key={pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="relative p-4 sm:p-8">
          {children}
        </motion.main>
      </div>
    </div>
  );
}
