import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import { ProductView } from "@/components/product-view";
import { ProductCard } from "@/components/product-card";
import { SectionTitle, Stagger, StaggerItem } from "@/components/motion";
import { getStore } from "@/lib/store";

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getStore();
  const p = products.find((x) => x.slug === slug);
  return p ? { title: p.name, description: p.description, openGraph: { images: p.images.slice(0, 1) } } : {};
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const { products, categories, settings } = await getStore();
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const cat = categories.find((c) => c.id === p.categoryId);
  const related = products.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4);

  return (
    <div className="container-z py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-primary">الرئيسية</Link>
        <ChevronLeft className="size-4" />
        <Link href="/shop" className="hover:text-primary">المنتجات</Link>
        {cat && (
          <>
            <ChevronLeft className="size-4" />
            <Link href={`/shop?category=${cat.slug}`} className="hover:text-primary">{cat.name}</Link>
          </>
        )}
      </nav>
      <ProductView p={p} categoryName={cat?.name ?? ""} whatsapp={settings.whatsapp} returnDays={settings.returnDays} />
      {related.length > 0 && (
        <section className="mt-24">
          <SectionTitle kicker="YOU MAY ALSO LIKE" title="ممكن يعجبك كمان" />
          <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((r) => (
              <StaggerItem key={r.id}><ProductCard p={r} /></StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
    </div>
  );
}
