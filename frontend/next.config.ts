import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/recruiter",
        destination: "/#dashboard",
        permanent: false,
      },
      {
        source: "/candidate",
        destination: "/#candidate-dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
