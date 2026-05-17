/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress responses (gzip/brotli)
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Security + caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/(.*)\\.(js|css|woff2|woff|ttf|ico|png|jpg|jpeg|svg|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Reduce bundle: don't include server-only packages in client
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // 301 redirects from old/secondary domains to the canonical one
  async redirects() {
    return [
      // Redirect old Vercel preview URL to canonical
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'scraping-dom-ezdrive.vercel.app' }],
        destination: 'https://prospectia.cloud/:path*',
        permanent: true,
      },
      // Redirect getprospectia.com to canonical
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'getprospectia.com' }],
        destination: 'https://prospectia.cloud/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.getprospectia.com' }],
        destination: 'https://prospectia.cloud/:path*',
        permanent: true,
      },
      // Redirect www.prospectia.cloud to non-www canonical
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.prospectia.cloud' }],
        destination: 'https://prospectia.cloud/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
