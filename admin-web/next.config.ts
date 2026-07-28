import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: process.env.BUILD_CAPACITOR === 'true' ? 'export' : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
