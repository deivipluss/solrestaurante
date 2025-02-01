// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["placehold.co"], // Dominios permitidos para imágenes
  },
  // Opcional: Configuración adicional recomendada
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  // Internationalized Routing (opcional)
  i18n: {
    locales: ["es-PE"],
    defaultLocale: "es-PE",
  }
};

export default nextConfig;