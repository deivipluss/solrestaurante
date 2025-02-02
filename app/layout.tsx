import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/app/context/CartContext"
import type React from "react" // Added import for React

// Configuración de la fuente Inter
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Metadatos para la página
export const metadata: Metadata = {
  title: "Sol de Oro - Menú y Pedidos",
  description: "Descubre nuestro menú tradicional y realiza tus pedidos fácilmente. ¡Bienvenido a Sol de Oro!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}

