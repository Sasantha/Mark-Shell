/**
 * Copies only the allowed fields from an untrusted request body, so a request
 * can't set fields the form never sends (e.g. isFeatured, which has its own
 * route that enforces the 6-product cap).
 */
export function pick(body: unknown, fields: readonly string[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (!body || typeof body !== 'object' || Array.isArray(body)) return result;

    for (const field of fields) {
        if (Object.hasOwn(body, field)) {
            result[field] = (body as Record<string, unknown>)[field];
        }
    }
    return result;
}
