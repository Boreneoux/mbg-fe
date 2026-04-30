import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.BACKEND_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');
const SKIP_HEADERS = ['transfer-encoding', 'connection', 'keep-alive', 'content-encoding'];

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const targetUrl = `${BACKEND_URL}/${path.join('/')}${request.nextUrl.search}`;

  const forwardHeaders = new Headers();
  for (const key of ['content-type', 'authorization', 'cookie']) {
    const value = request.headers.get(key);
    if (value) forwardHeaders.set(key, value);
  }

  let body: ArrayBuffer | undefined;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 0) body = buf;
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
      redirect: 'manual',
    });
  } catch {
    return NextResponse.json({ message: 'Backend unreachable' }, { status: 502 });
  }

  // Build response headers before constructing NextResponse
  const responseHeaders = new Headers();
  const rawCookies: string[] = [];

  backendRes.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (SKIP_HEADERS.includes(lower)) return;
    if (lower === 'set-cookie') {
      rawCookies.push(value);
      return;
    }
    responseHeaders.set(key, value);
  });

  // Apply cookies without Domain so they land on the frontend domain
  for (const cookie of rawCookies) {
    responseHeaders.append('set-cookie', stripDomain(cookie));
  }

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
    headers: responseHeaders,
  });
}

function stripDomain(setCookieHeader: string): string {
  return setCookieHeader
    .split(';')
    .map(p => p.trim())
    .filter(p => !p.toLowerCase().startsWith('domain='))
    .join('; ');
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
