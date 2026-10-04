import { connection } from "next/server";
import { Dashboard } from "@/components/admin/dashboard";
import { readDB } from "@/lib/db";

export default async function AdminHome() {
  await connection();
  const db = await readDB();
  return (
    <Dashboard
      orders={db.orders}
      expenses={db.expenses}
      now={new Date().getTime()}
      lowStock={db.products.filter((p) => p.active && p.stock <= 5).map((p) => ({ id: p.id, name: p.name, image: p.images[0], stock: p.stock, model: p.model }))}
    />
  );
}
