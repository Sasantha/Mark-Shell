"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import MessagePopup from "@/components/ui/MessagePopup";
import Section from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDown, ChevronLeft, ChevronRight, MessageSquare, Loader2 } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import type { Product, Category, Material } from "@/types";

interface FilterSidebarProps {
    categories: Category[];
    materials: Material[];
    selectedCategories: string[];
    selectedMaterials: string[];
    onCategoryChange: (name: string) => void;
    onMaterialChange: (name: string) => void;
    onReset: () => void;
}

/**
 * Filter sidebar content, shared between the desktop sticky sidebar and the
 * mobile slide-over. Defined outside ProductsContent so it isn't recreated
 * (and its DOM remounted) on every state change.
 */
const FilterSidebar = ({
    categories,
    materials,
    selectedCategories,
    selectedMaterials,
    onCategoryChange,
    onMaterialChange,
    onReset,
}: FilterSidebarProps) => (
    <>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-900">Filters</h3>
            <button
                onClick={onReset}
                className="text-green-600 text-xs font-semibold hover:underline"
            >
                Reset All
            </button>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</h4>
            {categories.length > 0 ? categories.map((cat) => (
                <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                >
                    <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => onCategoryChange(cat.name)}
                        className="sr-only peer"
                    />
                    <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-green-500/50 ${selectedCategories.includes(cat.name)
                            ? "bg-green-600 border-green-600 shadow-sm"
                            : "border-gray-200 bg-gray-50 group-hover:border-green-400"
                            }`}
                    >
                        {selectedCategories.includes(cat.name) && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                    <span className={`text-sm transition-colors ${selectedCategories.includes(cat.name) ? "text-gray-900 font-bold" : "text-gray-500 group-hover:text-green-600"}`}>
                        {cat.name}
                    </span>
                </label>
            )) : (
                <p className="text-sm text-gray-500">Loading categories...</p>
            )}
        </div>

        {/* Material Filter */}
        <div className="space-y-3 pt-6 mt-6 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Material</h4>
            {materials.length > 0 ? materials.map((matObj) => (
                <label
                    key={matObj.id}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                >
                    <input
                        type="checkbox"
                        checked={selectedMaterials.includes(matObj.name)}
                        onChange={() => onMaterialChange(matObj.name)}
                        className="sr-only peer"
                    />
                    <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-green-500/50 ${selectedMaterials.includes(matObj.name)
                            ? "border-green-600 bg-white"
                            : "border-gray-300 bg-gray-50 group-hover:border-green-400"
                            }`}
                    >
                        {selectedMaterials.includes(matObj.name) && <div className="w-2 h-2 rounded-full bg-green-600" />}
                    </div>
                    <span className={`text-sm transition-colors ${selectedMaterials.includes(matObj.name) ? "text-gray-900 font-bold" : "text-gray-500 group-hover:text-green-600"}`}>
                        {matObj.name}
                    </span>
                </label>
            )) : (
                <p className="text-sm text-gray-500">Loading materials...</p>
            )}
        </div>
    </>
);

/**
 * ProductsContent Component (Inner component to handle Suspense)
 */
const ProductsContent = () => {
    const { openQuote } = useQuote();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const searchQueryParam = searchParams.get("search");

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    // Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Fetch Categories
                const catRes = await fetch('/api/categories');
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData);
                }

                // Fetch Materials
                const matRes = await fetch('/api/materials');
                if (matRes.ok) {
                    const matData = await matRes.json();
                    setMaterials(matData);
                }

                // Fetch Products
                const url = searchQueryParam
                    ? `/api/products?q=${encodeURIComponent(searchQueryParam)}`
                    : '/api/products';
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [searchQueryParam]);

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

        // Also clear ?category= from the URL so a refresh doesn't silently
        // re-apply the filter that was just reset.
        if (categoryParam) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("category");
            router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    // Prevent body scroll when mobile filters are open
    useEffect(() => {
        if (isMobileFiltersOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileFiltersOpen]);

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
                        {searchQueryParam ? `Search Results for "${searchQueryParam}"` : "Corporate Catalog"}
                    </h1>
                    <p className="text-green-100 max-w-2xl text-lg leading-relaxed opacity-90">
                        {searchQueryParam
                            ? "Explore the products matching your search query across our entire catalog."
                            : "Browse our extensive range of FSC-certified wooden cutlery. Sourced for bulk supply, built for hospitality chains, catering services, and wholesale distributors."}
                    </p>
                </div>
            </div>

            {/* Sourcing Highlights Strip */}
            <div className="bg-white border-b border-gray-100">
                <div className="w-[90%] md:w-[80%] mx-auto py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { text: "Certified sustainable materials" },
                        { text: "Bulk order ready" },
                        { text: "Plastic-free dining, made simple" },
                        { text: "Custom sourcing available for food-service disposables", href: "/contact" },
                    ].map(({ text, href }) => (
                        <div key={text} className="flex items-center gap-3">
                            <CheckCircle className="text-green-600 shrink-0" size={18} />
                            {href ? (
                                <Link href={href} className="text-sm font-medium text-gray-700 hover:text-green-600 hover:underline transition-colors">{text}</Link>
                            ) : (
                                <span className="text-sm font-medium text-gray-700">{text}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <Section className="py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Mobile Filters Toggle & Dropdown */}
                    <div className="lg:hidden col-span-1">
                        <Button
                            variant="outline"
                            className="w-full h-12 flex justify-between items-center px-4 bg-white border-gray-200 text-gray-700 font-medium"
                            onClick={() => setIsMobileFiltersOpen(true)}
                        >
                            <span>Filter Results {(selectedCategories.length > 0 || selectedMaterials.length > 0) && `(${selectedCategories.length + selectedMaterials.length})`}</span>
                            <ChevronDown size={18} className="text-gray-400" />
                        </Button>
                    </div>

                    {/* Mobile Filters Overlay */}
                    {isMobileFiltersOpen && (
                        <div className="fixed inset-0 z-[60] lg:hidden flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
                            <div className="w-[85%] max-w-sm h-full bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right flex flex-col">
                                <div className="flex-1">
                                    <FilterSidebar
                                        categories={categories}
                                        materials={materials}
                                        selectedCategories={selectedCategories}
                                        selectedMaterials={selectedMaterials}
                                        onCategoryChange={handleCategoryChange}
                                        onMaterialChange={handleMaterialChange}
                                        onReset={handleReset}
                                    />
                                </div>
                                <div className="mt-8 pt-4 border-t border-gray-100 pb-4">
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                    >
                                        Apply Filters
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-3 h-12 text-base border-gray-200 text-gray-600"
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop Sidebar Filters */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <FilterSidebar
                                categories={categories}
                                materials={materials}
                                selectedCategories={selectedCategories}
                                selectedMaterials={selectedMaterials}
                                onCategoryChange={handleCategoryChange}
                                onMaterialChange={handleMaterialChange}
                                onReset={handleReset}
                            />
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
                                <div className="flex flex-row justify-between items-center mb-6 sm:mb-8 gap-2 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
                                    <span className="text-gray-500 text-xs sm:text-sm font-medium truncate">
                                        <span className="hidden sm:inline">Showing </span>
                                        <span className="text-gray-900 font-bold">{totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span>
                                        <span className="text-gray-500"> of </span>
                                        <span className="text-gray-900 font-bold">{totalItems}</span>
                                        <span className="hidden sm:inline"> products</span>
                                    </span>

                                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                        <label htmlFor="sort-by" className="text-gray-400 text-sm hidden sm:inline">Sort by:</label>
                                        <div className="relative">
                                            <select
                                                id="sort-by"
                                                className="appearance-none bg-gray-50 border border-gray-200 pl-2 sm:pl-4 pr-7 sm:pr-10 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors cursor-pointer w-[110px] sm:w-auto text-ellipsis"
                                                value={sortBy}
                                                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                                            >
                                                <option value="recommended">Recommended</option>
                                                <option value="price-asc">Price: Low - High</option>
                                                <option value="price-desc">Price: High - Low</option>
                                                <option value="alpha-asc">Name: A - Z</option>
                                                <option value="alpha-desc">Name: Z - A</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                                                specs={{
                                                    ...product.specs,
                                                    pack: product.pack ?? "",
                                                    case: product.case ?? "",
                                                    grade: product.grade ?? ""
                                                }}
                                                isAvailable={product.isAvailable}
                                                onQuoteClick={() => openQuote('product', product.name)}
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
                                            aria-label="Previous page"
                                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-600 transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                aria-label={`Page ${page}`}
                                                aria-current={currentPage === page ? "page" : undefined}
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
                                            aria-label="Next page"
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

            {/* Beyond the Catalog */}
            <Section className="bg-white py-16 border-t border-gray-100">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Something You Don't See Here?</h2>
                    <p className="text-gray-600 mb-8">
                        We can source additional food-service disposables — bags, cups, and related items —
                        through our certified manufacturer network.
                    </p>
                    <Link href="/contact">
                        <Button className="rounded-full px-8 py-6 text-base bg-green-600 hover:bg-green-700 text-white">Get in Touch</Button>
                    </Link>
                </div>
            </Section>

            {/* Bottom Consultation CTA */}
            <div className="bg-[#e5ddd5] py-20 border-t border-[#d8d0c8]">
                <div className="w-[90%] md:w-[80%] mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Need the full technical specifications?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-10">
                        Talk to our sales team for detailed dimensions, material certifications (FSC, SGS), packaging options, and wholesale pricing tiers.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            className="bg-green-700 hover:bg-green-800 text-white rounded-lg px-8 py-6 text-base font-bold flex items-center gap-3 shadow-xl shadow-green-900/10"
                            onClick={() => openQuote('general', 'Sales Consultation')}
                        >
                            <MessageSquare size={20} /> Consult with a Sales Rep
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
            <MessagePopup />
        </main>
    );
};

const ProductsPage = () => {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#f9fafb]">
                <Loader2 className="h-10 w-10 animate-spin text-green-600" />
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
};

export default ProductsPage;
