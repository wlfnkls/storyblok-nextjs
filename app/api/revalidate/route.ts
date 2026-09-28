import { revalidateTag } from 'next/cache';

import { isAuthorizedWebhook } from '@/lib/storyblok/webhook';

export async function POST(request: Request) {
  const secret = process.env.STORYBLOK_WEBHOOK_SECRET;
  const rawBody = await request.text(); // sign the *raw* body, before JSON.parse

  if (!secret)
    return new Response('Webhook secret not configured', { status: 500 });

  if (!isAuthorizedWebhook(request, rawBody, secret))
    return new Response('Unauthorized webhook', { status: 401 });

  const payload = JSON.parse(rawBody) as {
    action?: string;
    full_slug?: string;
  };
  revalidateTag('storyblok', 'max');

  return Response.json({
    revalidated: true,
    action: payload.action,
    slug: payload.full_slug,
  });
}
