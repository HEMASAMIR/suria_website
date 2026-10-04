"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if (!r.ok) {
      setBusy(false);
      return toast.error((await r.json()).error);
    }
    toast.success("أهلاً بيك في لوحة التحكم ✨");
    router.replace("/admin");
    router.refresh();
  };

  return (
    <div className="grain relative grid min-h-dvh place-items-center overflow-hidden bg-gradient-to-b from-[#effcfa] via-white to-[#fffaf0] dark:from-[#0a2636] dark:via-[#07182b] dark:to-[#0b1f33] p-4">
      <div className="absolute left-4 top-4"><ThemeToggle /></div>
      <p className="pointer-events-none absolute select-none font-serif text-[28vw] leading-none text-primary/[.07] dark:text-white/[.03]">ZONA</p>
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="card relative w-full max-w-sm p-8 shadow-2xl shadow-primary/15"
      >
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/40"><Lock className="size-7" /></span>
        <h1 className="mt-5 text-center font-serif text-3xl tracking-[.2em]">ZONA</h1>
        <p className="mt-1 text-center text-sm text-muted">تسجيل دخول لوحة التحكم</p>
        <label className="label mt-8">البريد الإلكتروني</label>
        <div className="relative mb-4">
          <input autoFocus type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-12 text-right" placeholder="admin@zona.com" autoComplete="username" />
          <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
        </div>
        <label className="label">كلمة المرور</label>
        <div className="relative">
          <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-12" placeholder="••••••••" />
          <button type="button" onClick={() => setShow(!show)} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
        </div>
        <button disabled={busy || !password || !email} className="btn-primary mt-6 w-full py-3.5">{busy && <Loader2 className="size-4 animate-spin" />} دخول</button>
      </motion.form>
    </div>
  );
}
