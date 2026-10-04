"use client";

import { CrudPage } from "@/components/admin/crud-page";
import { ActiveChip } from "@/components/admin/ui";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  return (
    <CrudPage<Category>
      collection="categories"
      title="الأقسام"
      sub="الأقسام اللي بتظهر في الصفحة الرئيسية وصفحة المنتجات"
      singular="قسم"
      defaults={{ name: "", slug: "", description: "", image: "", order: 99, active: true }}
      searchKeys={["name", "slug"]}
      sort={(a, b) => a.order - b.order}
      card={(c) => ({
        image: c.image,
        title: c.name,
        subtitle: `/${c.slug}`,
        body: c.description || "بدون وصف",
        badge: <span className="rounded-full bg-white/90 px-2.5 py-1 font-serif text-xs font-bold text-[#0e2c4e] shadow">#{c.order}</span>,
      })}
      fields={[
        { key: "name", label: "اسم القسم", required: true },
        { key: "slug", label: "الرابط (بالإنجليزي)", placeholder: "pajamas" },
        { key: "description", label: "وصف قصير", full: true },
        { key: "order", label: "الترتيب", type: "number" },
        { key: "active", label: "ظاهر في الموقع", type: "toggle" },
        { key: "image", label: "صورة القسم", type: "image" },
      ]}
      columns={[
        {
          label: "القسم",
          render: (c) => (
            <div className="flex items-center gap-4">
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" className="size-16 rounded-2xl object-cover shadow-md ring-2 ring-surface transition duration-500 group-hover:scale-105 group-hover:rotate-2" />
              ) : (
                <span className="size-16 rounded-2xl bg-surface-2" />
              )}
              <div className="space-y-1.5">
                <p className="text-base font-extrabold">{c.name}</p>
                <span dir="ltr" className="inline-block rounded-lg bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">/{c.slug}</span>
              </div>
            </div>
          ),
        },
        { label: "الوصف", render: (c) => <span className="line-clamp-2 max-w-xs leading-6 text-muted">{c.description}</span> },
        { label: "الترتيب", render: (c) => <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-[#0e2c4e] font-serif text-sm font-bold text-white shadow-md">{c.order}</span> },
        { label: "الحالة", render: (c) => <ActiveChip on={c.active} yes="ظاهر" no="مخفي" /> },
      ]}
    />
  );
}
