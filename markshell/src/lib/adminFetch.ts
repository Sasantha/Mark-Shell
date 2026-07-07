"use client";

/**
 * fetch wrapper for admin pages: attaches the stored JWT as a Bearer token
 * and redirects to the login page when the API rejects it (expired/invalid).
 */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem("admin_token");

    const headers = new Headers(init.headers);
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(input, { ...init, headers });

    if (response.status === 401) {
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login?expired=true";
    }

    return response;
}
