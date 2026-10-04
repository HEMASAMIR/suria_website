"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, ExternalLink, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Confirm, Empty, ImagesInput, Modal, PageHeader, Skeleton, StatCard, Toggle, useCollection } from "@/components/admin/ui";
import { egp } from "@/lib/format";
import type { Category, ColorOption, Product } from "@/lib/types";

type Draft = Omit<Product, "id" | "createdAt" | "slug"> & { id?: string; slug?: string };

const EMPTY: Draft = {
  name: "", model: "", description: "", categoryId: "", price: 0, comparePrice: 0, cost: 0, images: [], colors: [], sizes: ["M", "L", "XL"],
  stock: 10, featured: false, isNew: true, active: true,
};

const SIZE_PRESETS = ["S", "M", "L", "XL", "2XL", "3XL", "Free Size"];

export default function ProductsPage() {
  const { items, loading, save, remove } = useCollection<Product>("products");
  const { items: cats } = useCollection<Category>("categories");
  const [edit, setEdit] = useState<Draft | null>(null);
  const [del, setDel] = useState<Product | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((p) => (!cat || p.categoryId === cat) && (!t || p.name.toLowerCase().includes(t) || p.model.includes(t)));
  }, [items, q, cat]);

  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? "—";
  const stockValue = items.reduce((s, p) => s + p.cost * p.stock, 0);
  const expected = items.reduce((s, p) => s + (p.price - p.cost) * p.stock, 0);

  const quick = async (p: Product, patch: Partial<Product>) => {
    try {
      await save(patch, p.id);
      toast.success("تم التحديث");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <>
      <PageHeader title="المنتجات" sub={`${items.length} منتج في المتجر`}>
        <button onClick={() => setEdit({ ...EMPTY, categoryId: cats[0]?.id ?? "" })} className="btn-primary py-2.5"><Plus className="size-4" /> منتج جديد</button>
      </PageHeader>

      <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي المنتجات" value={String(items.length)} />
        <StatCard label="قطع في المخزون" value={items.reduce((s, p) => s + p.stock, 0).toLocaleString("en")} />
        <StatCard label="قيمة المخزون (بالتكلفة)" value={egp(stockValue)} />
        <StatCard label="ربح متوقع من المخزون" value={egp(expected)} tone="text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex min-w-60 flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4">
          <Search className="size-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم أو رقم الموديل" className="flex-1 bg-transparent py-2.5 text-sm outline-none" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="input w-auto rounded-full py-2.5">
          <option value="">كل الأقسام</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <Skeleton rows={6} />
      ) : list.length === 0 ? (
        <Empty text="لا توجد منتجات" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-line text-right text-xs text-muted">
                {["المنتج", "القسم", "السعر", "التكلفة", "الربح/قطعة", "المخزون", "مميز", "ظاهر", ""].map((h) => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.map((p, i) => {
                const margin = p.price - p.cost;
                return (
                  <motion.tr key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }} className="border-b border-line last:border-0 hover:bg-surface-2/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0] || "/products/p01.webp"} alt="" className="h-14 w-12 rounded-xl object-cover" />
                        <div>
                          <p className="line-clamp-1 font-bold">{p.name}</p>
                          <p className="font-serif text-xs text-muted">#{p.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{catName(p.categoryId)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold">{egp(p.price)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{egp(p.cost)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${margin >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>{egp(margin)}</span>
                      <span className="mr-1 text-xs text-muted">({p.price ? Math.round((margin / p.price) * 100) : 0}%)</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`chip ${p.stock <= 0 ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" : p.stock <= 5 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : "bg-surface-2"}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3"><Toggle checked={p.featured} onChange={(v) => quick(p, { featured: v })} /></td>
                    <td className="px-4 py-3"><Toggle checked={p.active} onChange={(v) => quick(p, { active: v })} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link href={`/product/${p.slug}`} target="_blank" className="grid size-8 place-items-center rounded-full hover:bg-surface-2" title="عرض"><ExternalLink className="size-4" /></Link>
                        <button title="نسخ" onClick={() => setEdit({ ...p, id: undefined, slug: undefined, name: `${p.name} (نسخة)` })} className="grid size-8 place-items-center rounded-full hover:bg-surface-2"><Copy className="size-4" /></button>
                        <button title="تعديل" onClick={() => setEdit({ ...p })} className="grid size-8 place-items-center rounded-full hover:bg-primary-soft hover:text-primary"><Pencil className="size-4" /></button>
                        <button title="حذف" onClick={() => setDel(p)} className="grid size-8 place-items-center rounded-full hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/15"><Trash2 className="size-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal wide open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? "تعديل المنتج" : "منتج جديد"}>
        {edit && <ProductForm draft={edit} cats={cats} onCancel={() => setEdit(null)} onSave={async (d) => { await save(d as Partial<Product>, edit.id); toast.success(edit.id ? "تم حفظ المنتج" : "تمت إضافة المنتج 🎉"); setEdit(null); }} />}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} text={`حذف "${del?.name}" نهائيًا؟`} onConfirm={async () => { if (del) { await remove(del.id); toast.success("تم حذف المنتج"); } }} />
    </>
  );
}

function ProductForm({ draft, cats, onSave, onCancel }: { draft: Draft; cats: Category[]; onSave: (d: Draft) => Promise<void>; onCancel: () => void }) {
  const [d, setD] = useState<Draft>(draft);
  const [busy, setBusy] = useState(false);
  const [color, setColor] = useState<ColorOption>({ name: "", hex: "#0d9488" });
  const [size, setSize] = useState("");
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  const margin = d.price - d.cost;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.images.length) return toast.error("ضيفي صورة واحدة على الأقل");
    setBusy(true);
    try {
      await onSave({ ...d, price: +d.price, cost: +d.cost, stock: +d.stock, comparePrice: +(d.comparePrice ?? 0) || undefined });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <div><label className="label">اسم المنتج *</label><input required value={d.name} onChange={(e) => set("name", e.target.value)} className="input" /></div>
          <div><label className="label">رقم الموديل *</label><input required value={d.model} onChange={(e) => set("model", e.target.value)} className="input font-serif" /></div>
        </div>
        <div><label className="label">الوصف</label><textarea rows={3} value={d.description} onChange={(e) => set("description", e.target.value)} className="input resize-none" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">القسم *</label>
            <select required value={d.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="input">
              <option value="">اختر القسم</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="label">الكمية في المخزون *</label><input required type="number" min={0} value={d.stock} onChange={(e) => set("stock", +e.target.value)} className="input" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="label">سعر البيع *</label><input required type="number" min={0} value={d.price} onChange={(e) => set("price", +e.target.value)} className="input" /></div>
          <div><label className="label">السعر قبل الخصم</label><input type="number" min={0} value={d.comparePrice ?? 0} onChange={(e) => set("comparePrice", +e.target.value)} className="input" /></div>
          <div><label className="label">التكلفة (سعر الشراء) *</label><input required type="number" min={0} value={d.cost} onChange={(e) => set("cost", +e.target.value)} className="input" /></div>
        </div>
        <div className={`rounded-2xl p-3 text-sm ${margin >= 0 ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"}`}>
          ربح القطعة: <b>{egp(margin)}</b> — هامش الربح <b>{d.price ? Math.round((margin / d.price) * 100) : 0}%</b>
        </div>

        <div>
          <label className="label">الألوان</label>
          <div className="flex flex-wrap gap-2">
            {d.colors.map((c, i) => (
              <span key={c.name + i} className="chip border border-line bg-surface py-1.5 pl-2">
                <span className="size-4 rounded-full border border-line" style={{ background: c.hex }} />
                {c.name}
                <button type="button" onClick={() => set("colors", d.colors.filter((_, k) => k !== i))}><X className="size-3" /></button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input type="color" value={color.hex} onChange={(e) => setColor({ ...color, hex: e.target.value })} className="h-11 w-14 cursor-pointer rounded-xl border border-line bg-surface p-1" />
            <input value={color.name} onChange={(e) => setColor({ ...color, name: e.target.value })} placeholder="اسم اللون (مثال: زمردي)" className="input py-2" />
            <button type="button" onClick={() => { if (color.name.trim()) { set("colors", [...d.colors, { ...color, name: color.name.trim() }]); setColor({ ...color, name: "" }); } }} className="btn-ghost shrink-0 px-4 py-2">إضافة</button>
          </div>
        </div>

        <div>
          <label className="label">المقاسات</label>
          <div className="flex flex-wrap gap-2">
            {SIZE_PRESETS.map((s) => {
              const on = d.sizes.includes(s);
              return (
                <button type="button" key={s} onClick={() => set("sizes", on ? d.sizes.filter((x) => x !== s) : [...d.sizes, s])} className={`rounded-xl border-2 px-3 py-1.5 text-xs font-bold ${on ? "border-primary bg-primary text-white" : "border-line"}`}>{s}</button>
              );
            })}
            {d.sizes.filter((s) => !SIZE_PRESETS.includes(s)).map((s) => (
              <button type="button" key={s} onClick={() => set("sizes", d.sizes.filter((x) => x !== s))} className="rounded-xl border-2 border-primary bg-primary px-3 py-1.5 text-xs font-bold text-white">{s} ×</button>
            ))}
            <input value={size} onChange={(e) => setSize(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (size.trim()) { set("sizes", [...d.sizes, size.trim()]); setSize(""); } } }} placeholder="مقاس آخر + Enter" className="input w-40 py-1.5 text-xs" />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="label">صور المنتج * (اسحبي لترتيبها)</label>
          <ImagesInput value={d.images} onChange={(v) => set("images", v)} />
        </div>
        <div className="card space-y-3 p-4">
          <Toggle checked={d.active} onChange={(v) => set("active", v)} label="ظاهر في المتجر" />
          <Toggle checked={d.featured} onChange={(v) => set("featured", v)} label="ضمن الأكثر طلبًا" />
          <Toggle checked={d.isNew} onChange={(v) => set("isNew", v)} label="علامة جديد" />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="btn-ghost flex-1 py-3">إلغاء</button>
          <button disabled={busy} className="btn-primary flex-1 py-3">{busy && <Loader2 className="size-4 animate-spin" />} حفظ</button>
        </div>
      </div>
    </form>
  );
}
