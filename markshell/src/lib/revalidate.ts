import { revalidatePath } from 'next/cache';

/**
 * Public pages are pre-rendered and cached. Call this after an admin changes
 * catalog content so every page is rebuilt with fresh data on its next visit,
 * instead of waiting for the hourly revalidation.
 */
export function revalidatePublicPages() {
    revalidatePath('/', 'layout');
}
