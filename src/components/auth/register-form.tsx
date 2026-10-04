"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, Field, fieldInput } from "./auth-shell";

const safeNext = (n: string | null) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/account");

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}
const LEVELS = [
  { l: "ضعيفة جدًا", c: "bg-rose-500" },
  { l: "ضعيفة", c: "bg-orange-500" },
  { l: "متوسطة", c: "bg-amber-400" },
  { l: "قوية", c: "bg-teal-500" },
  { l: "قوية جدًا", c: "bg-emerald-500" },
];

export function RegisterForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [f, setF] = useState({ name: "", phone: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const s = strength(f.password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password !== f.confirm) return toast.error("كلمتين السر مش زي بعض");
    setBusy(true);
    const r = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(f) });
    const d = await r.json();
    if (!r.ok) {
      setBusy(false);
      return toast.error(d.error);
    }
    toast.success("تم إنشاء حسابك 🎉", { description: "أهلاً بيكي في عيلة ZONA" });
    router.replace(next);
    router.refresh();
  };

  return (
    <AuthShell
      title="اعملي حسابك ✨"
      sub="أقل من دقيقة وتبقي من أعضاء ZONA"
      footer={<>عندك حساب؟ <Link href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-primary hover:underline">سجّلي دخولك</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field icon={User} label="الاسم بالكامل *">
          <input required autoFocus value={f.name} onChange={set("name")} placeholder="مثال: سارة محمد" className={fieldInput} autoComplete="name" />
        </Field>
        <Field icon={Phone} label="رقم الموبايل *">
          <input required dir="ltr" inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="01xxxxxxxxx" className={`${fieldInput} text-right`} autoComplete="tel" />
        </Field>
        <Field icon={Mail} label="البريد الإلكتروني (اختياري)">
          <input type="email" dir="ltr" value={f.email} onChange={set("email")} placeholder="name@email.com" className={`${fieldInput} text-right`} autoComplete="email" />
        </Field>
        <Field icon={Lock} label="كلمة السر *">
          <input required minLength={6} type={show ? "text" : "password"} value={f.password} onChange={set("password")} placeholder="6 حروف على الأقل" className={fieldInput} autoComplete="new-password" />
          <button type="button" onClick={() => setShow(!show)} className="text-muted hover:text-primary" aria-label="إظهار كلمة السر">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
        </Field>
        {f.password && (
          <div>
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.span key={i} initial={false} animate={{ opacity: i < s ? 1 : 0.25 }} className={`h-1.5 flex-1 rounded-full ${i < s ? LEVELS[s].c : "bg-line"}`} />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted">قوة كلمة السر: <b>{LEVELS[s].l}</b></p>
          </div>
        )}
        <Field icon={Lock} label="تأكيد كلمة السر *">
          <input required type={show ? "text" : "password"} value={f.confirm} onChange={set("confirm")} placeholder="اكتبيها تاني" className={fieldInput} autoComplete="new-password" />
        </Field>
        <button disabled={busy} className="btn-primary w-full py-4 text-base">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <UserPlus className="size-5" />} إنشاء الحساب
        </button>
      </form>
    </AuthShell>
  );
}
