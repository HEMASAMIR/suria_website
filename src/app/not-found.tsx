import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grain relative grid min-h-dvh place-items-center overflow-hidden bg-gradient-to-b from-[#effcfa] via-white to-[#fffaf0] dark:from-[#0a2636] dark:via-[#07182b] dark:to-[#0b1f33] p-6 text-center">
      <div>
        <p className="font-serif text-[8rem] leading-none text-primary sm:text-[12rem]">404</p>
        <h1 className="mt-2 text-2xl font-extrabold">الصفحة دي مش موجودة</h1>
        <p className="mt-2 text-muted">يمكن المنتج اتشال أو الرابط غلط</p>
        <Link href="/" className="btn-primary mt-8">ارجعي للرئيسية</Link>
      </div>
    </div>
  );
}
