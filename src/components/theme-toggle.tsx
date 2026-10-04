"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { toast } from "sonner";

const subscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";

  const toggle = () => {
    const next = dark ? "light" : "dark";
    setTheme(next);
    if (next === "dark") toast("تم تفعيل الوضع الليلي 🌙", { description: "استمتعي بتصفح مريح لعينيكي" });
    else toast("تم تفعيل الوضع النهاري ☀️", { description: "ألوان ZONA بكامل إشراقتها" });
  };

  return (
    <button
      onClick={toggle}
      aria-label="تبديل الوضع"
      className={`relative grid size-10 place-items-center overflow-hidden rounded-full border border-line bg-surface text-ink transition hover:border-primary hover:text-primary ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ y: 20, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -20, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {dark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
