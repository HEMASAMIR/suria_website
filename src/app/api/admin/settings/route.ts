import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { mutateDB, readDB } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return NextResponse.json((await readDB()).settings);
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const data = await req.json();
  const settings = await mutateDB((db) => {
    db.settings = { ...db.settings, ...data };
    return db.settings;
  });
  revalidatePath("/", "layout");
  return NextResponse.json(settings);
}
