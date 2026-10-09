import type { NextConfig } from "next";

// Updated to reload server configuration with latest schema definitions
const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [{ source: "/gallery", destination: "/posts", permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    qualities: [75, 95],
  },
};

export default nextConfig;
