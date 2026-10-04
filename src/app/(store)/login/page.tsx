import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { currentCustomer } from "@/lib/customers";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default async function LoginPage() {
  if (await currentCustomer()) redirect("/account");
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
