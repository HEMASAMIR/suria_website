import type { Metadata, Viewport } from "next";
import { Cairo, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "500", "700", "800"], variable: "--font-cairo" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"], style: ["normal", "italic"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: { default: "ZONA — لانجري وبيجامات حريمي", template: "%s | ZONA" },
  description: "بيجامات ستان، أطقم روب وتشكيلة العرايس بخامات فاخرة. شحن لكل محافظات مصر والدفع عند الاستلام.",
  // Stop Dark Reader & similar extensions from overriding our own light/dark themes.
  other: { "darkreader-lock": "lock" },
};

export const viewport: Viewport = { colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${cairo.variable} ${playfair.variable}`}>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
