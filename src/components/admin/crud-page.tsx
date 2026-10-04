"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, LayoutGrid, List, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Confirm, EmptyState, ImagesInput, Modal, PageHeader, Skeleton, Toggle, useCollection } from "./ui";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "toggle" | "select" | "image" | "date";
  options?: { value: string; label: string }[];
  required?: boolean;
  full?: boolean;
  placeholder?: string;
};

export type Column<T> = { label: string; render: (row: T) => React.ReactNode; className?: string };

export type CardView = { image?: string; title: string; subtitle?: string; body?: React.ReactNode; badge?: React.ReactNode };

type Props<T> = {
  collection: string;
  title: string;
  sub?: string;
  singular: string;
  fields: Field[];
  columns: Column<T>[];
  defaults: Partial<T>;
  searchKeys?: (keyof T)[];
  sort?: (a: T, b: T) => number;
  summary?: (items: T[]) => React.ReactNode;
  /** When given, a gallery view is offered (and used by default). */
  card?: (row: T) => CardView;
};

type Row = { id: string; active?: boolean };

export function CrudPage<T extends { id: string }>({ collection, title, sub, singular, fields, columns, defaults, searchKeys = [], sort, summary, card }: Props<T>) {
  const { items, loading, save, remove } = useCollection<T>(collection);
  const [edit, setEdit] = useState<{ id?: string; data: Record<string, unknown> } | null>(null);
  const [del, setDel] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "table">(card ? "grid" : "table");
  const hasActive = fields.some((f) => f.key === "active");
  const [status, setStatus] = useState<"all" | "on" | "off">("all");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let r = term ? items.filter((it) => searchKeys.some((k) => String(it[k] ?? "").toLowerCase().includes(term))) : items;
    if (status !== "all") r = r.filter((it) => !!(it as unknown as Row).active === (status === "on"));
    return sort ? [...r].sort(sort) : r;
  }, [items, q, searchKeys, sort, status]);

  const openEdit = (row: T) =>
    setEdit({
      id: row.id,
      data: {
        ...(row as Record<string, unknown>),
        ...Object.fromEntries(fields.filter((f) => f.type === "image").map((f) => [f.key, (row as Record<string, unknown>)[f.key] ? [(row as Record<string, unknown>)[f.key]] : []])),
      },
    });

  const quickToggle = async (row: T) => {
    const next = !(row as unknown as Row).active;
    try {
      await save({ active: next } as unknown as Partial<T>, row.id);
      toast.success(next ? "بقى ظاهر في الموقع 👀" : "اتخفى من الموقع");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    setBusy(true);
    try {
      const data = { ...edit.data };
      fields.forEach((f) => {
        if (f.type === "number") data[f.key] = Number(data[f.key]) || 0;
        if (f.type === "image") data[f.key] = (data[f.key] as string[] | undefined)?.[0] ?? "";
      });
      await save(data as Partial<T>, edit.id);
      toast.success(edit.id ? "تم الحفظ ✨" : `تمت إضافة ${singular} 🎉`);
      setEdit(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const set = (k: string, v: unknown) => setEdit((s) => (s ? { ...s, data: { ...s.data, [k]: v } } : s));
  const counts = { all: items.length, on: items.filter((i) => (i as unknown as Row).active).length, off: items.filter((i) => !(i as unknown as Row).active).length };

  const actions = (row: T, light = false) => (
    <div className="flex items-center gap-1.5">
      {hasActive && (
        <button onClick={() => quickToggle(row)} title={(row as unknown as Row).active ? "إخفاء" : "إظهار"} className={`grid size-9 place-items-center rounded-xl border transition ${light ? "border-white/30 bg-white/15 text-white backdrop-blur hover:bg-white hover:text-ink" : "border-line bg-surface hover:border-primary hover:text-primary"}`}>
          {(row as unknown as Row).active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      )}
      <button onClick={() => openEdit(row)} title="تعديل" className={`grid size-9 place-items-center rounded-xl border transition ${light ? "border-white/30 bg-white/15 text-white backdrop-blur hover:bg-white hover:text-primary" : "border-line bg-surface hover:border-primary hover:bg-primary hover:text-white"}`}>
        <Pencil className="size-4" />
      </button>
      <button onClick={() => setDel(row)} title="حذف" className={`grid size-9 place-items-center rounded-xl border transition ${light ? "border-white/30 bg-white/15 text-white backdrop-blur hover:bg-rose-600" : "border-line bg-surface hover:border-rose-500 hover:bg-rose-500 hover:text-white"}`}>
        <Trash2 className="size-4" />
      </button>
    </div>
  );

  return (
    <>
      <PageHeader title={title} sub={sub}>
        <button onClick={() => setEdit({ data: { ...defaults } })} className="btn-primary py-2.5"><Plus className="size-4" /> إضافة {singular}</button>
      </PageHeader>
      {summary && !loading && <div className="mb-6">{summary(items)}</div>}

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5 flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-line bg-surface/80 p-2.5 shadow-[0_15px_40px_-30px_rgba(14,44,78,.4)] backdrop-blur">
        {searchKeys.length > 0 && (
          <div className="flex min-w-56 flex-1 items-center gap-2 rounded-2xl bg-surface-2 px-4 transition focus-within:ring-4 focus-within:ring-primary/10">
            <Search className="size-4 text-primary" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`ابحث في ${title}...`} className="flex-1 bg-transparent py-2.5 text-sm outline-none" />
          </div>
        )}
        {hasActive && (
          <div className="flex rounded-2xl bg-surface-2 p-1">
            {([["all", "الكل"], ["on", "ظاهر"], ["off", "مخفي"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setStatus(k)} className={`relative rounded-xl px-3.5 py-1.5 text-xs font-bold ${status === k ? "text-white" : "text-muted hover:text-primary"}`}>
                {status === k && <motion.span layoutId={`st-${collection}`} className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/30" />}
                <span className="relative">{l} <span className="opacity-70">{counts[k]}</span></span>
              </button>
            ))}
          </div>
        )}
        {card && (
          <div className="flex rounded-2xl bg-surface-2 p-1">
            {([["grid", LayoutGrid, "كروت"], ["table", List, "جدول"]] as const).map(([k, I, l]) => (
              <button key={k} onClick={() => setView(k)} title={l} className={`relative grid size-9 place-items-center rounded-xl ${view === k ? "text-white" : "text-muted hover:text-primary"}`}>
                {view === k && <motion.span layoutId={`vw-${collection}`} className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/30" />}
                <I className="relative size-4" />
              </button>
            ))}
          </div>
        )}
        <span className="mr-auto rounded-full bg-primary-soft px-3 py-1.5 text-xs font-extrabold text-primary">{list.length} {singular}</span>
      </motion.div>

      {loading ? (
        <Skeleton />
      ) : list.length === 0 ? (
        <EmptyState
          title={items.length ? "مفيش نتايج مطابقة" : `لسه مفيش ${title}`}
          text={items.length ? "جربي كلمة بحث تانية أو غيّري الفلتر" : `ابدئي بإضافة أول ${singular} وهيظهر هنا على طول`}
          action={!items.length ? <button onClick={() => setEdit({ data: { ...defaults } })} className="btn-primary"><Plus className="size-4" /> إضافة {singular}</button> : undefined}
        />
      ) : view === "grid" && card ? (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((row, i) => {
              const c = card(row);
              const off = hasActive && !(row as unknown as Row).active;
              return (
                <motion.div
                  key={row.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.5), ease: [0.22, 1, 0.36, 1] }}
                  className={`glow-border group relative overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[0_20px_50px_-35px_rgba(14,44,78,.5)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(13,148,136,.4)] ${off ? "opacity-70 grayscale-[.4]" : ""}`}
                >
                  <div className="relative h-44 overflow-hidden bg-surface-2">
                    {c.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image} alt="" className="size-full object-cover transition duration-[1.2s] group-hover:scale-110" />
                    ) : (
                      <div className="grid size-full place-items-center bg-gradient-to-br from-primary/20 to-gold/20 font-serif text-5xl text-primary/40">{c.title[0]}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f38]/90 via-[#0b1f38]/20 to-transparent" />
                    <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,.25)_50%,transparent_65%)] bg-[length:250%_100%] opacity-0 transition group-hover:animate-shimmer group-hover:opacity-100" />
                    <div className="absolute right-4 top-4 flex gap-2">{c.badge}</div>
                    <div className="absolute left-3 top-3 translate-y-[-8px] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {actions(row, true)}
                    </div>
                    <div className="absolute inset-x-4 bottom-3 text-white">
                      <h3 className="text-lg font-extrabold drop-shadow">{c.title}</h3>
                      {c.subtitle && <p dir="ltr" className="text-right text-xs text-white/70">{c.subtitle}</p>}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="line-clamp-2 min-h-10 text-sm text-muted">{c.body}</div>
                    {hasActive && (
                      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${off ? "text-muted" : "text-emerald-600 dark:text-emerald-400"}`}>
                          <span className={`size-2 rounded-full ${off ? "bg-zinc-400" : "animate-pulse bg-emerald-500"}`} />
                          {off ? "مخفي من الموقع" : "ظاهر في الموقع"}
                        </span>
                        <Toggle checked={!off} onChange={() => quickToggle(row)} />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[0_20px_50px_-35px_rgba(14,44,78,.5)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="bg-gradient-to-l from-surface-2 to-surface text-right text-[11px] font-extrabold tracking-wide text-muted">
                  {columns.map((c) => <th key={c.label} className="px-5 py-4">{c.label}</th>)}
                  <th className="w-32 px-5 py-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.5), ease: [0.22, 1, 0.36, 1] }}
                    className="group relative border-t border-line transition hover:bg-primary-soft/40"
                  >
                    {columns.map((c, ci) => (
                      <td key={c.label} className={`px-5 py-4 ${ci === 0 ? "relative" : ""} ${c.className ?? ""}`}>
                        {ci === 0 && <span className="absolute inset-y-3 right-0 w-1 origin-center scale-y-0 rounded-l-full bg-gradient-to-b from-primary to-gold transition duration-300 group-hover:scale-y-100" />}
                        {c.render(row)}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex justify-end opacity-70 transition group-hover:opacity-100">{actions(row)}</div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? `تعديل ${singular}` : `إضافة ${singular}`}>
        {edit && (
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => {
              const v = edit.data[f.key];
              return (
                <div key={f.key} className={f.full || f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
                  {f.type !== "toggle" && <label className="label">{f.label}{f.required && " *"}</label>}
                  {f.type === "textarea" ? (
                    <textarea required={f.required} rows={4} value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} className="input resize-none" placeholder={f.placeholder} />
                  ) : f.type === "toggle" ? (
                    <Toggle checked={!!v} onChange={(x) => set(f.key, x)} label={f.label} />
                  ) : f.type === "select" ? (
                    <select required={f.required} value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} className="input">
                      {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : f.type === "image" ? (
                    <ImagesInput single value={(v as string[]) ?? []} onChange={(x) => set(f.key, x)} />
                  ) : (
                    <input required={f.required} type={f.type ?? "text"} value={(v as string | number) ?? ""} onChange={(e) => set(f.key, e.target.value)} className="input" placeholder={f.placeholder} />
                  )}
                </div>
              );
            })}
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button type="button" onClick={() => setEdit(null)} className="btn-ghost py-2.5">إلغاء</button>
              <button disabled={busy} className="btn-primary py-2.5">{busy && <Loader2 className="size-4 animate-spin" />} حفظ</button>
            </div>
          </form>
        )}
      </Modal>
      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        text={`هل أنت متأكد من حذف هذا ${singular}؟ لا يمكن التراجع.`}
        onConfirm={async () => {
          if (!del) return;
          await remove(del.id);
          toast.success("تم الحذف");
        }}
      />
    </>
  );
}
