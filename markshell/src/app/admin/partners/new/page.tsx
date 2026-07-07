"use client";

import React, { useState } from "react";
import { adminFetch } from "@/lib/adminFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddPartnerPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");

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
        setError(null);

        if (!name) {
            setError("Partner name is required.");
            return;
        }

        if (!imageFile) {
            setError("Please select a logo image.");
            return;
        }

        setIsLoading(true);

        try {
            const logoUrl = await uploadImageToCloudinary(imageFile);

            const payload = {
                name,
                logo: logoUrl,
                websiteUrl: websiteUrl || undefined,
            };

            const response = await adminFetch('/api/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save partner.');
            }

            router.push("/admin/partners");
        } catch (err) {
            console.error("Error creating partner:", err);
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/partners" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ChevronLeft size={20} className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Add Business Partner</h1>
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
                        {isLoading ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : <><Save size={16} className="mr-2" /> Save Partner</>}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 mb-6">
                    {error}
                </div>
            )}

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="e.g. Acme Logistics Ltd"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                    <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="https://partner-website.com (optional)"
                    />
                    <p className="text-xs text-gray-400 mt-1">If provided, the logo on the homepage will link here.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partner Logo *</label>

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
                                    <p className="text-sm font-medium text-green-700 relative z-0">Logo selected</p>
                                    <p className="text-xs text-green-600 mt-1 relative z-0">Click or drag to change</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-gray-400 group-hover:text-green-500 transition-colors mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload logo</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG with transparent background recommended</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPartnerPage;
