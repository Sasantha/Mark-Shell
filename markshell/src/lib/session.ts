import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/** Name of the httpOnly cookie that holds the admin session token. */
export const ADMIN_COOKIE = 'admin_token';

/** Admin sessions last 8 hours; after that the admin logs in again. */
export const SESSION_SECONDS = 8 * 60 * 60;

export interface AdminTokenPayload {
    id: string;
    role: string;
    /** Admin.tokenVersion at sign-in; bumping it on the account revokes the token. */
    v: number;
}

export function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error(
            'Please define the JWT_SECRET environment variable inside .env'
        );
    }
    return secret;
}

/**
 * Checks a session token's signature, expiry and role, without touching the
 * database. Used by proxy.ts to guard admin pages; API routes use
 * verifyAdmin() in lib/auth.ts, which also checks the token version.
 */
export function decodeAdminToken(token: string | null | undefined): AdminTokenPayload | null {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, getJwtSecret()) as AdminTokenPayload;
        return decoded.role === 'admin' ? decoded : null;
    } catch {
        return null;
    }
}

/** Reads one cookie from a request's Cookie header. */
export function readCookie(request: Request, name: string): string | null {
    const header = request.headers.get('cookie');
    if (!header) return null;
    for (const part of header.split(';')) {
        const [key, ...value] = part.trim().split('=');
        if (key === name) return decodeURIComponent(value.join('='));
    }
    return null;
}

const cookieOptions = {
    httpOnly: true, // not readable by page JavaScript, so an XSS bug can't steal it
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const, // not sent on cross-site POST/PUT/DELETE, which blocks CSRF
    path: '/',
};

/** Signs a new session token for this admin and sets it as the session cookie. */
export function setSessionCookie(response: NextResponse, admin: { _id: unknown; tokenVersion?: number }) {
    const payload: AdminTokenPayload = { id: String(admin._id), role: 'admin', v: admin.tokenVersion ?? 0 };
    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: SESSION_SECONDS });
    response.cookies.set(ADMIN_COOKIE, token, { ...cookieOptions, maxAge: SESSION_SECONDS });
}

export function clearSessionCookie(response: NextResponse) {
    response.cookies.set(ADMIN_COOKIE, '', { ...cookieOptions, maxAge: 0 });
}
