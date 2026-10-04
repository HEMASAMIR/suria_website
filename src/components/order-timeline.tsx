"use client";

import { motion } from "framer-motion";
import { Check, Package, PackageCheck, Truck, ClipboardCheck, XCircle } from "lucide-react";
import { STATUS, STATUS_FLOW, fmtDateTime } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const ICONS = { pending: ClipboardCheck, confirmed: Package, shipped: Truck, delivered: PackageCheck };

export function OrderTimeline({ status, history }: { status: OrderStatus; history: Order["history"] }) {
  if (status === "cancelled" || status === "returned")
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
        <XCircle className="size-6" /> <b>الطلب {STATUS[status].label}</b>
      </div>
    );
  const idx = STATUS_FLOW.indexOf(status);
  return (
    <div className="relative flex justify-between">
      <div className="absolute inset-x-10 top-[22px] h-1 rounded-full bg-line">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(idx / (STATUS_FLOW.length - 1)) * 100}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute right-0 h-full rounded-full bg-primary"
        />
      </div>
      {STATUS_FLOW.map((s, i) => {
        const Icon = ICONS[s as keyof typeof ICONS];
        const done = i <= idx;
        const at = history.find((h) => h.status === s)?.at;
        return (
          <motion.div key={s} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 + i * 0.2 }} className="relative z-10 flex w-20 flex-col items-center text-center">
            <span className={`grid size-12 place-items-center rounded-full border-4 border-bg ${done ? "bg-primary text-white" : "bg-surface-2 text-muted"}`}>
              {done && i < idx ? <Check className="size-5" /> : <Icon className="size-5" />}
            </span>
            <p className={`mt-2 text-xs font-bold ${done ? "text-ink" : "text-muted"}`}>{STATUS[s].label}</p>
            {at && <p className="text-[10px] text-muted">{fmtDateTime(at)}</p>}
          </motion.div>
        );
      })}
    </div>
  );
}
