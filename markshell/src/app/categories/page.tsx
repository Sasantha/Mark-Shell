"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/ui/CategoryCard";
import MessagePopup from "@/components/ui/MessagePopup";
import Section from "@/components/ui/section";
import { Loader2 } from "lucide-react";

const CategoriesPage = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);
    return (
        <main className="min-h-screen font-sans bg-[#f9fafb]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[300px] flex items-center px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[#1a4a1a] z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop"
                        alt="Wood Texture"
                        className="w-full h-full object-cover opacity-20 mix-blend-overlay"
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
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                    </div>
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id || category._id}
                                name={category.name}
                                description={category.description}
                                image={category.image}
                                itemCount={category.itemCount || 0}
                                slug={category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}
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
