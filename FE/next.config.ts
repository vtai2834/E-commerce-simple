import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable standalone output for Docker
  output: 'standalone',
  // Configure API rewrites for microservices
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: 'http://user-service:3000/:path*',
      },
      {
        source: '/api/products/:path*',
        destination: 'http://product-service:3000/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination: 'http://order-service:3000/:path*',
      },
    ];
  },
};

export default nextConfig;