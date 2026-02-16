import { NextResponse } from 'next/server';

/**
 * Next.js Middleware for Route Protection
 * 
 * This is a FIRST LINE of defense only — it checks for the presence of auth cookies.
 * The actual authentication validation still happens client-side via AuthContext.
 * 
 * If no auth cookie is found, the user is redirected to /login with the original path
 * stored as a query parameter so they can be redirected back after login.
 */

// Routes that require authentication
const PROTECTED_PATHS = [
    '/profile',
    '/saved-properties',
    '/notifications',
    '/agreements',
    '/add-property',
    '/edit-property',
    '/my-properties',
];

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Check if the path is protected
    const isProtected = PROTECTED_PATHS.some(
        (path) => pathname === path || pathname.startsWith(path + '/')
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    // Check for auth cookie — the backend sets it as 'user_session'
    // (defined in backend/middleware/authUser.js → COOKIE_CONFIG.name)
    const authToken = request.cookies.get('user_session');

    if (!authToken) {
        // No auth cookie found — redirect to login with return URL
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Cookie exists — let the request proceed
    // (The actual token validation happens server-side on API calls)
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/saved-properties/:path*',
        '/notifications/:path*',
        '/agreements/:path*',
        '/add-property/:path*',
        '/edit-property/:path*',
        '/my-properties/:path*',
    ],
};
