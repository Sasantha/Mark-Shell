"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/adminFetch";
import { Plus, Trash2, Loader2, Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AboutGalleryImage } from "@/types";

const AdminAboutGalleryPage = () => {
    const [images, setImages] = useState<AboutGalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Add Image Modal State
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [altText, setAltText] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Deletion Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<AboutGalleryImage | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/about-gallery');
                if (!response.ok) throw new Error('Failed to fetch gallery images');
                setImages(await response.json());
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    const imageCount = images.length;
    const isAtLimit = imageCount >= 6;

    const openAddModal = () => {
        if (isAtLimit) {
            alert('Maximum 6 images can be added to the gallery. Delete an existing image to add a new one.');
            return;
        }
        setImageFile(null);
        setImagePreview(null);
        setAltText("");
        setSaveError(null);
        setAddModalOpen(true);
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

    const handleSave = async () => {
        setSaveError(null);

        if (!imageFile) {
            setSaveError("Please select an image.");
            return;
        }

        if (isAtLimit) {
            alert('Maximum 6 images can be added to the gallery. Delete an existing image to add a new one.');
            return;
        }

        setIsSaving(true);

        try {
            const imageUrl = await uploadImageToCloudinary(imageFile);

            const payload = {
                image: imageUrl,
                alt: altText || undefined,
            };

            const response = await adminFetch('/api/about-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save image.');
            }

            const created = await response.json();
            setImages([...images, created]);
            setAddModalOpen(false);
        } catch (err) {
            console.error("Error adding gallery image:", err);
            setSaveError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = (image: AboutGalleryImage) => {
        setImageToDelete(image);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!imageToDelete) return;

        setIsDeleting(true);
        try {
            const response = await adminFetch(`/api/about-gallery/${imageToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete image');

            setImages(images.filter((img) => img.id !== imageToDelete.id));
            setDeleteModalOpen(false);
            setImageToDelete(null);
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete image.");
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
                    <h1 className="text-2xl font-bold text-gray-900">About Page Gallery</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage up to 6 images shown in the "From Forest to Fork" section of the About page.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`text-lg font-semibold px-4 py-2 rounded-lg border ${isAtLimit ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                        Images: {imageCount}/6
                    </div>
                    <Button onClick={openAddModal} className="bg-green-600 hover:bg-green-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                </div>
            </div>

            {/* Image Grid */}
            {images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <div key={image.id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="aspect-square overflow-hidden bg-gray-100">
                                <img
                                    src={image.image}
                                    alt={image.alt || "About gallery image"}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex items-center justify-between gap-2 p-3">
                                <p className="truncate text-xs text-gray-500">
                                    {image.alt || <span className="italic text-gray-400">No alt text</span>}
                                </p>
                                <button
                                    onClick={() => confirmDelete(image)}
                                    className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
                    <ImageIcon className="mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-gray-500">No gallery images added yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Add up to 6 images to display on the About page.</p>
                </div>
            )}

            {/* Add Image Modal */}
            {addModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Add Gallery Image</h2>
                            <button
                                onClick={() => setAddModalOpen(false)}
                                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                disabled={isSaving}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {saveError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                {saveError}
                            </div>
                        )}

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
                                        <p className="text-xs text-gray-400 mt-1">JPG or PNG, landscape or square recommended</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                            <input
                                type="text"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="e.g. Craftsman shaping a birchwood spoon (optional)"
                            />
                            <p className="text-xs text-gray-400 mt-1">Describes the image for accessibility and SEO.</p>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setAddModalOpen(false)}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isSaving ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : "Add Image"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && imageToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Delete Gallery Image</h2>
                        <p className="text-sm text-gray-600">
                            You are about to delete this image. This will remove it from the About page immediately.
                        </p>
                        <div className="h-32 w-full overflow-hidden rounded-lg bg-gray-100">
                            <img
                                src={imageToDelete.image}
                                alt={imageToDelete.alt || "Gallery image to delete"}
                                className="h-full w-full object-cover"
                            />
                        </div>

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

export default AdminAboutGalleryPage;
