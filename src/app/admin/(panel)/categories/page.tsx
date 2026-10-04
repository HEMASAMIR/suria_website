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
            <div className="flex items-center gap-3">
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" className="size-12 rounded-xl object-cover" />
              ) : (
                <span className="size-12 rounded-xl bg-surface-2" />
              )}
              <div>
                <p className="font-bold">{c.name}</p>
                <p className="text-xs text-muted" dir="ltr">/{c.slug}</p>
              </div>
            </div>
          ),
        },
        { label: "الوصف", render: (c) => <span className="line-clamp-1 text-muted">{c.description}</span> },
        { label: "الترتيب", render: (c) => c.order },
        { label: "الحالة", render: (c) => <ActiveChip on={c.active} yes="ظاهر" no="مخفي" /> },
      ]}
    />
  );
}
