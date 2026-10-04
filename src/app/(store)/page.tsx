import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Categories, VideoReels, WordMarquee } from "@/components/home/sections";
import { BridalBanner, Features, Testimonials } from "@/components/home/showcase";
import { Reveal, SectionTitle, Stagger, StaggerItem } from "@/components/motion";
import { ProductCard } from "@/components/product-card";
import { getStore } from "@/lib/store";

export default async function Home() {
  const { settings, categories, products, testimonials } = await getStore();
  const counts = Object.fromEntries(categories.map((c) => [c.id, products.filter((p) => p.categoryId === c.id).length]));
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const fresh = products.filter((p) => p.isNew).slice(0, 8);
  const bridalCat = categories.find((c) => c.slug === "bridal");
  const bridal = products.filter((p) => p.categoryId === bridalCat?.id);

  return (
    <>
      <Hero title={settings.heroTitle} subtitle={settings.heroSubtitle} images={settings.heroImages} />
      <WordMarquee />

      <section className="container-z py-24">
        <SectionTitle kicker="SHOP BY CATEGORY" title="تسوقي حسب القسم" sub="من البيجامات اليومية لحد تشكيلة العرايس، كل اللي محتاجاه في مكان واحد" />
        <Categories categories={categories} counts={counts} />
      </section>

      <section className="container-z pb-24">
        <SectionTitle kicker="BEST SELLERS" title="الأكثر طلبًا" sub="القطع اللي عملاؤنا بيحبوها أكتر" />
        <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <StaggerItem key={p.id}><ProductCard p={p} /></StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-12 text-center">
          <Link href="/shop" className="btn-dark px-8 py-4">شوفي كل المنتجات <ArrowLeft className="size-4" /></Link>
        </Reveal>
      </section>

      <section className="pb-24">
        <BridalBanner image={bridal[0]?.images[0] ?? "/products/p03.webp"} image2={bridal[1]?.images[0] ?? "/products/p17.webp"} />
      </section>

      {settings.videos.length > 0 && (
        <section className="pb-24">
          <SectionTitle kicker="ZONA REELS" title="شوفيها على الطبيعة" sub="فيديوهات حقيقية لمنتجاتنا قبل ما تطلبي" />
          <VideoReels videos={settings.videos} />
        </section>
      )}

      {fresh.length > 0 && (
        <section className="container-z pb-24">
          <SectionTitle kicker="NEW ARRIVALS" title="وصل حديثًا" />
          <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {fresh.map((p) => (
              <StaggerItem key={p.id}><ProductCard p={p} /></StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <section className="container-z pb-24">
        <SectionTitle kicker="WHY ZONA" title="ليه تختاري ZONA؟" sub="تفاصيل صغيرة بتفرق في تجربتك من أول طلب لحد ما يوصلك" />
        <Features />
      </section>

      {testimonials.length > 0 && (
        <section className="soft-wash relative overflow-hidden py-24">
          <div className="grid-lines pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -right-32 top-20 size-96 rounded-full bg-primary/15 blur-[120px]" />
          <div className="pointer-events-none absolute -left-32 bottom-10 size-96 rounded-full bg-gold/15 blur-[120px]" />
          <div className="relative">
            <Testimonials items={testimonials} />
          </div>
        </section>
      )}

      <section className="container-z pt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-welcome p-10 text-center text-white sm:p-16">
            <p className="pointer-events-none absolute -bottom-10 left-0 right-0 select-none font-serif text-[9rem] leading-none text-white/10">ZONA</p>
            <h2 className="relative text-3xl font-extrabold sm:text-4xl">محتاجة مساعدة في المقاس أو اللون؟</h2>
            <p className="relative mx-auto mt-3 max-w-lg text-white/85">فريقنا موجود على واتساب يساعدك تختاري الأنسب ليكي</p>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="btn relative mt-8 bg-white px-8 py-4 text-primary hover:-translate-y-0.5">
              كلمينا على واتساب
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
