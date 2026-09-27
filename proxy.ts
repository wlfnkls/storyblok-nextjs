import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
    return new NextResponse(null, { status: 204 });
  }
}

export const config = {
  matcher: '/.well-known/appspecific/:path*',
};
