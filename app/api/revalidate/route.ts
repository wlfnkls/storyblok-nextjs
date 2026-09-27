import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const secret = process.env.STORYBLOK_WEBHOOK_SECRET;
  const signature = request.headers.get('webhook-signature') ?? '';
  const rawBody = await request.text(); // sign the *raw* body, before JSON.parse

  if (!secret)
    return new Response('Webhook secret not configured', { status: 500 });

  const expected = createHmac('sha1', secret).update(rawBody).digest('hex');

  if (
    expected.length !== signature.length ||
    !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return new Response('Invalid signature', { status: 401 });
  }

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
