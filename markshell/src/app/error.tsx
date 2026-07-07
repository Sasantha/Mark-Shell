"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen font-sans bg-[#f9fafb] flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-32">
                <div className="bg-red-100 p-4 rounded-full mb-6">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Something Went Wrong</h1>
                <p className="text-gray-500 max-w-md mb-8">
                    We hit an unexpected error loading this page. Please try again, or head back to the homepage.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Button onClick={() => reset()} className="bg-green-600 hover:bg-green-700 rounded-full px-8">
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="rounded-full px-8">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}
