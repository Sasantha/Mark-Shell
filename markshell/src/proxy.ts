import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, decodeAdminToken } from '@/lib/session';

/**
 * Keeps the admin screens private: logged-out visitors are redirected to the
 * login page before any admin page is served. This checks only the token's
 * signature and expiry; every admin API route still does the full check in
 * verifyAdmin(), including whether the password has changed since sign-in.
 */
export function proxy(request: NextRequest) {
    const isLoggedIn = decodeAdminToken(request.cookies.get(ADMIN_COOKIE)?.value) !== null;
    const isLoginPage = request.nextUrl.pathname === '/admin/login';

    if (!isLoggedIn && !isLoginPage) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
