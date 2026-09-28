import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/session';

/** Ends the admin session. The cookie is httpOnly, so only the server can remove it. */
export async function POST() {
    const response = NextResponse.json({ message: 'Logged out' });
    clearSessionCookie(response);
    return response;
}
