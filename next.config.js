/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15+ image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Next.js 15 optimizations
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
    turbo: {
      resolveAlias: {
        underscore: 'lodash',
        mocha: { browser: 'mocha/browser-entry.js' },
      },
    },
  },
  
  // Enhanced performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Build optimizations
  outputFileTracing: true,
  poweredByHeader: false,
  compress: true,
  
  // Webpack optimizations for Next.js 15
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }
    
    // Enhanced chunk splitting for better performance
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              priority: 10,
              chunks: 'all',
            },
            markdown: {
              test: /[\\/]node_modules[\\/](remark|gray-matter)[\\/]/,
              name: 'markdown',
              priority: 5,
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Enhanced headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig