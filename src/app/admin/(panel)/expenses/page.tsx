"use client";

import { CrudPage } from "@/components/admin/crud-page";
import { StatCard } from "@/components/admin/ui";
import { egp, fmtDate } from "@/lib/format";
import type { Expense } from "@/lib/types";

const CATS = ["إعلانات", "تغليف", "مرتبات", "إيجار", "تصوير", "شحن", "أخرى"];

export default function ExpensesPage() {
  return (
    <CrudPage<Expense>
      collection="expenses"
      title="المصروفات"
      sub="سجّلي مصاريف المشروع عشان صافي الربح يتحسب صح في لوحة التحكم"
      singular="مصروف"
      defaults={{ title: "", category: CATS[0], amount: 0, date: new Date().toISOString().slice(0, 10) }}
      searchKeys={["title", "category"]}
      sort={(a, b) => b.date.localeCompare(a.date)}
      fields={[
        { key: "title", label: "البيان", required: true, full: true },
        { key: "category", label: "التصنيف", type: "select", options: CATS.map((c) => ({ value: c, label: c })) },
        { key: "amount", label: "المبلغ (ج.م)", type: "number", required: true },
        { key: "date", label: "التاريخ", type: "date", required: true },
      ]}
      summary={(items) => {
        const month = new Date().toISOString().slice(0, 7);
        return (
          <div className="grid gap-5 sm:grid-cols-2">
            <StatCard label="إجمالي المصروفات" value={egp(items.reduce((s, e) => s + e.amount, 0))} tone="text-rose-600" />
            <StatCard label="مصروفات الشهر الحالي" value={egp(items.filter((e) => e.date.startsWith(month)).reduce((s, e) => s + e.amount, 0))} />
          </div>
        );
      }}
      columns={[
        { label: "البيان", render: (e) => <b>{e.title}</b> },
        { label: "التصنيف", render: (e) => <span className="chip bg-primary-soft text-primary">{e.category}</span> },
        { label: "المبلغ", render: (e) => <b className="text-rose-600">{egp(e.amount)}</b> },
        { label: "التاريخ", render: (e) => fmtDate(e.date) },
      ]}
    />
  );
}
