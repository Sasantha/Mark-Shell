"use client";

import { adminFetch } from "@/lib/adminFetch";

/**
 * Uploads an image straight to Cloudinary using a short-lived signature from
 * /api/upload-signature, so only logged-in admins can upload.
 * Returns the uploaded image's secure URL.
 */
export async function uploadImage(file: File): Promise<string> {
    const signatureResponse = await adminFetch("/api/upload-signature", { method: "POST" });
    if (!signatureResponse.ok) {
        throw new Error("Could not authorize the image upload.");
    }

    const { cloudName, apiKey, params, signature } = await signatureResponse.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("signature", signature);
    for (const [key, value] of Object.entries(params as Record<string, string>)) {
        formData.append(key, value);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        // e.g. "Image file format heic not allowed"
        throw new Error(data?.error?.message || "Failed to upload image to Cloudinary.");
    }

    return data.secure_url;
}
