/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  // Indicate that the app should be deployed at /heartquest
  basePath: process.env.NODE_ENV === 'production' ? '/heartquest' : '',
}

export default nextConfig
