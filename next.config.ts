import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in dev mode for faster builds
  register: true,
});

const nextConfig: NextConfig = {
  // Required for Leaflet — it uses browser-only APIs
  transpilePackages: ['leaflet'],
  // Enable Turbopack explicitly to suppress warning
  turbopack: {},
};

export default withPWA(nextConfig);
