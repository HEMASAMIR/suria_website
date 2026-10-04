"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Confirm, Empty, ImagesInput, Modal, PageHeader, Skeleton, Toggle, useCollection } from "./ui";

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
};

export function CrudPage<T extends { id: string }>({ collection, title, sub, singular, fields, columns, defaults, searchKeys = [], sort, summary }: Props<T>) {
  const { items, loading, save, remove } = useCollection<T>(collection);
  const [edit, setEdit] = useState<{ id?: string; data: Record<string, unknown> } | null>(null);
  const [del, setDel] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const r = term ? items.filter((it) => searchKeys.some((k) => String(it[k] ?? "").toLowerCase().includes(term))) : items;
    return sort ? [...r].sort(sort) : r;
  }, [items, q, searchKeys, sort]);

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
      toast.success(edit.id ? "تم الحفظ" : `تمت إضافة ${singular}`);
      setEdit(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const set = (k: string, v: unknown) => setEdit((s) => (s ? { ...s, data: { ...s.data, [k]: v } } : s));

  return (
    <>
      <PageHeader title={title} sub={sub}>
        <button onClick={() => setEdit({ data: { ...defaults } })} className="btn-primary py-2.5"><Plus className="size-4" /> إضافة {singular}</button>
      </PageHeader>
      {summary && !loading && <div className="mb-6">{summary(items)}</div>}
      {searchKeys.length > 0 && (
        <div className="mb-4 flex max-w-sm items-center gap-2 rounded-full border border-line bg-surface px-4">
          <Search className="size-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث..." className="flex-1 bg-transparent py-2.5 text-sm outline-none" />
        </div>
      )}
      {loading ? (
        <Skeleton />
      ) : list.length === 0 ? (
        <Empty text="لا توجد عناصر بعد" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-right text-xs text-muted">
                {columns.map((c) => <th key={c.label} className="px-4 py-3 font-bold">{c.label}</th>)}
                <th className="w-24 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((row, i) => (
                <motion.tr key={row.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }} className="border-b border-line last:border-0 hover:bg-surface-2/60">
                  {columns.map((c) => <td key={c.label} className={`px-4 py-3 ${c.className ?? ""}`}>{c.render(row)}</td>)}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEdit({ id: row.id, data: { ...(row as Record<string, unknown>), ...Object.fromEntries(fields.filter((f) => f.type === "image").map((f) => [f.key, (row as Record<string, unknown>)[f.key] ? [(row as Record<string, unknown>)[f.key]] : []])) } })} className="grid size-8 place-items-center rounded-full hover:bg-primary-soft hover:text-primary"><Pencil className="size-4" /></button>
                      <button onClick={() => setDel(row)} className="grid size-8 place-items-center rounded-full hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/15"><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
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
