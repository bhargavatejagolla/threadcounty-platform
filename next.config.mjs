/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        encoding: false,
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      encoding: false,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
