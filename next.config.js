/** @type {import('next').NextConfig} */
export default {
  images: {
    domains: [
      'picsum.photos',
      'localhost',
      'storage.googleapis.com',
      'mememates-bucket.storage.googleapis.com',
      'i.imgflip.com',
      'i.scdn.co',
      'source.unsplash.com',
      'images.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/seed/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgflip.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/photo-**',
      }
    ],
  },
  // Optional: Add any other Next.js configurations here
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};
