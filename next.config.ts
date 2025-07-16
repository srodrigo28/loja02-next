import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // permite qualquer domínio com HTTPS
      },
    ],
  },
};

export default nextConfig;
