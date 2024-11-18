import type { NextConfig } from 'next';

const basePath = '/my-app';

const nextConfig: NextConfig = {
  basePath,
  env: {
    BASE_PATH: basePath,
  },
};

export default nextConfig;
