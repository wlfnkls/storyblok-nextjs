import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

async function disable(request: NextRequest) {
  (await draftMode()).disable();

  // Only same-origin paths; "//host" would be protocol-relative (open redirect).
  const path = request.nextUrl.searchParams.get('path') ?? '/';
  const safePath = path.startsWith('/') && !path.startsWith('//') ? path : '/';

  // 303 so a POST from the banner form turns into a GET of the page
  return NextResponse.redirect(new URL(safePath, request.url), 303);
}

export { disable as GET, disable as POST };
