import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { QuoteProvider } from "@/contexts/QuoteContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MarkShell | Sustainable Cutlery & Disposables Supplier — Sri Lanka",
    // Pages set just their own name, e.g. a product page's title becomes "Birch Spoon | MarkShell".
    template: "%s | MarkShell",
  },
  description: "MarkShell (by Mark-Shell Pvt Ltd) supplies internationally certified, sustainable wooden cutlery, straws, and food-service disposables in bulk to hotels, restaurants, catering services, and supermarkets across Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QuoteProvider>
          {children}
          <ScrollToTop />
        </QuoteProvider>
      </body>
    </html>
  );
}
