import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "plus.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/photos/**", 
      },
    ],
  },
};

export default nextConfig;

