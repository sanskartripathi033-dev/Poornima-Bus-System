import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Leaflet — it uses browser-only APIs
  transpilePackages: ['leaflet'],
  // Enable Turbopack explicitly to suppress warning
  turbopack: {},
};

export default nextConfig;
