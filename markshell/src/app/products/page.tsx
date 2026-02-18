"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/ui/section";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/dummy-data";
import { ChevronDown, ChevronLeft, ChevronRight, FileText, MessageSquare, Download } from "lucide-react";

const ProductsPage = () => {
    // Fake state for visuals
    const [selectedCategory, setSelectedCategory] = useState<string[]>(["Spoons", "Forks", "Knives"]);
    const [selectedMaterial, setSelectedMaterial] = useState("All Materials");

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
                        Corporate Catalog
                    </h1>
                    <p className="text-green-100 max-w-2xl text-lg leading-relaxed opacity-90">
                        Browse our extensive range of FSC-certified wooden cutlery. Designed for bulk manufacturing, perfect for hospitality chains, catering services, and wholesale distributors.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <Section className="py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-3 space-y-8 hidden lg:block">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                            <button className="text-green-600 text-xs font-semibold hover:underline">Reset All</button>
                        </div>

                        {/* Category Filter */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</h4>
                            {["Spoons", "Forks", "Knives", "Stirrers", "Kits (Set of 3)"].map((cat) => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedCategory.includes(cat) ? "bg-green-600 border-green-600" : "border-gray-300 bg-white group-hover:border-green-400"}`}>
                                        {selectedCategory.includes(cat) && <span className="text-white text-xs font-bold">✓</span>}
                                    </div>
                                    <span className={`text-sm ${selectedCategory.includes(cat) ? "text-gray-900 font-medium" : "text-gray-500"}`}>{cat}</span>
                                </label>
                            ))}
                        </div>

                        {/* Material Filter */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Material</h4>
                            {["All Materials", "Birchwood", "Bamboo"].map((mat) => (
                                <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${selectedMaterial === mat ? "border-green-600" : "border-gray-300 group-hover:border-green-400"}`}>
                                        {selectedMaterial === mat && <div className="w-2 h-2 rounded-full bg-green-600" />}
                                    </div>
                                    <span className={`text-sm ${selectedMaterial === mat ? "text-gray-900 font-medium" : "text-gray-500"}`}>{mat}</span>
                                </label>
                            ))}
                        </div>

                        {/* Quantity Filter */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quantity Type</h4>
                            {["Wholesale Packs (1000+)", "Bulk Shipping (Pallets)"].map((q) => (
                                <label key={q} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border border-gray-300 bg-white flex items-center justify-center group-hover:border-green-400"></div>
                                    <span className="text-sm text-gray-500">{q}</span>
                                </label>
                            ))}
                        </div>
                    </aside>

                    {/* Product Grid Area */}
                    <div className="lg:col-span-9">
                        {/* Top Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                            <span className="text-gray-400 text-sm">Showing 6 of 48 products</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">Sort by:</span>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:border-green-500 transition-colors">
                                        Recommended <ChevronDown size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    variant="catalog"
                                    image={product.image}
                                    title={product.name}
                                    description={product.subname || product.category}
                                    tag={product.category} // Fallback, hidden in catalog mode
                                    badge={product.badge}
                                    specs={product.specs}
                                    isAvailable={product.isAvailable}
                                    onQuoteClick={() => console.log(`Quote for ${product.name}`)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-700 text-white font-bold shadow-lg shadow-green-900/20">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">2</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">3</button>
                            <span className="text-gray-400 px-2">...</span>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">8</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-green-600">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Bottom Download CTA */}
            <div className="bg-[#e5ddd5] py-20 border-t border-[#d8d0c8]">
                <div className="w-[90%] md:w-[80%] mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Need the full technical specifications?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-10">
                        Download our complete 2024 Corporate Catalog PDF for detailed dimensions, material certifications (FSC, SGS), and packaging options.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button className="bg-green-700 hover:bg-green-800 text-white rounded-lg px-8 py-6 text-base font-bold flex items-center gap-3 shadow-xl shadow-green-900/10">
                            <Download size={20} /> Download PDF Catalog
                        </Button>
                        <Button variant="white" className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg px-8 py-6 text-base font-bold flex items-center gap-3">
                            <MessageSquare size={20} /> Consult with a Sales Rep
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-6">*PDF includes full wholesale pricing tiers and shipping logistics information.</p>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default ProductsPage;
