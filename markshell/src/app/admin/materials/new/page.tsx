"use client";

import React, { useState } from "react";
import { adminFetch } from "@/lib/adminFetch";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminNewMaterialPage = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            setError("Material name is required.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const materialData = {
                name,
                description
            };

            const response = await adminFetch('/api/materials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(materialData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create material');
            }

            router.push('/admin/materials');
        } catch (err: any) {
            setError(err.message);
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-10 w-10 rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Material</h1>
                    <p className="text-sm text-gray-500 mt-1">Create a new product material.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Material Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Premium Bamboo"
                            required
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description of the material..."
                            rows={4}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-y"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="px-6"
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 px-6"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" /> Save Material</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminNewMaterialPage;
