import "server-only";
import { connection } from "next/server";
import { readDB } from "./db";

/** Public, always-fresh snapshot of the catalogue (costs stripped). */
export async function getStore() {
  await connection();
  const db = await readDB();
  const categories = db.categories.filter((c) => c.active).sort((a, b) => a.order - b.order);
  const activeCats = new Set(categories.map((c) => c.id));
  const products = db.products
    .filter((p) => p.active && activeCats.has(p.categoryId))
    .map((p) => {
      const { cost, ...rest } = p;
      void cost;
      return rest;
    });
  return {
    settings: db.settings,
    categories,
    products,
    shipping: db.shipping.filter((s) => s.active),
    testimonials: db.testimonials.filter((t) => t.active),
  };
}

export type PublicProduct = Awaited<ReturnType<typeof getStore>>["products"][number];
