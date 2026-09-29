import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/ui/CategoryCard";
import MessagePopup from "@/components/ui/MessagePopup";
import Section from "@/components/ui/section";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = {
    title: "Product Categories",
    description: "Browse MarkShell's sustainable cutlery and food-service disposables by category: wooden spoons, forks, knives, straws, kits and more, supplied in bulk across Sri Lanka.",
};

// Pre-rendered; refreshed on admin changes (lib/revalidate.ts) and hourly as a fallback.
export const revalidate = 3600;

const CategoriesPage = async () => {
    const categories = await getCategories();

    return (
        <main className="min-h-screen font-sans bg-[#f9fafb]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[300px] flex items-center px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[#1a4a1a] z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop"
                        alt="Wood Texture"
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover opacity-20 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-transparent"></div>
                </div>
                <div className="relative z-10 w-[90%] md:w-[80%] mx-auto pt-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Product Categories
                    </h1>
                    <p className="text-green-100 max-w-2xl text-lg leading-relaxed opacity-90">
                        Explore our sustainable cutlery collection by category. From spoons to complete kits, find exactly what you need for your business.
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <Section className="py-16">
                {categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                name={category.name}
                                description={category.description}
                                image={category.image}
                                itemCount={category.itemCount || 0}
                                slug={category.slug}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        No categories found.
                    </div>
                )}
            </Section>

            <Footer />
            <MessagePopup />
        </main>
    );
};

export default CategoriesPage;
