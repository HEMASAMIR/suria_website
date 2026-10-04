"use client";

import { Star } from "lucide-react";
import { CrudPage } from "@/components/admin/crud-page";
import { ActiveChip } from "@/components/admin/ui";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsPage() {
  return (
    <CrudPage<Testimonial>
      collection="testimonials"
      title="آراء العملاء"
      sub="الآراء اللي بتظهر في الصفحة الرئيسية"
      singular="رأي"
      defaults={{ name: "", city: "", text: "", rating: 5, active: true }}
      searchKeys={["name", "city", "text"]}
      fields={[
        { key: "name", label: "اسم العميلة", required: true },
        { key: "city", label: "المدينة" },
        { key: "rating", label: "التقييم (1-5)", type: "number" },
        { key: "active", label: "ظاهر", type: "toggle" },
        { key: "text", label: "الرأي", type: "textarea", required: true },
      ]}
      columns={[
        { label: "العميلة", render: (t) => <div><b>{t.name}</b><p className="text-xs text-muted">{t.city}</p></div> },
        { label: "الرأي", render: (t) => <span className="line-clamp-2 max-w-md text-muted">{t.text}</span> },
        {
          label: "التقييم",
          render: (t) => (
            <span className="flex text-gold">
              {Array.from({ length: Math.max(0, Math.min(5, Number(t.rating))) }).map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}
            </span>
          ),
        },
        { label: "الحالة", render: (t) => <ActiveChip on={t.active} yes="ظاهر" no="مخفي" /> },
      ]}
    />
  );
}
