import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

const protectedRoutes = [
    '/',
    '/accounts',
    '/airtimes',
    '/bank-transfers',
    '/kbine',
    '/pass-payment',
    '/mass_qr',
    '/mobile-money',
    '/organisations',
    '/payments',
    '/profiles',
    '/qr-codes',
    '/supply',
    '/transactions',
    '/transferts',
    '/select-account',
    '/withdrawal'
]; // Routes réservées aux utilisateurs authentifiés
const publicOnlyRoutes = [
    '/login',
    '/register',
    'forgot-password'
];

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    const token = request.cookies.get('auth_token');

    if (protectedRoutes.some(route => pathname === route || (route !== '/' && pathname.startsWith(route))) && !token) {
        if (pathname === '/login') {
            return NextResponse.next();
        }
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Si l'utilisateur est authentifié et essaie d'accéder à une route publique uniquement
    if (publicOnlyRoutes.some(route => pathname.startsWith(route)) && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Dans tous les autres cas, on continue normalement
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. _next/static (static files)
         * 2. _next/image (image optimization files)
         * 3. favicon.ico (favicon file)
         * 4. public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};