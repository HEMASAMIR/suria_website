import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { getStore } from "@/lib/store";
import { currentCustomer } from "@/lib/customers";

export const metadata: Metadata = { title: "إتمام الطلب" };

export default async function CheckoutPage() {
  const { shipping, settings } = await getStore();
  const me = await currentCustomer();
  return (
    <div className="container-z py-12">
      <div className="mb-10 text-center">
        <span className="font-serif text-sm italic tracking-[.3em] text-primary">CHECKOUT</span>
        <h1 className="mt-2 text-4xl font-extrabold">إتمام الطلب</h1>
      </div>
      <CheckoutForm zones={shipping} settings={settings} me={me} />
    </div>
  );
}
