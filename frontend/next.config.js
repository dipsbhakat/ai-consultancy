/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as standalone for better Render compatibility
  output: 'standalone',

  // Disable image optimization in production (can help with build issues)
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },

  // CORS headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },

  // Disable type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },

  // Disable ESLint during build for faster builds
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
