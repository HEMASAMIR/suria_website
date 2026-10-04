import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Keep .next small in dev (the F: drive is nearly full).
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
