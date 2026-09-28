import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * Turns an error thrown inside an API route into a safe response. Known client
 * mistakes get a specific 4xx; anything else is logged in full on the server
 * while the browser only sees a generic message, so internal details (database
 * hosts, driver errors, stack traces) are never exposed.
 */
export function apiError(error: unknown, context: string) {
    if (error instanceof mongoose.Error.ValidationError) {
        // Schema messages, e.g. "Path `name` is required."; safe and useful for the admin forms.
        const message = Object.values(error.errors).map(e => e.message).join(' ');
        return NextResponse.json({ error: message }, { status: 400 });
    }
    if (error instanceof mongoose.Error.CastError) {
        // e.g. /api/products/not-a-valid-id
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (error instanceof SyntaxError) {
        // request.json() on a malformed body
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    if ((error as { code?: number } | null)?.code === 11000) {
        return NextResponse.json({ error: 'A record with this value already exists' }, { status: 409 });
    }

    console.error(`${context}:`, error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
}
