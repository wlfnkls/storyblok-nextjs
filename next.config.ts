import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: false,
  partialPrefetching: false,
  images: {
    remotePatterns: [new URL('https://a.storyblok.com/**')],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
