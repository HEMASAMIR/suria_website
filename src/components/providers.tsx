"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { CartProvider } from "./cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
      <CartProvider>
        {children}
        <Toaster
          position="bottom-center"
          offset={24}
          mobileOffset={{ bottom: 90 }}
          dir="rtl"
          toastOptions={{
            className: "!rounded-2xl !border-line !bg-surface !text-ink !font-sans !shadow-xl",
          }}
        />
      </CartProvider>
    </ThemeProvider>
  );
}
