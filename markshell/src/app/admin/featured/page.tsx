"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/adminFetch";
import { Search, ArrowUpDown, Loader2, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminFeaturedPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter State
    const [filterCategory, setFilterCategory] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
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

    const featuredCount = products.filter(p => p.isFeatured).length;
    const isAtLimit = featuredCount >= 6;

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory ? p.category === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        // Always show featured products at the top implicitly
        if (a.isFeatured !== b.isFeatured) {
            return a.isFeatured ? -1 : 1;
        }
        return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

    const toggleSort = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

    const toggleFeature = async (product: any) => {
        const currentlyFeatured = product.isFeatured;

        if (!currentlyFeatured && isAtLimit) {
            alert('Maximum 6 products can be featured. Unfeature an existing product to add a new one.');
            return;
        }

        try {
            const response = await adminFetch(`/api/products/${product.id}/feature`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFeatured: !currentlyFeatured })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to update feature status');
            }

            // Successfully updated in DB, now update local state
            setProducts(products.map(p =>
                p.id === product.id ? { ...p, isFeatured: !currentlyFeatured } : p
            ));
        } catch (err: any) {
            console.error("Error toggling feature status:", err);
            alert(err.message);
        }
    };


    if (isLoading && products.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (error && products.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Featured Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Select up to 6 products to feature on the homepage.</p>
                </div>
                <div className={`text-lg font-semibold px-4 py-2 rounded-lg border ${isAtLimit ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                    Featured: {featuredCount}/6
                </div>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 py-2 pl-10 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                        {/* Sort Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleSort}
                            className="flex items-center gap-2 text-gray-600 border-gray-200"
                        >
                            <ArrowUpDown size={14} />
                            Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                        </Button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Filter By:</span>

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="rounded-lg border border-gray-200 py-1.5 px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map(cat => (
                            <option key={String(cat)} value={String(cat)}>{String(cat)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4 text-right">Featured</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedProducts.length > 0 ? (
                            sortedProducts.map((product) => (
                                <tr key={product.id} className={`hover:bg-gray-50 ${product.isFeatured ? 'bg-amber-50/50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 border-b-0">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-gray-400">{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">${product.price?.toFixed(2) || "0.00"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                onClick={() => toggleFeature(product)}
                                                variant={product.isFeatured ? "default" : "outline"}
                                                size="sm"
                                                className={product.isFeatured ? "bg-amber-500 hover:bg-amber-600" : "text-gray-500 border-gray-200 hover:text-amber-500 hover:border-amber-300"}
                                            >
                                                {product.isFeatured ? (
                                                    <><Star className="mr-2 h-4 w-4 fill-white" /> Featured</>
                                                ) : (
                                                    <><StarOff className="mr-2 h-4 w-4" /> Feature</>
                                                )}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminFeaturedPage;
