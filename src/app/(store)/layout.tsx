import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { ScrollProgress } from "@/components/motion";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { BackToTop } from "@/components/footer-columns";
import { getStore } from "@/lib/store";
import { currentCustomer } from "@/lib/customers";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const { settings, categories } = await getStore();
  const me = await currentCustomer();
  return (
    <>
      <ScrollProgress />
      <Header announcement={settings.announcement} categories={categories} storeName={settings.storeName} user={me ? { name: me.name } : null} />
      <main>{children}</main>
      <Footer settings={settings} categories={categories} />
      <CartDrawer freeShippingThreshold={settings.freeShippingThreshold} categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
      <WhatsAppFab number={settings.whatsapp} />
      <BackToTop />
    </>
  );
}
