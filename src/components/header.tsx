"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnnouncementBar } from "./announcement-bar";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "./cart-context";
import type { Category } from "@/lib/types";

export function Header({ announcement, categories, storeName }: { announcement: string; categories: Category[]; storeName: string }) {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const nav = [
    { href: "/", label: "الرئيسية" },
    { href: "/shop", label: "كل المنتجات" },
    ...categories.slice(0, 3).map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name })),
    { href: "/track", label: "تتبع طلبك" },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <div className="sticky top-0 z-50">
      <div className="brand-stripe"><span /><span /><span /></div>
      <header
        className={`relative border-b transition-all duration-500 backdrop-blur-xl ${
          scrolled ? "border-line bg-bg/85 shadow-[0_10px_30px_-15px_rgba(14,44,78,.25)]" : "border-transparent bg-bg/60"
        }`}
      >
        <div className={`container-z flex items-center justify-between gap-4 transition-all duration-500 ${scrolled ? "h-16" : "h-[4.5rem]"}`}>
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={() => setMenu(true)} aria-label="القائمة" className="grid size-10 place-items-center rounded-full border border-line bg-surface">
              <Menu className="size-5" />
            </button>
          </div>
          <Logo name={storeName} />
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => {
              const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href.split("?")[0]) && n.href === "/shop";
              return (
                <Link key={n.href} href={n.href} className="group relative px-3 py-2 text-sm font-bold text-ink/80 transition hover:text-primary">
                  {n.label}
                  <span className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-center rounded-full bg-primary transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearch(true)} aria-label="بحث" className="grid size-10 place-items-center rounded-full border border-line bg-surface transition hover:border-primary hover:text-primary">
              <Search className="size-[18px]" />
            </button>
            <ThemeToggle />
            <button onClick={() => setOpen(true)} aria-label="السلة" className="relative grid size-10 place-items-center rounded-full bg-primary text-primary-ink shadow-lg shadow-primary/30 transition hover:scale-105">
              <ShoppingBag className="size-[18px]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -left-1 grid min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-extrabold text-bg ring-2 ring-bg"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>
      {announcement && <AnnouncementBar text={announcement} />}
      </div>

      <AnimatePresence>
        {menu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm" />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-[90] flex w-[82%] max-w-sm flex-col bg-bg p-6"
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo name={storeName} />
                <button onClick={() => setMenu(false)} className="grid size-10 place-items-center rounded-full border border-line"><X className="size-5" /></button>
              </div>
              <nav className="flex flex-col gap-1">
                {[...nav, ...categories.slice(3).map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name }))].map((n, i) => (
                  <motion.div key={n.href} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                    <Link href={n.href} onClick={() => setMenu(false)} className="block rounded-2xl px-4 py-3 text-lg font-bold hover:bg-primary-soft hover:text-primary">
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto flex items-center justify-between rounded-2xl bg-surface-2 p-4">
                <span className="text-sm font-bold">الوضع الليلي / النهاري</span>
                <ThemeToggle />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {search && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] grid place-items-start bg-bg/90 pt-32 backdrop-blur-xl" onClick={() => setSearch(false)}>
            <motion.form initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={submit} onClick={(e) => e.stopPropagation()} className="container-z max-w-2xl">
              <p className="mb-4 text-center font-serif text-sm italic tracking-[.3em] text-primary">SEARCH</p>
              <div className="flex items-center gap-3 rounded-full border-2 border-primary bg-surface px-6 py-2 shadow-2xl shadow-primary/20">
                <Search className="size-5 text-primary" />
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="دوري على بيجامة، روب، طقم عروسة..." className="flex-1 bg-transparent py-3 text-lg outline-none" />
                <button type="button" onClick={() => setSearch(false)}><X className="size-5" /></button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
