// app/layout.tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/app/context/CartContext" // Importa el CartProvider

// Configuración de las fuentes Geist
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Envuelve la aplicación con el CartProvider */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}