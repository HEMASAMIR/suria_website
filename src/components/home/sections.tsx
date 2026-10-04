"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "../motion";
import type { Category } from "@/lib/types";

export function WordMarquee() {
  const words = ["SATIN", "LACE", "BRIDAL", "COMFORT", "ELEGANCE", "ROBES", "PAJAMAS"];
  return (
    <div className="relative -rotate-1 overflow-hidden border-y border-primary/20 bg-primary py-4 text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap [animation-duration:40s]">
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center px-6 font-serif text-2xl italic tracking-widest">
            {w}
            <span className="mr-12 inline-block size-2 rotate-45 bg-white/70" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Categories({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  return (
    <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {categories.map((c, i) => (
        <StaggerItem key={c.id} className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
          <Link href={`/shop?category=${c.slug}`} className={`group relative block overflow-hidden rounded-[2rem] ${i === 0 ? "aspect-[16/10] md:aspect-[3/4]" : "aspect-[3/4]"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt={c.name} className="absolute inset-0 size-full object-cover transition duration-[1.2s] group-hover:scale-110 group-hover:rotate-1" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-xs text-white/70">{counts[c.id] ?? 0} منتج</p>
              <h3 className="text-xl font-extrabold">{c.name}</h3>
              <p className="mt-1 line-clamp-1 text-xs text-white/70">{c.description}</p>
              <span className="mt-3 inline-flex translate-y-3 items-center gap-1 text-xs font-bold text-primary opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                تسوقي القسم <ArrowLeft className="size-3.5" />
              </span>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function VideoReels({ videos }: { videos: string[] }) {
  if (!videos.length) return null;
  return (
    <div className="no-scrollbar container-z flex snap-x gap-4 overflow-x-auto pb-4">
      {videos.map((v, i) => (
        <Reveal key={v} delay={i * 0.1} className="w-[70%] shrink-0 snap-center sm:w-[45%] lg:w-[calc(25%-.75rem)]">
          <div className="group relative aspect-[9/16] overflow-hidden rounded-[2rem] border-4 border-surface bg-ink shadow-xl">
            <video src={v} autoPlay muted loop playsInline preload="metadata" className="size-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <p className="font-serif text-sm italic">ZONA Reels</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
