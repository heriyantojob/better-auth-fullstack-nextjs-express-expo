import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:8000/api/auth/:path*", // Proxy to Express
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
