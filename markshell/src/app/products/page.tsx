"use client";

import React, { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import MessagePopup from "@/components/ui/MessagePopup";
import Section from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, MessageSquare, Download, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

/**
 * ProductsContent Component (Inner component to handle Suspense)
 */
const ProductsContent = () => {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    // Data State
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching products:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Initialize/Update filters from URL
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategories([categoryParam]);
        }
    }, [categoryParam]);

    // Sorting: 'recommended' | 'price-asc' | 'price-desc' | 'alpha-asc' | 'alpha-desc'
    const [sortBy, setSortBy] = useState<string>("recommended");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    // -------------------------------------------------------------------------
    // DERIVED STATE (FILTERING & SORTING)
    // -------------------------------------------------------------------------

    // 1. Filter Products
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Category Filter (if empty, matches all)
            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(product.category);

            // Material Filter (if empty, matches all)
            const matchesMaterial =
                selectedMaterials.length === 0 ||
                selectedMaterials.includes(product.material);

            return matchesCategory && matchesMaterial;
        });
    }, [products, selectedCategories, selectedMaterials]);

    // 2. Sort Products
    const sortedProducts = useMemo(() => {
        const items = [...filteredProducts];

        switch (sortBy) {
            case "price-asc":
                return items.sort((a, b) => a.price - b.price);
            case "price-desc":
                return items.sort((a, b) => b.price - a.price);
            case "alpha-asc":
                return items.sort((a, b) => a.name.localeCompare(b.name));
            case "alpha-desc":
                return items.sort((a, b) => b.name.localeCompare(a.name));
            default:
                // 'recommended' - assumes default order in dummy data is recommended
                return items;
        }
    }, [filteredProducts, sortBy]);

    // 3. Paginate
    const totalItems = sortedProducts.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Handle Page Reset on Filter/Sort Change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories, selectedMaterials, sortBy]);

    const currentProducts = sortedProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleCategoryChange = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat)
                ? prev.filter(c => c !== cat)
                : [...prev, cat]
        );
    };

    const handleMaterialChange = (mat: string) => {
        setSelectedMaterials(prev =>
            prev.includes(mat)
                ? prev.filter(m => m !== mat)
                : [...prev, mat]
        );
    };

    const handleReset = () => {
        setSelectedCategories([]);
        setSelectedMaterials([]);
        setSortBy("recommended");
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------

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

                    {/* Sidebar Filters - Styled as White Card */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                                <button
                                    onClick={handleReset}
                                    className="text-green-600 text-xs font-semibold hover:underline"
                                >
                                    Reset All
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</h4>
                                {["Spoons", "Forks", "Knives", "Stirrers", "Kits (Set of 3)"].map((cat) => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group select-none">
                                        <div
                                            className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${selectedCategories.includes(cat)
                                                ? "bg-green-600 border-green-600 shadow-sm"
                                                : "border-gray-200 bg-gray-50 group-hover:border-green-400"
                                                }`}
                                            onClick={(e) => { e.preventDefault(); handleCategoryChange(cat); }}
                                        >
                                            {selectedCategories.includes(cat) && <span className="text-white text-[10px] font-bold">✓</span>}
                                        </div>
                                        <span className={`text-sm transition-colors ${selectedCategories.includes(cat) ? "text-gray-900 font-bold" : "text-gray-500 group-hover:text-green-600"}`}>
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {/* Material Filter */}
                            <div className="space-y-3 pt-6 mt-6 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Material</h4>
                                {["Birchwood", "Bamboo", "Bagasse"].map((mat) => (
                                    <label key={mat} className="flex items-center gap-3 cursor-pointer group select-none">
                                        <div
                                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${selectedMaterials.includes(mat)
                                                ? "border-green-600 bg-white"
                                                : "border-gray-300 bg-gray-50 group-hover:border-green-400"
                                                }`}
                                            onClick={(e) => { e.preventDefault(); handleMaterialChange(mat); }}
                                        >
                                            {selectedMaterials.includes(mat) && <div className="w-2 h-2 rounded-full bg-green-600" />}
                                        </div>
                                        <span className={`text-sm transition-colors ${selectedMaterials.includes(mat) ? "text-gray-900 font-bold" : "text-gray-500 group-hover:text-green-600"}`}>
                                            {mat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid Area */}
                    <div className="lg:col-span-9">
                        {isLoading ? (
                            <div className="flex h-[40vh] items-center justify-center">
                                <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                            </div>
                        ) : error ? (
                            <div className="flex h-[40vh] items-center justify-center">
                                <p className="text-red-500 text-lg">Error loading products: {error}</p>
                            </div>
                        ) : (
                            <>
                                {/* Top Bar */}
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <span className="text-gray-500 text-sm font-medium">
                                        Showing <span className="text-gray-900 font-bold">{totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="text-gray-900 font-bold">{totalItems}</span> products
                                    </span>

                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 text-sm hidden sm:inline">Sort by:</span>
                                        <div className="relative">
                                            <select
                                                className="appearance-none bg-gray-50 border border-gray-200 pl-4 pr-10 py-2 rounded-lg text-sm font-medium text-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors cursor-pointer"
                                                value={sortBy}
                                                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                                            >
                                                <option value="recommended">Recommended</option>
                                                <option value="price-asc">Price: Low to High</option>
                                                <option value="price-desc">Price: High to Low</option>
                                                <option value="alpha-asc">Name: A - Z</option>
                                                <option value="alpha-desc">Name: Z - A</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Grid */}
                                {currentProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                                        {currentProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                id={product.id} // Added id
                                                variant="catalog"
                                                image={product.image}
                                                title={product.name}
                                                description={product.subname || product.category}
                                                tag={product.category}
                                                badge={product.badge}
                                                specs={product.specs}
                                                isAvailable={product.isAvailable}
                                                onQuoteClick={() => console.log(`Quote for ${product.name}`)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mb-12">
                                        <p className="text-gray-500 font-medium">No products match your filters.</p>
                                        <button
                                            onClick={handleReset}
                                            className="text-green-600 text-sm font-bold mt-2 hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalItems > 0 && (
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-600 transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${currentPage === page
                                                    ? "bg-green-700 text-white shadow-lg shadow-green-900/20 font-bold scale-105"
                                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-green-200"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-600 transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
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
            <MessagePopup />
        </main>
    );
};

const ProductsPage = () => {
    return (
        <Suspense fallback={<div>Loading chemicals...</div>}>
            <ProductsContent />
        </Suspense>
    );
};

export default ProductsPage;
