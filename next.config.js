/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/loremaker",
        destination: "https://loremaker.cloud",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
