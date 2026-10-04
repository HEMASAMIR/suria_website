"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { ImagesInput, PageHeader, Skeleton, api } from "@/components/admin/ui";
import type { Settings } from "@/lib/types";

type Key = keyof Settings;
const SECTIONS: { title: string; fields: { k: Key; l: string; t?: "number" | "textarea"; ltr?: boolean }[] }[] = [
  {
    title: "هوية المتجر",
    fields: [
      { k: "storeName", l: "اسم المتجر" },
      { k: "tagline", l: "الشعار" },
      { k: "announcement", l: "شريط الإعلانات أعلى الموقع", t: "textarea" },
      { k: "aboutText", l: "نبذة عن المتجر (تظهر في الفوتر)", t: "textarea" },
    ],
  },
  {
    title: "الواجهة الرئيسية (Hero)",
    fields: [
      { k: "heroTitle", l: "العنوان الرئيسي" },
      { k: "heroSubtitle", l: "الوصف", t: "textarea" },
    ],
  },
  {
    title: "التواصل والسوشيال",
    fields: [
      { k: "whatsapp", l: "رقم واتساب (بالصيغة الدولية 2010...)", ltr: true },
      { k: "phone", l: "رقم الهاتف", ltr: true },
      { k: "email", l: "البريد الإلكتروني", ltr: true },
      { k: "instagram", l: "رابط Instagram", ltr: true },
      { k: "facebook", l: "رابط Facebook", ltr: true },
      { k: "tiktok", l: "رابط TikTok", ltr: true },
    ],
  },
  {
    title: "الدفع والشحن",
    fields: [
      { k: "freeShippingThreshold", l: "شحن مجاني للطلبات فوق (0 = إيقاف)", t: "number" },
      { k: "returnDays", l: "مدة الاستبدال (أيام)", t: "number" },
      { k: "instapay", l: "حساب InstaPay (فاضي = إخفاء)", ltr: true },
      { k: "vodafoneCash", l: "رقم فودافون كاش (فاضي = إخفاء)", ltr: true },
    ],
  },
];

export default function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Settings>("/api/admin/settings").then(setS).catch((e) => toast.error(e.message));
  }, []);

  if (!s) return <Skeleton rows={8} />;
  const set = (k: Key, v: unknown) => setS({ ...s, [k]: v });

  const save = async () => {
    setBusy(true);
    try {
      setS(await api<Settings>("/api/admin/settings", "PUT", { ...s, freeShippingThreshold: +s.freeShippingThreshold, returnDays: +s.returnDays }));
      toast.success("تم حفظ الإعدادات ✨");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="إعدادات الموقع" sub="كل النصوص والصور والبيانات اللي بتظهر في المتجر">
        <button onClick={save} disabled={busy} className="btn-primary py-2.5">{busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} حفظ التغييرات</button>
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-2">
        {SECTIONS.map((sec) => (
          <section key={sec.title} className="card p-6">
            <h2 className="mb-5 font-extrabold">{sec.title}</h2>
            <div className="grid gap-4">
              {sec.fields.map((f) => (
                <div key={f.k}>
                  <label className="label">{f.l}</label>
                  {f.t === "textarea" ? (
                    <textarea rows={3} value={String(s[f.k] ?? "")} onChange={(e) => set(f.k, e.target.value)} className="input resize-none" />
                  ) : (
                    <input type={f.t ?? "text"} dir={f.ltr ? "ltr" : undefined} value={String(s[f.k] ?? "")} onChange={(e) => set(f.k, e.target.value)} className={`input ${f.ltr ? "text-right" : ""}`} />
                  )}
                </div>
              ))}
              {sec.title.includes("Hero") && (
                <div>
                  <label className="label">صور الواجهة (بتتبدل تلقائي)</label>
                  <ImagesInput value={s.heroImages} onChange={(v) => set("heroImages", v)} />
                </div>
              )}
            </div>
          </section>
        ))}
        <section className="card p-6 xl:col-span-2">
          <h2 className="mb-2 font-extrabold">فيديوهات الريلز</h2>
          <p className="mb-4 text-xs text-muted">رابط فيديو MP4 في كل سطر (ممكن ترفعيه على أي استضافة أو تحطيه في مجلد public/videos)</p>
          <textarea dir="ltr" rows={4} value={s.videos.join("\n")} onChange={(e) => set("videos", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} className="input resize-none font-mono text-xs" />
        </section>
      </div>
    </>
  );
}
