"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/adminFetch";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Certification } from "@/types";

const AdminCertificationsPage = () => {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Deletion Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [certToDelete, setCertToDelete] = useState<Certification | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const response = await fetch('/api/certifications');
                if (!response.ok) throw new Error('Failed to fetch certifications');
                setCertifications(await response.json());
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertifications();
    }, []);

    const confirmDelete = (cert: Certification) => {
        setCertToDelete(cert);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!certToDelete) return;

        setIsDeleting(true);
        try {
            const response = await adminFetch(`/api/certifications/${certToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete certification');

            setCertifications(certifications.filter((c) => c.id !== certToDelete.id));
            setDeleteModalOpen(false);
            setCertToDelete(null);
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete certification.");
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
                    <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the product certifications shown on the homepage.</p>
                </div>
                <Link href="/admin/certifications/new">
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Certification
                    </Button>
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-4">Certification</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {certifications.length > 0 ? (
                            certifications.map((cert) => (
                                <tr key={cert.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-1">
                                                <img
                                                    src={cert.image}
                                                    alt={cert.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <div className="font-medium text-gray-900">
                                                {cert.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate">{cert.description || "-"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/certifications/edit/${cert.id}`} className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(cert)}
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
                                    No certifications added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && certToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Delete Certification</h2>
                        <p className="text-sm text-gray-600">
                            You are about to delete <strong>{certToDelete.name}</strong>. This will remove it from the homepage immediately.
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

export default AdminCertificationsPage;
