import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen font-sans bg-[#f9fafb] flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-32">
                <div className="bg-green-100 p-4 rounded-full mb-6">
                    <Leaf className="h-10 w-10 text-green-600" fill="currentColor" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-500 max-w-md mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/">
                        <Button className="bg-green-600 hover:bg-green-700 rounded-full px-8">
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="outline" className="rounded-full px-8">
                            Browse Products
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}
