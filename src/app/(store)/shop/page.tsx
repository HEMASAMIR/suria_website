import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopGrid } from "@/components/shop-grid";
import { Reveal } from "@/components/motion";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "كل المنتجات" };

export default async function ShopPage() {
  const { products, categories } = await getStore();
  return (
    <>
      <section className="soft-wash relative overflow-hidden py-16 text-center">
        <div className="grid-lines pointer-events-none absolute inset-0" />
        <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none font-serif text-[16vw] leading-none text-primary/[.07] dark:text-white/[.03]">SHOP</p>
        <Reveal className="relative">
          <span className="font-serif text-sm italic tracking-[.3em] text-primary">THE COLLECTION</span>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">تشكيلة <span className="text-gradient animate-shimmer">ZONA</span></h1>
          <p className="mt-3 text-muted">كل قطعة متصممة عشان تحسسك بالنعومة والثقة</p>
        </Reveal>
      </section>
      <section className="container-z py-12">
        <Suspense>
          <ShopGrid products={products} categories={categories} />
        </Suspense>
      </section>
    </>
  );
}
