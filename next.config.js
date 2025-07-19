/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: []
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  experimental: {
  },
  productionBrowserSourceMaps: false,
  // Disable strict mode temporarily for dashboard fix
  swcMinify: false,
  // Netlify deployment optimization
  trailingSlash: false
}

module.exports = nextConfig
