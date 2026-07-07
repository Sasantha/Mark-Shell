"use client";

import React, { useState, useEffect, use } from "react";
import { adminFetch } from "@/lib/adminFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditCertificationPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const router = useRouter();
    const { id } = use(params);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertification = async () => {
            try {
                const response = await fetch(`/api/certifications/${id}`);
                if (!response.ok) throw new Error('Failed to fetch certification');
                const data = await response.json();
                setName(data.name || "");
                setDescription(data.description || "");
                setExistingImage(data.image || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchCertification();
    }, [id]);

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
            setError("Certification name is required.");
            return;
        }

        setIsSaving(true);

        try {
            const imageUrl = imageFile ? await uploadImageToCloudinary(imageFile) : existingImage;

            const payload = {
                name,
                image: imageUrl,
                description: description || undefined,
            };

            const response = await adminFetch(`/api/certifications/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update certification.');
            }

            router.push("/admin/certifications");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    const displayPreview = imagePreview || existingImage;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/certifications" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ChevronLeft size={20} className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Certification</h1>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="border-gray-300 text-gray-700"
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isSaving}
                    >
                        {isSaving ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : <><Save size={16} className="mr-2" /> Update Certification</>}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="e.g. FSC Certified"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Optional short description shown under the certification on the homepage..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certification Image</label>

                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`border-2 border-dashed ${displayPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:bg-gray-50'} rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors group relative overflow-hidden`}>
                            {displayPreview ? (
                                <>
                                    <div className="absolute inset-0 opacity-20">
                                        <img src={displayPreview} alt="Preview" className="w-full h-full object-cover blur-sm" />
                                    </div>
                                    <ImageIcon className="h-10 w-10 text-green-600 mb-2 relative z-0" />
                                    <p className="text-sm font-medium text-green-700 relative z-0">Image selected</p>
                                    <p className="text-xs text-green-600 mt-1 relative z-0">Click or drag to change</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-gray-400 group-hover:text-green-500 transition-colors mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload badge/image</p>
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

export default EditCertificationPage;
