"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditProductPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Dynamic Categories
    const [categories, setCategories] = useState<any[]>([]);

    // Image Upload State
    const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null]);
    const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null]);
    const [mainImageIndex, setMainImageIndex] = useState<number>(0);
    const [existingImages, setExistingImages] = useState<(string | null)[]>([null, null, null, null]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        subname: "",
        category: "",
        material: "",
        price: "",
        description: "",
        isAvailable: true,
    });

    useEffect(() => {
        // Fetch categories to populate the select dropdown
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const response = await fetch(`/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        name: data.name || "",
                        subname: data.subname || "",
                        category: data.category || "",
                        material: data.material || "",
                        price: data.price ? data.price.toString() : "",
                        description: data.longDescription || data.description || "",
                        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
                    });

                    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                        const loadedImages = [null, null, null, null] as (string | null)[];
                        const loadedPreviews = [null, null, null, null] as (string | null)[];

                        // Main image logic
                        let mainIdx = 0;
                        if (data.image) {
                            mainIdx = data.images.indexOf(data.image);
                            if (mainIdx === -1) mainIdx = 0;
                        }
                        setMainImageIndex(mainIdx);

                        for (let i = 0; i < Math.min(data.images.length, 4); i++) {
                            loadedImages[i] = data.images[i];
                            loadedPreviews[i] = data.images[i];
                        }

                        setExistingImages(loadedImages);
                        setImagePreviews(loadedPreviews);
                    } else if (data.image) {
                        // Fallback if only main image exists
                        setMainImageIndex(0);
                        setExistingImages([data.image, null, null, null]);
                        setImagePreviews([data.image, null, null, null]);
                    }
                } else {
                    alert("Failed to fetch product data.");
                    router.push("/admin/products");
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
                alert("Error fetching product.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchProduct();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setFormData((prev) => ({ ...prev, isAvailable: val === "active" }));
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            setImageFiles(prev => {
                const newFiles = [...prev];
                newFiles[index] = file;
                return newFiles;
            });

            setImagePreviews(prev => {
                const newPreviews = [...prev];
                // Revoke old object URL if exists to avoid memory leaks
                if (newPreviews[index] && newPreviews[index]?.startsWith('blob:')) {
                    URL.revokeObjectURL(newPreviews[index] as string);
                }
                newPreviews[index] = URL.createObjectURL(file);
                return newPreviews;
            });

            // If replacing an existing image, mark it as null so we know it's overwritten
            setExistingImages(prev => {
                const newExisting = [...prev];
                newExisting[index] = null;
                return newExisting;
            });

            // If they upload their first ever image, make it the main image automatically
            if (imageFiles.every(f => f === null) && existingImages.every(img => img === null)) {
                setMainImageIndex(index);
            }
        }
    };

    const handleRemoveImage = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();

        setImageFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = null;
            return newFiles;
        });

        setImagePreviews(prev => {
            const newPreviews = [...prev];
            if (newPreviews[index] && newPreviews[index]?.startsWith('blob:')) {
                URL.revokeObjectURL(newPreviews[index] as string);
            }
            newPreviews[index] = null;
            return newPreviews;
        });

        setExistingImages(prev => {
            const newExisting = [...prev];
            newExisting[index] = null;
            return newExisting;
        });

        // If removing the main image, try to assign a new main image
        if (index === mainImageIndex) {
            const nextAvailableFile = imageFiles.findIndex((f, i) => i !== index && f !== null);
            const nextAvailableExisting = existingImages.findIndex((f, i) => i !== index && f !== null);

            if (nextAvailableFile !== -1) setMainImageIndex(nextAvailableFile);
            else if (nextAvailableExisting !== -1) setMainImageIndex(nextAvailableExisting);
            else setMainImageIndex(0);
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

        if (!formData.name || !formData.category || !formData.material || !formData.price || !formData.description) {
            alert("Please fill in all required fields.");
            return;
        }

        const hasAnyImage = imageFiles.some(f => f !== null) || existingImages.some(img => img !== null);

        if (!hasAnyImage) {
            alert("Please provide at least one image for the product.");
            return;
        }

        if (imageFiles[mainImageIndex] === null && existingImages[mainImageIndex] === null) {
            alert("The selected main image is empty. Please select a valid main image.");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Upload new files to Cloudinary concurrently
            const allUrls: (string | null)[] = [null, null, null, null];

            for (let i = 0; i < 4; i++) {
                if (imageFiles[i]) {
                    allUrls[i] = await uploadImageToCloudinary(imageFiles[i] as File);
                } else if (existingImages[i]) {
                    allUrls[i] = existingImages[i];
                }
            }

            const mainImageUrl = allUrls[mainImageIndex] as string;
            const validUrls = allUrls.filter(url => url !== null) as string[];
            const otherUrls = validUrls.filter(url => url !== mainImageUrl);

            // 2. Prepare payload for DB
            const payload = {
                name: formData.name,
                subname: formData.subname,
                category: formData.category,
                material: formData.material,
                image: mainImageUrl, // Save main image to primary field
                price: parseFloat(formData.price),
                isAvailable: formData.isAvailable,
                longDescription: formData.description,
                images: [mainImageUrl, ...otherUrls] // Save all images (main first)
            };

            // 3. Save to database via API
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update product.');
            }

            alert("Product updated successfully!");
            router.push("/admin/products");
        } catch (error: any) {
            console.error("Error updating product:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ChevronLeft size={20} className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
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
                        {isLoading ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : <><Save size={16} className="mr-2" /> Update Product</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">General Information</h2>

                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="e.g. 160mm Heavy-Duty Spoon"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subname / Tagline</label>
                                <input
                                    type="text"
                                    name="subname"
                                    value={formData.subname}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="e.g. Premium Birchwood • Wax-free"
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
                                    placeholder="Detailed product description..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Pricing & Inventory</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price ($) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    onChange={handleStatusChange}
                                    value={formData.isAvailable ? "active" : "inactive"}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Organization</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
                            <select
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            >
                                <option value="">Select Material</option>
                                <option value="Birchwood">Birchwood</option>
                                <option value="Bamboo">Bamboo</option>
                                <option value="Bagasse">Bagasse</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Media *</h2>
                                <p className="text-xs text-gray-500">Upload up to 4 images. Select the star to set the main image.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map((index) => (
                                <div key={index} className="relative aspect-square">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(index, e)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`w-full h-full border-2 border-dashed ${imagePreviews[index] ? (mainImageIndex === index ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50') : 'border-gray-300 hover:bg-gray-50'} rounded-lg p-2 flex flex-col items-center justify-center text-center transition-colors group relative overflow-hidden`}>
                                        {imagePreviews[index] ? (
                                            <>
                                                <div className="absolute inset-0">
                                                    <img src={imagePreviews[index]!} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                </div>

                                                {/* Backdrop for buttons */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setMainImageIndex(index);
                                                        }}
                                                        className={`rounded-full shadow-lg ${mainImageIndex === index ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                                                    >
                                                        {mainImageIndex === index ? '⭐ Main Image' : 'Set as Main'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={(e) => handleRemoveImage(index, e)}
                                                        className="rounded-full shadow-lg h-8 px-3"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>

                                                {/* Main Image Badge (always visible if it's main) */}
                                                {mainImageIndex === index && (
                                                    <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                        MAIN
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-6 w-6 text-gray-400 mb-2 group-hover:text-green-500 transition-colors" />
                                                <p className="text-[10px] text-gray-500">Image {index + 1}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProductPage;
