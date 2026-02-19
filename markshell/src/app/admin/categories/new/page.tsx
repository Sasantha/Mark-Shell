"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddCategoryPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Auto-generate slug from name if slug is being updated automatically (optional enhancement)
        if (name === "name" && !formData.slug) {
            setFormData((prev) => ({
                ...prev,
                name: value,
                slug: value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            alert("Category added successfully! (Mock Action)");
            setIsLoading(false);
            router.push("/admin/categories");
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/categories" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ChevronLeft size={20} className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="border-gray-300 text-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : <><Save size={16} className="mr-2" /> Save Category</>}
                    </Button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="e.g. Cutlery Kits"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL Friendly)</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 text-gray-600 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono text-sm"
                        placeholder="e.g. cutlery-kits"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Brief description of the category..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                        <Upload className="h-10 w-10 text-gray-400 group-hover:text-green-500 transition-colors mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG (max 2MB)</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddCategoryPage;
