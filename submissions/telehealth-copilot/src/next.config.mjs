/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        bufferutil: false,
        "utf-8-validate": false,
        long: false,
      };
    }
    return config;
  },
};

export default nextConfig;
