/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverComponentsExternalPackages: ['mongoose'] },
  images: { domains: ['github.com'] },
};

module.exports = nextConfig;
