"use client";

import { CrudPage } from "@/components/admin/crud-page";
import { ActiveChip, StatCard } from "@/components/admin/ui";
import { egp } from "@/lib/format";
import type { ShippingZone } from "@/lib/types";

export default function ShippingPage() {
  return (
    <CrudPage<ShippingZone>
      collection="shipping"
      title="الشحن والمحافظات"
      sub="حددي سعر الشحن ومدة التوصيل لكل محافظة — بيتحسب تلقائي في صفحة الدفع"
      singular="محافظة"
      defaults={{ governorate: "", fee: 60, days: "2-3 أيام", active: true }}
      searchKeys={["governorate"]}
      fields={[
        { key: "governorate", label: "المحافظة", required: true },
        { key: "fee", label: "سعر الشحن (ج.م)", type: "number", required: true },
        { key: "days", label: "مدة التوصيل", placeholder: "2-3 أيام" },
        { key: "active", label: "متاح للشحن", type: "toggle" },
      ]}
      summary={(items) => {
        const fees = items.map((i) => i.fee);
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="عدد المحافظات" value={String(items.length)} />
            <StatCard label="أقل سعر شحن" value={egp(fees.length ? Math.min(...fees) : 0)} />
            <StatCard label="أعلى سعر شحن" value={egp(fees.length ? Math.max(...fees) : 0)} />
          </div>
        );
      }}
      columns={[
        { label: "المحافظة", render: (z) => <b>{z.governorate}</b> },
        { label: "سعر الشحن", render: (z) => <b className="text-primary">{egp(z.fee)}</b> },
        { label: "مدة التوصيل", render: (z) => z.days },
        { label: "الحالة", render: (z) => <ActiveChip on={z.active} yes="متاح" no="متوقف" /> },
      ]}
    />
  );
}
