/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirect old routes to consolidated ones
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
