"use client";

import React, { useState } from "react";
import { adminFetch } from "@/lib/adminFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddCategoryPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImageToCloudinary = async (file: File): Promise<string> => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

        if (!cloudName || !uploadPreset) {
            throw new Error("Cloudinary configuration is missing.");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload image to Cloudinary.");
        }

        const data = await response.json();
        return data.secure_url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.slug || !formData.description) {
            alert("Please fill in all required text fields.");
            return;
        }

        if (!imageFile) {
            alert("Please select an image for the category.");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Upload image to Cloudinary
            const imageUrl = await uploadImageToCloudinary(imageFile);

            // 2. Prepare payload for DB
            const payload = {
                ...formData,
                image: imageUrl,
                itemCount: 0 // Default starting count
            };

            // 3. Save to database via API
            const response = await adminFetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save category.');
            }

            alert("Category added successfully!");
            router.push("/admin/categories");
        } catch (error: any) {
            console.error("Error creating category:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
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
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isLoading}
                    >
                        {isLoading ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : <><Save size={16} className="mr-2" /> Save Category</>}
                    </Button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="e.g. Cutlery Kits"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL Friendly) *</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 text-gray-600 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono text-sm"
                        placeholder="e.g. cutlery-kits"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Brief description of the category..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Image *</label>

                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`border-2 border-dashed ${imagePreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:bg-gray-50'} rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors group relative overflow-hidden`}>
                            {imagePreview ? (
                                <>
                                    <div className="absolute inset-0 opacity-20">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover blur-sm" />
                                    </div>
                                    <ImageIcon className="h-10 w-10 text-green-600 mb-2 relative z-0" />
                                    <p className="text-sm font-medium text-green-700 relative z-0">Image selected</p>
                                    <p className="text-xs text-green-600 mt-1 relative z-0">Click or drag to change</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-gray-400 group-hover:text-green-500 transition-colors mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload image</p>
                                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG (max 2MB)</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddCategoryPage;
