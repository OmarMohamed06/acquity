import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vdmymidkrxpftvesezvb.supabase.co",
      },
    ],
  },
};

export default nextConfig;
