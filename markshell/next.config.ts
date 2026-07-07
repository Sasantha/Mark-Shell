import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Temporary: some dummy/placeholder products still reference hotlinked
        // Bing thumbnail images. Remove once all products have a real
        // Cloudinary image uploaded through the admin panel.
        protocol: "https",
        hostname: "th.bing.com",
      },
    ],
  },
};

export default nextConfig;
