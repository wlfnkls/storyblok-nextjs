import type { StoryblokAsset } from '@/types/storyblok/storyblok';

/**
 * Maps a Storyblok focal point ("x1xy1:x2xy2" in pixels) to a CSS
 * object-position, using the original dimensions encoded in the asset URL
 * (/f/<space>/<W>x<H>/...).
 */
export function focusToObjectPosition(
  asset?: Pick<StoryblokAsset, 'filename' | 'focus'>,
): string | undefined {
  const focus = asset?.focus?.match(/^(\d+)x(\d+):(\d+)x(\d+)$/);
  const size = asset?.filename?.match(/\/(\d+)x(\d+)\//);
  if (!focus || !size) return undefined;

  const [, x1, y1, x2, y2] = focus.map(Number);
  const [, width, height] = size.map(Number);
  if (!width || !height) return undefined;

  const x = ((x1 + x2) / 2 / width) * 100;
  const y = ((y1 + y2) / 2 / height) * 100;
  return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
}
