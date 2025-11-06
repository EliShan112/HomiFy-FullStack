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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/**`,
      },
    ],
  },
};

export default nextConfig;

