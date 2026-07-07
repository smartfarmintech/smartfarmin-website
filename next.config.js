/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization for Lighthouse
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable ISR for images
    minimumCacheTTL: 60,
    // AVIF support for better compression
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression and performance
  compress: true,
  swcMinify: true,

  // React compilation optimizations
  // Disabled - requires babel-plugin-react-compiler which is optional
  // reactCompiler: true,

  // Experimental optimizations for Next.js 16
  experimental: {
    // Cache optimization
    staticGenerationRetryCount: 3,
    // Incremental Static Generation
    isrMemoryCacheSize: 50 * 1024 * 1024, // 50MB ISR cache
    // Turbopack is default in Next.js 16, so no need to enable
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Enable compression
          {
            key: 'Accept-Encoding',
            value: 'gzip, deflate, br',
          },
          // Cache static assets aggressively
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          // Security headers that aid performance
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // DNS prefetch for external resources
          {
            key: 'Link',
            value: '<https://fonts.googleapis.com>; rel=preconnect, <https://fonts.gstatic.com>; rel=preconnect, <https://cdn.jsdelivr.net>; rel=preconnect',
          },
        ],
      },
      // Specific cache headers for different file types
      {
        source: '/(_next/static|_next/image)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*(jpg|jpeg|png|gif|webp|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*(js|css|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },

  // Redirects for URL cleanliness
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Rewrites to hide API routes
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    }
  },

  // Environment variables for optimization
  env: {
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        concatenateModules: true,
      }
    }
    return config
  },

  // TypeScript strict mode for performance
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // ESLint during build
  eslint: {
    dirs: ['app', 'components', 'lib', 'middleware'],
  },

  // Trailing slashes for consistency
  trailingSlash: false,

  // Proper PoweredBy header removal
  poweredByHeader: false,

  // Production source maps optimization
  productionBrowserSourceMaps: false,

  // Optimize package imports for tree shaking
  optimizePackageImports: [
    'recharts',
    'lucide-react',
    '@radix-ui/react-*',
    'date-fns',
  ],
}

module.exports = nextConfig
