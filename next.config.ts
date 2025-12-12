import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  devIndicators: false,
};

export default nextConfig;
