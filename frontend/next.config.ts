import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ExcelJS is a heavy CommonJS module used only client-side (dynamic import).
  // Marking it external for server-side webpack prevents SSR bundling errors.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals ?? []), "exceljs"];
    }
    return config;
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
      // Removed redirect for /recruiter so the Next.js recruiter page renders.
      // The old HTML dashboard is still accessible via /#dashboard directly.
      {
        source: "/candidate",
        destination: "/#candidate-dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
