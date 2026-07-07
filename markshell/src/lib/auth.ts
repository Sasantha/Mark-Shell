import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
 * Verifies the Bearer token on an incoming request.
 * Returns the admin id if valid, otherwise null.
 */
export function verifyAdmin(request: Request): string | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, getJwtSecret()) as { id: string, role: string };
        if (decoded.role !== 'admin') return null;
        return decoded.id;
    } catch {
        return null;
    }
}

export function unauthorized() {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/** Escapes regex metacharacters so user input can be used safely in $regex queries. */
export function escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
