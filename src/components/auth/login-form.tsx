"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, LogIn, User } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, Field, fieldInput } from "./auth-shell";

const safeNext = (n: string | null) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/account");

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ login, password }) });
    const d = await r.json();
    if (!r.ok) {
      setBusy(false);
      return toast.error(d.error);
    }
    toast.success(`أهلاً بيكي يا ${d.customer.name.split(" ")[0]} 💗`);
    router.replace(next);
    router.refresh();
  };

  return (
    <AuthShell
      title="أهلاً بيكي تاني 👋"
      sub="سجّلي دخولك برقم الموبايل أو البريد الإلكتروني"
      footer={<>لسه معندكيش حساب؟ <Link href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-primary hover:underline">اعملي حساب جديد</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field icon={User} label="رقم الموبايل أو البريد">
          <input required autoFocus value={login} onChange={(e) => setLogin(e.target.value)} placeholder="01xxxxxxxxx" className={fieldInput} autoComplete="username" />
        </Field>
        <Field icon={Lock} label="كلمة السر">
          <input required type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={fieldInput} autoComplete="current-password" />
          <button type="button" onClick={() => setShow(!show)} className="text-muted hover:text-primary" aria-label="إظهار كلمة السر">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
        </Field>
        <button disabled={busy} className="btn-primary w-full py-4 text-base">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <LogIn className="size-5" />} دخول
        </button>
      </form>
    </AuthShell>
  );
}
