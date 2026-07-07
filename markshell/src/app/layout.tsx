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
  title: "MarkShell | Sustainable Wooden Cutlery Manufacturing",
  description: "FSC-certified wooden cutlery for hospitality chains, catering services, and wholesale distributors. Bulk manufacturing with global export capability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
