import type React from "react";
import type { Metadata } from "next";
import { Open_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "DeFi Pools Dashboard",
  description: "DeFi pools overview and analytics powered by DeFiLlama",
};

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-open-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  display: "swap",
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openSans.variable} ${montserrat.variable} antialiased`}
    >
      <body className="font-sans bg-background text-foreground min-h-screen">
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
