import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { mutateDB, readDB, uid } from "@/lib/db";
import { COLLECTIONS, isAdmin, isCollection, unauthorized } from "@/lib/admin-guard";

export async function GET(_req: Request, ctx: RouteContext<"/api/admin/[collection]">) {
  if (!(await isAdmin())) return unauthorized();
  const { collection } = await ctx.params;
  if (!isCollection(collection)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const db = await readDB();
  return NextResponse.json(db[collection]);
}

export async function POST(req: Request, ctx: RouteContext<"/api/admin/[collection]">) {
  if (!(await isAdmin())) return unauthorized();
  const { collection } = await ctx.params;
  if (!isCollection(collection) || collection === "orders")
    return NextResponse.json({ error: "not allowed" }, { status: 400 });
  const data = await req.json();
  const item = await mutateDB((db) => {
    const doc = { ...data, id: uid(COLLECTIONS[collection]) };
    if (collection === "products") {
      doc.createdAt = new Date().toISOString();
      doc.slug = doc.slug || `zona-${String(doc.model || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
    }
    if (collection === "categories" && !doc.slug) doc.slug = `cat-${Date.now().toString(36)}`;
    (db[collection] as { id: string }[]).unshift(doc);
    return doc;
  });
  revalidatePath("/", "layout");
  return NextResponse.json(item);
}
