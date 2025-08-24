/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://a953zu5bnc.execute-api.us-east-1.amazonaws.com/dev/:path*',
      },
    ];
  },
};

module.exports = nextConfig;