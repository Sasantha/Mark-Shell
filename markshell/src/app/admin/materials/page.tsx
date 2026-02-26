"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, ArrowUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminMaterialsPage = () => {
    const [materials, setMaterials] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Deletion Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Sorting State
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await fetch('/api/materials');
                if (!response.ok) {
                    throw new Error('Failed to fetch materials');
                }
                const data = await response.json();
                setMaterials(data);
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching materials:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    // 1. Filter
    const filteredMaterials = materials.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    // 2. Sort
    const sortedMaterials = [...filteredMaterials].sort((a, b) => {
        return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });


    // Handlers
    const confirmDelete = (material: any) => {
        setMaterialToDelete(material);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!materialToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/materials/${materialToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete material');
            }

            setMaterials(materials.filter((m) => m._id !== materialToDelete.id && m.id !== materialToDelete.id));
            setDeleteModalOpen(false);
            setMaterialToDelete(null);
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete material.");
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (error) {
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
                    <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the materials available for your products.</p>
                </div>

                <Link href="/admin/materials/new">
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Material
                    </Button>
                </Link>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 justify-between items-center">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search materials..."
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

            {/* Materials Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-4">Material Name</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedMaterials.length > 0 ? (
                            sortedMaterials.map((material) => (
                                <tr key={material.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {material.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">{material.description || "-"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/materials/edit/${material.id}`} className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(material)}
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
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    No materials found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && materialToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Delete Material</h2>
                        <p className="text-sm text-gray-600">
                            You are about to delete <strong>{materialToDelete.name}</strong>.
                            Warning: Any products currently using this material will retain the string '<strong>{materialToDelete.name}</strong>', but it will no longer appear as an option for new products.
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteModalOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isDeleting ? "Deleting..." : "Confirm & Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMaterialsPage;
