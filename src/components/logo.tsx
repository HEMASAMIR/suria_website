import Link from "next/link";

export function Logo({ name = "ZONA", className = "" }: { name?: string; className?: string }) {
  return (
    <Link href="/" className={`group relative inline-flex items-center font-serif leading-none ${className}`}>
      <span className="text-3xl font-semibold tracking-[.18em] text-ink transition group-hover:text-primary">{name}</span>
      <span className="absolute -top-1 -left-3 size-2 rounded-full bg-primary transition group-hover:scale-150" />
    </Link>
  );
}
