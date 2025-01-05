import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Habilita el modo estricto de React para detectar errores más fácilmente
  experimental: {
    appDir: true, // Necesario para usar la nueva estructura de "app/"
  },
};

export default nextConfig;
