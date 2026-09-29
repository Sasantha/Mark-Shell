import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// Vercel preview deployments inject a toolbar (for preview comments) served from vercel.live.
const isVercelPreview = process.env.VERCEL_ENV === "preview";
const vercelLive = isVercelPreview ? " https://vercel.live" : "";

// Content-Security-Policy without nonces, so pages can stay statically rendered.
// See node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js needs inline scripts for hydration; React needs eval only in development.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${vercelLive}`,
  `style-src 'self' 'unsafe-inline'${vercelLive}`,
  // Product, partner and gallery images come from Cloudinary and other https hosts.
  "img-src 'self' data: blob: https:",
  `font-src 'self'${isVercelPreview ? " https://vercel.live https://assets.vercel.com" : ""}`,
  // Admin image uploads go straight from the browser to Cloudinary.
  `connect-src 'self' https://api.cloudinary.com${isVercelPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src ${isVercelPreview ? "https://vercel.live" : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // No other site may embed these pages in a frame (clickjacking).
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Older-browser equivalent of frame-ancestors 'none'.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  images: {
    // AVIF is ~30% smaller than WebP; browsers without AVIF support get WebP.
    formats: ["image/avif", "image/webp"],
    // 50 is used for photos under dark overlays (e.g. the home hero), where artifacts don't show.
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Stock backgrounds (Unsplash allows hotlinking).
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Temporary: some dummy/placeholder products and About page photos
        // still reference hotlinked Bing thumbnails, and the Contact map is a
        // placeholder from a Brave image proxy. Replace them with your own
        // photos (uploaded to Cloudinary) and remove these entries.
        protocol: "https",
        hostname: "th.bing.com",
      },
      { protocol: "https", hostname: "tse3.mm.bing.net" },
      { protocol: "https", hostname: "tse4.mm.bing.net" },
      { protocol: "https", hostname: "imgs.search.brave.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
