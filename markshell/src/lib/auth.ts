import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';
import { ADMIN_COOKIE, clearSessionCookie, decodeAdminToken, readCookie } from '@/lib/session';

/**
 * Verifies the admin session cookie on an incoming API request, including that
 * the token was issued after the admin's last password change.
 * Returns the admin id if valid, otherwise null.
 */
export async function verifyAdmin(request: Request): Promise<string | null> {
    const payload = decodeAdminToken(readCookie(request, ADMIN_COOKIE));
    if (!payload || !mongoose.isValidObjectId(payload.id)) return null;

    await dbConnect();
    const admin = await Admin.findById(payload.id).select('tokenVersion').lean<{ tokenVersion?: number }>();
    if (!admin || (admin.tokenVersion ?? 0) !== payload.v) return null;

    return payload.id;
}

/** 401 response that also clears the (invalid or missing) session cookie. */
export function unauthorized() {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    clearSessionCookie(response);
    return response;
}

/** Escapes regex metacharacters so user input can be used safely in $regex queries. */
export function escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
