import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { UniversalLoadingProvider } from "@/components/providers/loading-provider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Craftora",
  description: "Handmade Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* FIX: Moved Navbar and Footer INSIDE the body tag where they belong */}
      <body className="min-h-full flex flex-col text-neutral-900 bg-neutral-50/50">
        <Suspense fallback={null}>
          <UniversalLoadingProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </UniversalLoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}