import 'server-only';
import { draftMode } from 'next/headers';

/** True in local dev or when the request has Next.js draft mode enabled (Visual Editor preview). */
export async function isDraftRequest(): Promise<boolean> {
  return process.env.NODE_ENV === 'development' || (await draftMode()).isEnabled;
}
