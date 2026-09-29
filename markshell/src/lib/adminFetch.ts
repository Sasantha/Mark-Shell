"use client";

/**
 * fetch wrapper for admin pages. The session lives in an httpOnly cookie that
 * the browser sends automatically; this sends the admin back to the login page
 * when the API rejects the session (expired, logged out, or password changed).
 */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const response = await fetch(input, init);

    if (response.status === 401) {
        window.location.href = "/admin/login?expired=true";
    }

    return response;
}
