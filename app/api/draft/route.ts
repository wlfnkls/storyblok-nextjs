import { createHash, timingSafeEqual } from 'node:crypto';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

const MAX_AGE_SECONDS = 60 * 60; // accept links up to 1 hour old

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const spaceId = params.get('_storyblok_tk[space_id]');
  const timestamp = params.get('_storyblok_tk[timestamp]');
  const token = params.get('_storyblok_tk[token]');
  const slug = params.get('slug') ?? '';

  if (
    !spaceId ||
    !timestamp ||
    !token ||
    spaceId !== process.env.STORYBLOK_SPACE_ID
  ) {
    return new Response('Invalid preview request', { status: 401 });
  }

  const expected = createHash('sha1')
    .update(`${spaceId}:${process.env.STORYBLOK_PREVIEW_TOKEN}:${timestamp}`)
    .digest('hex');
  const tooOld = Date.now() / 1000 - Number(timestamp) > MAX_AGE_SECONDS;

  if (
    tooOld ||
    expected.length !== token.length ||
    !timingSafeEqual(Buffer.from(expected), Buffer.from(token))
  ) {
    return new Response('Invalid preview token', { status: 401 });
  }

  (await draftMode()).enable();

  // Build the path yourself; never redirect to an arbitrary user-supplied URL.
  const clean = slug.replace(/^\/+|\/+$/g, '');
  const path = clean === '' || clean === 'home' ? '/' : `/${clean}`;
  // Keep Storyblok's query params: the bridge needs `_storyblok` to know it is in the editor.
  redirect(`${path}?${params.toString()}`);
}
