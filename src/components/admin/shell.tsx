"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgePercent, ExternalLink, Users, FolderTree, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Package, Receipt, Settings, ShoppingCart, Truck, X,
} from "lucide-react";
import { ThemeToggle } from "../theme-toggle";

const NAV = [
  { href: "/admin", label: "لوحة التحكم والأرباح", icon: LayoutDashboard },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/customers", label: "العملاء", icon: Users },
  { href: "/admin/categories", label: "الأقسام", icon: FolderTree },
  { href: "/admin/shipping", label: "الشحن والمحافظات", icon: Truck },
  { href: "/admin/coupons", label: "أكواد الخصم", icon: BadgePercent },
  { href: "/admin/expenses", label: "المصروفات", icon: Receipt },
  { href: "/admin/testimonials", label: "آراء العملاء", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
];

export function AdminShell({ children, pending }: { children: React.ReactNode; pending: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  };

  const Side = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-6">
        <Link href="/admin" className="font-serif text-2xl tracking-[.2em]">
          ZONA <span className="rounded-full bg-primary px-2 py-0.5 align-middle font-sans text-[10px] tracking-normal text-white">Admin</span>
        </Link>
        <button onClick={() => setOpen(false)} className="lg:hidden"><X className="size-5" /></button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV.map((n) => {
          const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${active ? "text-white" : "text-muted hover:bg-primary-soft hover:text-primary"}`}>
              {active && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-2xl bg-primary shadow-lg shadow-primary/30" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <n.icon className="relative size-[18px]" />
              <span className="relative flex-1">{n.label}</span>
              {n.href === "/admin/orders" && pending > 0 && <span className={`relative rounded-full px-2 text-xs ${active ? "bg-white text-primary" : "bg-primary text-white"}`}>{pending}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-line p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-muted hover:bg-primary-soft hover:text-primary"><ExternalLink className="size-[18px]" /> عرض المتجر</Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-muted hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/10"><LogOut className="size-[18px]" /> تسجيل الخروج</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface-2/50">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-72 border-l border-line bg-surface lg:block">{Side}</aside>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }} className="fixed inset-y-0 right-0 z-50 w-72 bg-surface lg:hidden">{Side}</motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="lg:mr-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-bg/80 px-4 backdrop-blur-xl sm:px-8">
          <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full border border-line lg:hidden"><Menu className="size-5" /></button>
          <p className="hidden text-sm text-muted sm:block">أهلاً بيك 👋 — إدارة متجر ZONA</p>
          <ThemeToggle />
        </header>
        <motion.main key={pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-4 sm:p-8">
          {children}
        </motion.main>
      </div>
    </div>
  );
}
