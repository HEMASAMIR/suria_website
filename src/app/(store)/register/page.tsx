import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { currentCustomer } from "@/lib/customers";

export const metadata: Metadata = { title: "حساب جديد" };

export default async function RegisterPage() {
  if (await currentCustomer()) redirect("/account");
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
