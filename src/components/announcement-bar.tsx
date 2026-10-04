"use client";

import { BadgePercent, Gift, RefreshCcw, Sparkles, Truck, Wallet } from "lucide-react";

const iconFor = (t: string) => {
  if (/شحن|توصيل/.test(t)) return Truck;
  if (/دفع|استلام|كاش/.test(t)) return Wallet;
  if (/خصم|كود|%/.test(t)) return BadgePercent;
  if (/استبدال|استرجاع/.test(t)) return RefreshCcw;
  if (/هدية|مجاني/.test(t)) return Gift;
  return Sparkles;
};

/** Renders text, turning latin coupon-like codes (e.g. ZONA10) into shimmering gold pills. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/([A-Z][A-Z0-9]{3,})/g).map((part, i) =>
        /^[A-Z][A-Z0-9]{3,}$/.test(part) ? (
          <span key={i} className="ticker-code mx-1 rounded-full px-2.5 py-0.5 font-sans text-[11px] font-extrabold tracking-wider text-[#0e2c4e]">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function AnnouncementBar({ text }: { text: string }) {
  const items = text.split("•").map((s) => s.replace(/\p{Extended_Pictographic}/gu, "").trim()).filter(Boolean);
  if (!items.length) return null;
  // Each half must be wider than the widest screen for a seamless loop.
  const half = Array.from({ length: Math.max(2, Math.ceil(8 / items.length)) }, () => items).flat();

  const group = (hidden: boolean) => (
    <div key={String(hidden)} className="flex shrink-0 items-center" aria-hidden={hidden}>
      {half.map((t, i) => {
        const Icon = iconFor(t);
        return (
          <div key={i} dir="rtl" className="flex items-center">
            <span className="flex items-center gap-2.5 px-6">
              <span className="grid size-6 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
                <Icon className="size-3.5 text-[#fbbf24]" />
              </span>
              <span className="whitespace-nowrap text-[13px] font-bold">
                <Rich text={t} />
              </span>
            </span>
            <span className="text-[10px] text-[#fbbf24]/80">✦</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="ticker group relative h-10 overflow-hidden text-white">
      <div className="ticker-mask relative flex h-full items-center" dir="ltr">
        <div className="ticker-track flex w-max group-hover:[animation-play-state:paused]">
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  );
}
