import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountView } from "@/components/auth/account-view";
import { currentCustomer } from "@/lib/customers";
import { readDB } from "@/lib/db";

export const metadata: Metadata = { title: "حسابي" };

export default async function AccountPage() {
  const me = await currentCustomer();
  if (!me) redirect("/login?next=/account");
  const db = await readDB();
  const orders = db.orders
    .filter((o) => o.customerId === me.id)
    .map((o) => ({ ...o, items: o.items.map((it) => ({ ...it, cost: 0 })) }));
  const governorates = db.shipping.filter((s) => s.active).map((s) => s.governorate);
  return <AccountView me={me} orders={orders} governorates={governorates} />;
}
