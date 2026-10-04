"use client";

import { motion, useScroll, useSpring, type HTMLMotionProps } from "framer-motion";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number; x?: number };

/** Fades + slides content in as it enters the viewport while scrolling. */
export function Reveal({ delay = 0, y = 40, x = 0, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.96 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-right bg-gradient-to-l from-[#0f172a] via-primary to-[#fbbf24]"
    />
  );
}

export function SectionTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-10 text-center">
      <span className="text-gradient animate-shimmer font-serif text-sm italic tracking-[.3em]">{kicker}</span>
      <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-xl text-muted">{sub}</p>}
      <div className="mx-auto mt-4 flex items-center justify-center gap-2">
        <span className="h-px w-10 bg-primary/40" />
        <span className="size-1.5 rotate-45 bg-primary" />
        <span className="h-px w-10 bg-primary/40" />
      </div>
    </Reveal>
  );
}
