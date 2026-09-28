import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Paid plans: Storyblok signs the *raw* body with the webhook secret (HMAC-SHA1, hex). */
function hasValidSignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  const expected = createHmac('sha1', secret).update(rawBody).digest('hex');
  return safeEqual(expected, signature);
}

/** Free plan (no webhook secret): the secret is appended to the endpoint as `?secret=`. */
function hasValidToken(token: string, secret: string): boolean {
  return safeEqual(token, secret);
}

export function isAuthorizedWebhook(
  request: Request,
  rawBody: string,
  secret: string,
): boolean {
  const signature = request.headers.get('webhook-signature') ?? '';
  const token = new URL(request.url).searchParams.get('secret') ?? '';

  return (
    hasValidSignature(rawBody, signature, secret) ||
    hasValidToken(token, secret)
  );
}
