"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import { navFor } from "./nav";
import { ImagePlus, Loader2, Trash2, X, GripVertical } from "lucide-react";
import { toast } from "sonner";

export async function api<T = unknown>(url: string, method = "GET", body?: unknown): Promise<T> {
  const r = await fetch(url, { method, body: body === undefined ? undefined : JSON.stringify(body), headers: { "Content-Type": "application/json" } });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401) {
    window.location.assign(new URL("/admin/login", window.location.origin));
  }
  if (!r.ok) throw new Error(d.error || "حصل خطأ");
  return d as T;
}

export function useCollection<T extends { id: string }>(name: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      setItems(await api<T[]>(`/api/admin/${name}`));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [name]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    load();
  }, [load]);

  const save = async (item: Partial<T>, id?: string) => {
    const saved = id ? await api<T>(`/api/admin/${name}/${id}`, "PUT", item) : await api<T>(`/api/admin/${name}`, "POST", item);
    setItems((prev) => (id ? prev.map((x) => (x.id === id ? saved : x)) : [saved, ...prev]));
    return saved;
  };
  const remove = async (id: string) => {
    await api(`/api/admin/${name}/${id}`, "DELETE");
    setItems((prev) => prev.filter((x) => x.id !== id));
  };
  return { items, setItems, loading, load, save, remove };
}

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  const nav = navFor(usePathname());
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-8 overflow-hidden rounded-[2rem] border border-line bg-surface/80 p-5 shadow-[0_20px_50px_-30px_rgba(14,44,78,.35)] backdrop-blur sm:p-6"
    >
      <div className="pointer-events-none absolute -left-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(20,184,166,.08)_50%,transparent_60%)] bg-[length:250%_100%] animate-shimmer" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, delay: 0.1 }}
            className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[#0e2c4e] text-white shadow-lg shadow-primary/30"
          >
            <nav.icon className="size-6" />
            <span className="absolute -left-1 -top-1 size-3 rounded-full bg-gold ring-4 ring-surface" />
          </motion.span>
          <div>
            <p className="text-gradient animate-shimmer font-serif text-[11px] font-bold italic tracking-[.3em]">{nav.kicker}</p>
            <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
            {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    </motion.div>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={onClose}>
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-bg shadow-2xl sm:rounded-[2rem] ${wide ? "sm:max-w-4xl" : "sm:max-w-xl"}`}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="text-lg font-extrabold">{title}</h3>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-full border border-line hover:border-primary"><X className="size-4" /></button>
            </div>
            <div className="overflow-y-auto p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Confirm({ open, onClose, onConfirm, text }: { open: boolean; onClose: () => void; onConfirm: () => Promise<void> | void; text: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal open={open} onClose={onClose} title="تأكيد الحذف">
      <p className="text-muted">{text}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="btn-ghost py-2.5">إلغاء</button>
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
              onClose();
            } finally {
              setBusy(false);
            }
          }}
          className="btn bg-rose-600 py-2.5 text-white hover:bg-rose-700"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} حذف
        </button>
      </div>
    </Modal>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="inline-flex items-center gap-2 text-sm font-bold">
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-primary" : "bg-line"}`}>
        <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className={`absolute top-0.5 size-5 rounded-full bg-white shadow ${checked ? "left-0.5" : "right-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

export function ImagesInput({ value, onChange, single }: { value: string[]; onChange: (v: string[]) => void; single?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const [drag, setDrag] = useState<number | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) return toast.error(d.error);
    onChange(single ? d.urls.slice(0, 1) : [...value, ...d.urls]);
    toast.success("تم رفع الصور");
  };

  const move = (from: number, to: number) => {
    const next = [...value];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((src, i) => (
          <div
            key={src + i}
            draggable={!single}
            onDragStart={() => setDrag(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drag !== null && move(drag, i)}
            className="group relative h-28 w-24 overflow-hidden rounded-2xl border border-line bg-surface-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="size-full object-cover" />
            {i === 0 && !single && <span className="absolute bottom-1 right-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">رئيسية</span>}
            {!single && <GripVertical className="absolute left-1 top-1 size-4 cursor-grab text-white drop-shadow" />}
            <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-rose-600 text-white opacity-0 transition group-hover:opacity-100">
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {(!single || value.length === 0) && (
          <button type="button" onClick={() => ref.current?.click()} className="grid h-28 w-24 place-items-center rounded-2xl border-2 border-dashed border-line text-muted transition hover:border-primary hover:text-primary">
            {busy ? <Loader2 className="size-6 animate-spin" /> : <span className="text-center text-xs"><ImagePlus className="mx-auto mb-1 size-6" />رفع صور</span>}
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" multiple={!single} hidden onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
      <div className="mt-3 flex gap-2">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="أو الصقي رابط صورة" dir="ltr" className="input py-2 text-xs" />
        <button type="button" onClick={() => { if (url.trim()) { onChange(single ? [url.trim()] : [...value, url.trim()]); setUrl(""); } }} className="btn-ghost shrink-0 px-4 py-2 text-xs">إضافة</button>
      </div>
    </div>
  );
}

export function ActiveChip({ on, yes, no }: { on: boolean; yes: string; no: string }) {
  return (
    <span className={`chip ${on ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-300"}`}>
      {on ? yes : no}
    </span>
  );
}

/** Animates the numeric part of a formatted value (e.g. "1,998 ج.م", "39%") from 0. */
export function CountUp({ value }: { value: string }) {
  const m = value.match(/-?[\d,]+(\.\d+)?/);
  const target = m ? Number(m[0].replace(/,/g, "")) : NaN;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || Number.isNaN(target)) return;
    const c = animate(0, target, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(v) });
    return () => c.stop();
  }, [inView, target]);
  if (!m || Number.isNaN(target)) return <span ref={ref}>{value}</span>;
  const shown = Math.round(n).toLocaleString("en-US");
  return <span ref={ref}>{value.replace(m[0], shown)}</span>;
}

export function StatCard({ label, value, tone = "", hint, icon: Icon }: { label: string; value: string; tone?: string; hint?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className="spotlight glow-border group relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-5 shadow-[0_15px_40px_-30px_rgba(14,44,78,.4)] transition-shadow hover:shadow-[0_25px_50px_-25px_rgba(13,148,136,.35)]"
    >
      <span className="pointer-events-none absolute -bottom-10 -left-10 size-28 rounded-full bg-primary/5 transition duration-500 group-hover:scale-150 group-hover:bg-primary/10" />
      {Icon && (
        <span className="absolute left-4 top-4 grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[#0e2c4e] text-white shadow-lg shadow-primary/25 transition duration-500 group-hover:-rotate-6 group-hover:scale-110">
          <Icon className="size-5" />
        </span>
      )}
      <p className="relative text-xs font-bold text-muted">{label}</p>
      <p className={`relative mt-2 text-2xl font-extrabold ${tone}`}><CountUp value={value} /></p>
      {hint && <p className="relative mt-1 text-xs text-muted">{hint}</p>}
    </motion.div>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="card relative overflow-hidden py-16 text-center">
      <span className="mx-auto grid size-16 animate-float place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-gold/15 text-2xl">✨</span>
      <p className="mt-4 font-bold text-muted">{text}</p>
    </div>
  );
}

export function Skeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 animate-shimmer rounded-2xl bg-[linear-gradient(90deg,var(--surface-2),var(--surface),var(--surface-2))] bg-[length:200%_100%]" />
      ))}
    </div>
  );
}
