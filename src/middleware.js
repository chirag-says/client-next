import { NextResponse } from 'next/server';

/**
 * Next.js Middleware for Route Protection
 * 
 * DISABLED: Cookie-based middleware auth check is not possible when the frontend
 * and backend are on different domains (e.g., staging.dealdirect.in vs 
 * backend-staging.dealdirect.in). The 'user_session' cookie is scoped to the 
 * backend domain and is invisible to the frontend middleware.
 * 
 * Auth protection is fully handled client-side via AuthContext, which:
 * - Calls /api/users/me with credentials on mount
 * - Redirects to /login if not authenticated
 * - Guards each protected page component individually
 * 
 * TO RE-ENABLE: Set the backend cookie domain to '.dealdirect.in' (shared parent)
 * so both frontend and backend can access the same cookie. Then uncomment the
 * auth check logic below.
 */

export function middleware(request) {
    // Pass through all requests — auth is handled client-side by AuthContext
    return NextResponse.next();
}

export const config = {
    matcher: [],
};
