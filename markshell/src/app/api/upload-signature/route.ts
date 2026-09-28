import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { verifyAdmin, unauthorized } from '@/lib/auth';

// Cloudinary rejects any other format. SVG stays allowed for partner and certification logos.
const ALLOWED_FORMATS = 'jpg,jpeg,png,webp,avif,gif,svg';

/**
 * Signs a Cloudinary upload for a logged-in admin, replacing the old unsigned
 * upload preset that let anyone upload to the account. The API secret never
 * leaves the server, and Cloudinary rejects signatures older than one hour.
 * https://cloudinary.com/documentation/authentication_signatures
 */
export async function POST(request: Request) {
    if (!(await verifyAdmin(request))) {
        return unauthorized();
    }

    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        console.error('Upload signing failed: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET not configured.');
        return NextResponse.json({ error: 'Image uploads are not configured.' }, { status: 500 });
    }

    // Every parameter sent to Cloudinary, other than file and api_key, must be part of the signature.
    const params: Record<string, string> = {
        allowed_formats: ALLOWED_FORMATS,
        timestamp: Math.round(Date.now() / 1000).toString(),
    };

    const payload = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
    const signature = crypto.createHash('sha1').update(payload + CLOUDINARY_API_SECRET).digest('hex');

    return NextResponse.json({
        cloudName: CLOUDINARY_CLOUD_NAME,
        apiKey: CLOUDINARY_API_KEY,
        params,
        signature,
    });
}
