import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.recetasnestle.com.ec',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'carulla.vtexassets.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
