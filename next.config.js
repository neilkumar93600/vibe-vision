/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['your-image-domain.com'],
  },

  async rewrites() {
    return [
      {
        // Proxy all requests starting with /api to your backend
        source: '/:path*',
        destination: 'http://54.165.196.203:8000/:path*',
      },
      {
        // Proxy all requests starting with /api to your backend
        source: '/auth/login',
        destination: 'http://54.165.196.203:8000/auth/login',
      },
      {
        // Proxy all requests starting with /api to your backend
        source: '/auth/signup',
        destination: 'http://54.165.196.203:8000/auth/login',
      },
      {
        // Proxy all requests starting with /auth to your backend
        source: '/api/:path*',
        destination: 'http://54.165.196.203:8000/auth/:path*',
      },
      // Add more routes here if needed, for example:
      {
        source: '/auth/:path*',
        destination: 'http://54.165.196.203:8000/users/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
