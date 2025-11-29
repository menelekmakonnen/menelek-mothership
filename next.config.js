/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['drive.google.com'],
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: '/loremaker',
        destination: 'https://loremaker.cloud',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
