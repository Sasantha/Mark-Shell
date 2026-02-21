"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/ui/CategoryCard";
import MessagePopup from "@/components/ui/MessagePopup";
import Section from "@/components/ui/section";
import { categories } from "@/lib/dummy-data";

const CategoriesPage = () => {
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            name={category.name}
                            description={category.description}
                            image={category.image}
                            itemCount={category.itemCount}
                            slug={category.slug}
                        />
                    ))}
                </div>
            </Section>

            <Footer />
            <MessagePopup />
        </main>
    );
};

export default CategoriesPage;
