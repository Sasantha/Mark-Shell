"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/adminFetch";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Partner } from "@/types";

const AdminPartnersPage = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Deletion Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch('/api/partners');
                if (!response.ok) throw new Error('Failed to fetch partners');
                setPartners(await response.json());
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartners();
    }, []);

    const confirmDelete = (partner: Partner) => {
        setPartnerToDelete(partner);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!partnerToDelete) return;

        setIsDeleting(true);
        try {
            const response = await adminFetch(`/api/partners/${partnerToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete partner');

            setPartners(partners.filter((p) => p.id !== partnerToDelete.id));
            setDeleteModalOpen(false);
            setPartnerToDelete(null);
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete partner.");
        } finally {
            setIsDeleting(false);
        }
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
                    <h1 className="text-2xl font-bold text-gray-900">Business Partners</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the partner logos shown on the homepage.</p>
                </div>
                <Link href="/admin/partners/new">
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Partner
                    </Button>
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-4">Partner</th>
                            <th className="px-6 py-4">Website</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {partners.length > 0 ? (
                            partners.map((partner) => (
                                <tr key={partner.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-20 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-1">
                                                <img
                                                    src={partner.logo}
                                                    alt={partner.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <div className="font-medium text-gray-900">
                                                {partner.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {partner.websiteUrl ? (
                                            <a
                                                href={partner.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-green-600 hover:underline"
                                            >
                                                Visit <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/partners/edit/${partner.id}`} className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(partner)}
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
                                    No partners added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && partnerToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Delete Partner</h2>
                        <p className="text-sm text-gray-600">
                            You are about to delete <strong>{partnerToDelete.name}</strong>. This will remove it from the homepage immediately.
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

export default AdminPartnersPage;
