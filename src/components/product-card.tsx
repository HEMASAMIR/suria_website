"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";
import { egp } from "@/lib/format";
import type { PublicProduct } from "@/lib/store";

export function ProductCard({ p }: { p: PublicProduct }) {
  const { add } = useCart();
  const off = p.comparePrice && p.comparePrice > p.price ? Math.round((1 - p.price / p.comparePrice) * 100) : 0;
  const out = p.stock <= 0;

  const quickAdd = () =>
    add({
      productId: p.id, slug: p.slug, name: p.name, image: p.images[0], price: p.price, qty: 1, stock: p.stock,
      color: p.colors[0]?.name, size: p.sizes[0],
    });

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="group relative">
      <Link href={`/product/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.images[0]} alt={p.name} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-110" />
        {p.images[1] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images[1]} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-0 transition duration-700 group-hover:opacity-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {p.isNew && <span className="chip bg-ink text-bg">جديد</span>}
          {off > 0 && <span className="chip bg-primary text-white">-{off}%</span>}
          {out && <span className="chip bg-zinc-500 text-white">نفدت الكمية</span>}
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-white/85 px-2.5 py-1 font-serif text-[11px] font-semibold text-black backdrop-blur">
          #{p.model}
        </span>
      </Link>
      <div className="pointer-events-none absolute inset-x-3 bottom-[5.5rem] flex translate-y-4 gap-2 opacity-0 transition duration-500 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        <button disabled={out} onClick={quickAdd} className="btn-primary flex-1 py-2.5 text-xs">
          <ShoppingBag className="size-4" /> أضيفي للسلة
        </button>
        <Link href={`/product/${p.slug}`} className="grid size-10 place-items-center rounded-full bg-white text-black shadow-lg transition hover:bg-ink hover:text-bg" aria-label="عرض">
          <Eye className="size-4" />
        </Link>
      </div>
      <div className="px-1 pt-3">
        <Link href={`/product/${p.slug}`} className="line-clamp-1 font-bold transition hover:text-primary">{p.name}</Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-primary">{egp(p.price)}</span>
            {off > 0 && <span className="text-xs text-muted line-through">{egp(p.comparePrice!)}</span>}
          </div>
          <div className="flex -space-x-1.5 space-x-reverse">
            {p.colors.slice(0, 4).map((c) => (
              <span key={c.name} title={c.name} className="size-4 rounded-full border-2 border-bg shadow-sm" style={{ background: c.hex }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
