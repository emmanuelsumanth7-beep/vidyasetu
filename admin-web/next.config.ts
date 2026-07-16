// @ts-expect-error NextConfig types might be incomplete in this version
const nextConfig: any = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
