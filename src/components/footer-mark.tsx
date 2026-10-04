"use client";

import { motion } from "framer-motion";

/** Big brand wordmark: letters rise in one by one, float gently, and keep a shimmer sweep. */
export function FooterMark({ name }: { name: string }) {
  return (
    <div dir="ltr" className="relative flex select-none justify-center overflow-hidden px-4 pb-8 pt-4" aria-hidden>
      {name.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 80, rotateX: -70, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block [perspective:600px]"
        >
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 + i * 0.35 }}
            whileHover={{ y: -22, scale: 1.06 }}
            style={{ animationDelay: `${i * 0.3}s` }}
            className="footer-mark inline-block cursor-default px-[.04em] font-serif text-[clamp(4.5rem,19vw,13rem)] leading-[1.05] tracking-[.12em]"
          >
            {ch}
          </motion.span>
        </motion.span>
      ))}
    </div>
  );
}
