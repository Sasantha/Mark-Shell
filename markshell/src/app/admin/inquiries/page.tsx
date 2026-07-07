"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/adminFetch";
import { Mail, Phone, Trash2, Loader2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "new" | "read" | "resolved";

const statusStyles: Record<string, string> = {
    new: "bg-green-100 text-green-700",
    read: "bg-blue-100 text-blue-700",
    resolved: "bg-gray-100 text-gray-500",
};

const AdminInquiriesPage = () => {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    // Deletion Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [inquiryToDelete, setInquiryToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const response = await adminFetch('/api/inquiries');
                if (!response.ok) {
                    throw new Error('Failed to fetch inquiries');
                }
                const data = await response.json();
                setInquiries(data);
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching inquiries:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInquiries();
    }, []);

    const filteredInquiries = statusFilter === "all"
        ? inquiries
        : inquiries.filter((i) => i.status === statusFilter);

    const updateStatus = async (inquiry: any, status: string) => {
        try {
            const response = await adminFetch(`/api/inquiries/${inquiry.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update inquiry status');
            }

            const updated = await response.json();
            setInquiries(inquiries.map((i) => i.id === updated.id ? updated : i));
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update inquiry status.");
        }
    };

    const confirmDelete = (inquiry: any) => {
        setInquiryToDelete(inquiry);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!inquiryToDelete) return;

        setIsDeleting(true);
        try {
            const response = await adminFetch(`/api/inquiries/${inquiryToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete inquiry');
            }

            setInquiries(inquiries.filter((i) => i.id !== inquiryToDelete.id));
            setDeleteModalOpen(false);
            setInquiryToDelete(null);
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete inquiry.");
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
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
                <p className="text-sm text-gray-500 mt-1">Quote requests and contact messages submitted through the website.</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                {(["all", "new", "read", "resolved"] as StatusFilter[]).map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                            statusFilter === s
                                ? "bg-green-600 text-white"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        )}
                    >
                        {s} {s !== "all" && `(${inquiries.filter((i) => i.status === s).length})`}
                    </button>
                ))}
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
                {filteredInquiries.length > 0 ? (
                    filteredInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Circle size={8} className={cn("fill-current", statusStyles[inquiry.status]?.split(" ")[1] ?? "text-gray-400")} />
                                        <h3 className="font-bold text-gray-900">{inquiry.name}</h3>
                                        {inquiry.company && <span className="text-sm text-gray-400">· {inquiry.company}</span>}
                                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full capitalize", statusStyles[inquiry.status])}>
                                            {inquiry.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            {inquiry.contactMethod === "email" ? <Mail size={14} /> : <Phone size={14} />}
                                            {inquiry.contactValue}
                                        </span>
                                        <span className="text-gray-300">|</span>
                                        <span>{inquiry.source === "popup" ? "Quote Popup" : "Contact Page"}</span>
                                        {inquiry.contextType !== "general" && (
                                            <>
                                                <span className="text-gray-300">|</span>
                                                <span className="capitalize">{inquiry.contextType}: {inquiry.contextValue}</span>
                                            </>
                                        )}
                                    </div>

                                    <p className="text-gray-700 mt-3 whitespace-pre-line">{inquiry.message}</p>

                                    <p className="text-xs text-gray-400 mt-3">
                                        {new Date(inquiry.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex md:flex-col gap-2 flex-shrink-0">
                                    <select
                                        value={inquiry.status}
                                        onChange={(e) => updateStatus(inquiry, e.target.value)}
                                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
                                    >
                                        <option value="new">New</option>
                                        <option value="read">Read</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => confirmDelete(inquiry)}
                                        className="text-red-500 border-gray-200 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 size={14} className="mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500">No inquiries {statusFilter !== "all" ? `with status "${statusFilter}"` : "yet"}.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && inquiryToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Delete Inquiry</h2>
                        <p className="text-sm text-gray-600">
                            You are about to permanently delete the inquiry from <strong>{inquiryToDelete.name}</strong>.
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

export default AdminInquiriesPage;
