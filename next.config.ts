import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  images: {
    remotePatterns: [
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      // For testing purposes
      {
        protocol: 'https',
        hostname: 'cdn.shadcnstudio.com',
        port: '',
      },
      // Google Avatar
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
      // Uploadthing
      {
        protocol: 'https',
        hostname: '**.ufs.sh',
        port: '',
      },
      // GitHub Avatar
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};
export default nextConfig;
