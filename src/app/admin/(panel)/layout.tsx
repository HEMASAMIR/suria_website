import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { isAdmin } from "@/lib/admin-guard";
import { readDB } from "@/lib/db";

export const metadata: Metadata = { title: "لوحة التحكم", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await connection();
  if (!(await isAdmin())) redirect("/admin/login");
  const db = await readDB();
  const pending = db.orders.filter((o) => o.status === "pending").length;
  return <AdminShell pending={pending}>{children}</AdminShell>;
}
