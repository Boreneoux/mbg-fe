import { NextRequest, NextResponse } from 'next/server';

type JwtPayload = {
  id: number;
  role: 'user' | 'store_admin' | 'super_admin';
  exp: number;
};

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split('.')[1];
    const decoded = JSON.parse(atob(base64Payload));
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}

const AUTH_ROUTES = ['/auth'];
const USER_ROUTES = ['/account', '/cart', '/checkout'];
const ADMIN_ROUTES = ['/dashboard'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  let payload: JwtPayload | null = null;

  if (token) {
    payload = decodeJwt(token);
    if (payload && payload.exp * 1000 < Date.now()) {
      payload = null;
    }
  }

  const isAuthenticated = !!payload;
  const role = payload?.role;

  // Redirect logged-in users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  if (isAuthRoute && isAuthenticated) {
    const dest = role === 'user' ? '/' : '/dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Protect user-only routes
  const isUserRoute = USER_ROUTES.some((r) => pathname.startsWith(r));
  if (isUserRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (role !== 'user') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Protect admin routes
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (role === 'user') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
