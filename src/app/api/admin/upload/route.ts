import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { UPLOAD_DIR } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/admin-guard";

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "مفيش صور" }, { status: 400 });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const urls: string[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    const name = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}.webp`;
    const buf = Buffer.from(await file.arrayBuffer());
    await sharp(buf).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(UPLOAD_DIR, name));
    urls.push(`/uploads/${name}`);
  }
  return NextResponse.json({ urls });
}
