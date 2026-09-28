import dbConnect from '@/lib/mongoose';
import RateLimit from '@/models/RateLimit';

/**
 * The client's IP as reported by the hosting proxy. Vercel overwrites
 * x-forwarded-for itself, so visitors can't spoof it there; if the site is
 * ever hosted elsewhere, make sure that proxy does the same.
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    return forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Fixed-window rate limiter stored in MongoDB, so the count is shared by all
 * serverless instances. Records one hit for `key` and reports whether it is
 * within `limit` hits per `windowMs`. Fails open: if the counter can't be
 * updated, the request is allowed rather than locking everyone out.
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const windowEnd = windowStart + windowMs;
    const retryAfterSeconds = Math.ceil((windowEnd - now) / 1000);

    try {
        await dbConnect();
        const counter = await RateLimit.findOneAndUpdate(
            { key, windowStart: new Date(windowStart) },
            { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(windowEnd) } },
            { upsert: true, returnDocument: 'after' }
        );
        return { allowed: counter.count <= limit, retryAfterSeconds };
    } catch (error) {
        console.error('Rate limit check failed; allowing request:', error);
        return { allowed: true, retryAfterSeconds };
    }
}
