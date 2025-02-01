import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  i18n: {
    locales: ["es-PE"],
    defaultLocale: "es-PE",
  }
};

export default nextConfig;