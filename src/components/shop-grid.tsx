"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./product-card";
import type { PublicProduct } from "@/lib/store";
import type { Category } from "@/lib/types";

const SORTS = [
  { v: "new", l: "الأحدث" },
  { v: "price-asc", l: "السعر: من الأقل" },
  { v: "price-desc", l: "السعر: من الأعلى" },
  { v: "offer", l: "العروض" },
];

export function ShopGrid({ products, categories }: { products: PublicProduct[]; categories: Category[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const category = sp.get("category") ?? "";
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [sort, setSort] = useState("new");
  const [color, setColor] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [panel, setPanel] = useState(false);

  const top = useMemo(() => Math.max(...products.map((p) => p.price), 0), [products]);
  const colors = useMemo(() => {
    const m = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => m.set(c.name, c.hex)));
    return [...m];
  }, [products]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(sp.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    router.replace(`/shop?${params}`, { scroll: false });
  };

  const list = useMemo(() => {
    const cat = categories.find((c) => c.slug === category);
    const term = q.trim().toLowerCase();
    const r = products.filter(
      (p) =>
        (!cat || p.categoryId === cat.id) &&
        (!term || p.name.toLowerCase().includes(term) || p.model.includes(term) || p.description.toLowerCase().includes(term)) &&
        (!color || p.colors.some((c) => c.name === color)) &&
        (!maxPrice || p.price <= maxPrice),
    );
    const sorted = [...r];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "new") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "offer") sorted.sort((a, b) => (b.comparePrice ? 1 : 0) - (a.comparePrice ? 1 : 0));
    return sorted;
  }, [products, categories, category, q, color, maxPrice, sort]);

  const Filters = (
    <div className="space-y-8">
      <div>
        <p className="label">الأقسام</p>
        <div className="flex flex-col gap-1">
          {[{ slug: "", name: "الكل" }, ...categories].map((c) => (
            <button key={c.slug} onClick={() => setCategory(c.slug)} className={`rounded-xl px-3 py-2 text-right text-sm font-bold transition ${category === c.slug ? "bg-primary text-white" : "hover:bg-primary-soft hover:text-primary"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      {colors.length > 0 && (
        <div>
          <p className="label">اللون</p>
          <div className="flex flex-wrap gap-2">
            {colors.map(([name, hex]) => (
              <button key={name} title={name} onClick={() => setColor(color === name ? "" : name)} className={`size-8 rounded-full border-2 transition ${color === name ? "scale-110 border-primary ring-2 ring-primary/30" : "border-line"}`} style={{ background: hex }} />
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="label">أقصى سعر: <b className="text-primary">{maxPrice || top} ج.م</b></p>
        <input type="range" min={0} max={top} step={50} value={maxPrice || top} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
      </div>
      {(color || maxPrice || category || q) && (
        <button onClick={() => { setColor(""); setMaxPrice(0); setQ(""); setCategory(""); }} className="btn-ghost w-full py-2">مسح الفلاتر</button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">
        <div className="card sticky top-24 p-5">{Filters}</div>
      </aside>
      <div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4">
            <Search className="size-4 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحثي باسم المنتج أو رقم الموديل" className="flex-1 bg-transparent py-3 text-sm outline-none" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto rounded-full">
            {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
          <button onClick={() => setPanel(true)} className="btn-ghost py-3 lg:hidden"><SlidersHorizontal className="size-4" /> فلترة</button>
        </div>
        <p className="mb-5 text-sm text-muted">{list.length} منتج</p>
        <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35 }}>
                <ProductCard p={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && (
          <div className="card py-20 text-center">
            <p className="text-lg font-bold">مفيش منتجات مطابقة 😔</p>
            <p className="mt-1 text-sm text-muted">جربي تغيّري الفلاتر</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {panel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)} className="fixed inset-0 z-[80] bg-black/40" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 260 }} className="fixed inset-x-0 bottom-0 z-[90] max-h-[85dvh] overflow-y-auto rounded-t-[2rem] bg-bg p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-extrabold">الفلاتر</h3>
                <button onClick={() => setPanel(false)}><X className="size-5" /></button>
              </div>
              {Filters}
              <button onClick={() => setPanel(false)} className="btn-primary mt-6 w-full">عرض {list.length} منتج</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
