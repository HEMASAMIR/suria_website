import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { mutateDB } from "@/lib/db";
import { isAdmin, isCollection, unauthorized } from "@/lib/admin-guard";
import { applyStatus } from "@/lib/orders";
import { publicCustomer } from "@/lib/customers";
import type { Customer, Order } from "@/lib/types";

type Ctx = RouteContext<"/api/admin/[collection]/[id]">;

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { collection, id } = await ctx.params;
  if (!isCollection(collection)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const data = await req.json();
  try {
    const item = await mutateDB((db) => {
      const list = db[collection] as { id: string }[];
      const i = list.findIndex((x) => x.id === id);
      if (i < 0) throw new Error("العنصر غير موجود");
      if (collection === "orders") {
        const order = list[i] as Order;
        if (data.status) applyStatus(db, order, data.status, data.note);
        if (data.customer) order.customer = { ...order.customer, ...data.customer };
        return order;
      }
      if (collection === "customers") {
        delete data.passwordHash;
        list[i] = { ...list[i], ...data, id };
        return publicCustomer(list[i] as Customer);
      }
      list[i] = { ...list[i], ...data, id };
      return list[i];
    });
    revalidatePath("/", "layout");
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { collection, id } = await ctx.params;
  if (!isCollection(collection)) return NextResponse.json({ error: "not found" }, { status: 404 });
  await mutateDB((db) => {
    if (collection === "orders") {
      const order = db.orders.find((o) => o.id === id);
      if (order) applyStatus(db, order, "cancelled");
    }
    const lists = db as unknown as Record<string, { id: string }[]>;
    lists[collection] = lists[collection].filter((x) => x.id !== id);
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
