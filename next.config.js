/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.talentprotocol.com'],
  },
};

module.exports = nextConfig;
