"use client";

import { CrudPage } from "@/components/admin/crud-page";
import { ActiveChip } from "@/components/admin/ui";
import { egp, fmtDate } from "@/lib/format";
import type { Coupon } from "@/lib/types";

export default function CouponsPage() {
  return (
    <CrudPage<Coupon>
      collection="coupons"
      title="أكواد الخصم"
      sub="أكواد بنسبة أو مبلغ ثابت، مع حد أدنى وعدد استخدامات وتاريخ انتهاء"
      singular="كود"
      defaults={{ code: "", type: "percent", value: 10, minOrder: 0, usageLimit: 100, used: 0, active: true, expiresAt: "" }}
      searchKeys={["code"]}
      fields={[
        { key: "code", label: "الكود", required: true, placeholder: "ZONA10" },
        { key: "type", label: "نوع الخصم", type: "select", options: [{ value: "percent", label: "نسبة %" }, { value: "fixed", label: "مبلغ ثابت" }] },
        { key: "value", label: "قيمة الخصم", type: "number", required: true },
        { key: "minOrder", label: "الحد الأدنى للطلب", type: "number" },
        { key: "usageLimit", label: "عدد مرات الاستخدام (0 = بلا حد)", type: "number" },
        { key: "expiresAt", label: "تاريخ الانتهاء", type: "date" },
        { key: "active", label: "مفعّل", type: "toggle" },
      ]}
      columns={[
        { label: "الكود", render: (c) => <b className="rounded-lg bg-primary-soft px-2 py-1 font-serif text-primary">{c.code}</b> },
        { label: "الخصم", render: (c) => (c.type === "percent" ? `${c.value}%` : egp(c.value)) },
        { label: "الحد الأدنى", render: (c) => egp(c.minOrder) },
        { label: "الاستخدام", render: (c) => `${c.used} / ${c.usageLimit || "∞"}` },
        { label: "ينتهي", render: (c) => (c.expiresAt ? fmtDate(c.expiresAt) : "—") },
        { label: "الحالة", render: (c) => <ActiveChip on={c.active} yes="مفعّل" no="متوقف" /> },
      ]}
    />
  );
}
