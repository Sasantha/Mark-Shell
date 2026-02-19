"use client";

import React, { useState } from "react";
import Link from "next/link";
import { products as initialProducts } from "@/lib/dummy-data"; // Mock data
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminProductsPage = () => {
    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState("");

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showAll, setShowAll] = useState(false);

    const ITEMS_PER_PAGE = 5;

    // 1. Filter
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    // 2. Sort
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

    // 3. Paginate
    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

    const currentProducts = showAll
        ? sortedProducts
        : sortedProducts.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );

    // Handlers
    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((p) => p.id !== id));
        }
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Link href="/admin/products/new">
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 justify-between items-center">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full rounded-lg border border-gray-200 py-2 pl-10 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    {/* Show All Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 select-none">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${showAll ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white'}`}>
                            <input
                                type="checkbox"
                                checked={showAll}
                                onChange={(e) => setShowAll(e.target.checked)}
                                className="hidden"
                            />
                            {showAll && <span className="text-white text-[10px]">✓</span>}
                        </div>
                        Show All
                    </label>

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

            {/* Products Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Material</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
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
                                                <div className="font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-gray-400">{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">{product.material}</td>
                                    <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.isAvailable
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {product.isAvailable ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {!showAll && totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="text-xs text-gray-500">
                            Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)}</span> of <span className="font-medium">{sortedProducts.length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="h-8 w-8 bg-white"
                            >
                                <ChevronLeft size={14} />
                            </Button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === page
                                            ? "bg-green-600 text-white shadow-sm"
                                            : "text-gray-600 hover:bg-white hover:text-green-600"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="h-8 w-8 bg-white"
                            >
                                <ChevronRight size={14} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProductsPage;
