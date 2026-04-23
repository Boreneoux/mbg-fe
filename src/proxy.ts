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

function isTokenExpired(payload: JwtPayload): boolean {
  return payload.exp * 1000 < Date.now();
}

async function tryRefresh(
  request: NextRequest
): Promise<{ payload: JwtPayload; response: NextResponse } | null> {
  const refreshToken = request.cookies.get('refresh_token')?.value;
  if (!refreshToken) return null;

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: `refresh_token=${refreshToken}` }
    });

    if (!res.ok) return null;

    // Forward the new cookies (access_token + refresh_token) to the browser
    const response = NextResponse.next();
    const setCookies =
      res.headers.getSetCookie?.() ??
      res.headers.get('set-cookie')?.split(', ') ??
      [];

    for (const cookie of setCookies) {
      response.headers.append('Set-Cookie', cookie);
    }

    // Decode the new access_token to get the fresh payload
    const accessCookie = setCookies.find(c => c.startsWith('access_token='));
    if (!accessCookie) return null;

    const tokenValue = accessCookie.split(';')[0].replace('access_token=', '');
    const payload = decodeJwt(tokenValue);
    if (!payload) return null;

    return { payload, response };
  } catch {
    return null;
  }
}

const AUTH_ROUTES = ['/auth'];
const AUTH_ROUTES_EXEMPT = ['/auth/complete-profile', '/auth/callback'];
const USER_ROUTES = ['/account', '/cart', '/checkout'];
const ADMIN_ROUTES = ['/dashboard'];
const ADMIN_AUTH_ROUTES = ['/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  let payload: JwtPayload | null = null;
  let refreshedResponse: NextResponse | null = null;

  if (token) {
    payload = decodeJwt(token);
    if (payload && isTokenExpired(payload)) {
      payload = null;
    }
  }

  // Access token missing or expired — try a silent refresh before deciding anything
  if (!payload) {
    const refreshed = await tryRefresh(request);
    if (refreshed) {
      payload = refreshed.payload;
      refreshedResponse = refreshed.response;
    }
  }

  const isAuthenticated = !!payload;
  const role = payload?.role;
  const isAdmin = role === 'store_admin' || role === 'super_admin';

  function redirect(dest: string) {
    const res = NextResponse.redirect(new URL(dest, request.url));

    if (refreshedResponse) {
      const newCookies = refreshedResponse.headers.getSetCookie?.() ?? [];
      for (const cookie of newCookies) {
        res.headers.append('Set-Cookie', cookie);
      }
    }
    return res;
  }

  // Redirect logged-in users away from /auth/* pages
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r));
  const isAuthExempt = AUTH_ROUTES_EXEMPT.some(r => pathname.startsWith(r));
  if (isAuthRoute && !isAuthExempt && isAuthenticated) {
    return redirect(isAdmin ? '/dashboard' : '/');
  }

  // Redirect logged-in users away from /admin/* (e.g. /admin/login)
  const isAdminAuthRoute = ADMIN_AUTH_ROUTES.some(r => pathname.startsWith(r));
  if (isAdminAuthRoute && isAuthenticated) {
    return redirect(isAdmin ? '/dashboard' : '/');
  }

  // Protect user-only routes
  const isUserRoute = USER_ROUTES.some(r => pathname.startsWith(r));
  if (isUserRoute) {
    if (!isAuthenticated) return redirect('/auth/login');
    if (isAdmin) return redirect('/dashboard');
  }

  // Protect admin routes
  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r));
  if (isAdminRoute) {
    if (!isAuthenticated) return redirect('/admin/login');
    if (!isAdmin) return redirect('/');
  }

  // Return the refreshed response (carries new cookies) or a plain next()
  return refreshedResponse ?? NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)']
};
