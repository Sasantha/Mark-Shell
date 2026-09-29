import type { Metadata } from "next";

// The contact page is a client component (for its form), so its metadata lives here.
export const metadata: Metadata = {
    title: "Contact Us",
    description: "Request a quote or ask about MarkShell's sustainable cutlery and food-service disposables. We supply hotels, restaurants, caterers and supermarkets across Sri Lanka.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
