"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/app/context/CartContext"
import { X } from "lucide-react"
import imageCompression from "browser-image-compression"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onBackToCart: () => void
  cartItems: any[] // Replace 'any[]' with the actual type of cartItems
  total: number
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onBackToCart, cartItems, total }) => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { clearCart } = useCart()

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1, // Compress to maximum 1MB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    try {
      const compressedFile = await imageCompression(file, options)
      return compressedFile
    } catch (error) {
      console.error("Error compressing image:", error)
      throw new Error("Error al comprimir la imagen")
    }
  }

  const handleConfirm = async () => {
    if (!name || !phone || !receipt) {
      alert("Por favor, complete todos los campos y adjunte el comprobante de pago.")
      return
    }

    setIsSubmitting(true)

    try {
      // Compress image before sending
      const compressedReceipt = await compressImage(receipt)

      const formData = new FormData()
      formData.append("customerName", name)
      formData.append("customerPhone", phone)
      formData.append("totalAmount", total.toString())
      formData.append("items", JSON.stringify(cartItems))

      if (compressedReceipt.type.startsWith("image/")) {
        formData.append("receipt", compressedReceipt)
      } else {
        alert("Por favor, adjunte una imagen válida como comprobante.")
        setIsSubmitting(false)
        return
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`)
      }

      const result = await response.json()

      if (result.success) {
        clearCart()
        onClose()
        alert("¡Pedido realizado con éxito!")
      } else {
        throw new Error(result.error || "Error desconocido al crear el pedido")
      }
    } catch (error) {
      console.error("Error detallado:", error)
      alert(
        `Hubo un error al procesar su pedido: ${error instanceof Error ? error.message : "Error desconocido"}. Por favor, inténtelo de nuevo.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg"
          >
            <button onClick={onClose} className="absolute top-4 right-4">
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Confirmar Pedido</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="receipt" className="block text-gray-700 font-bold mb-2">
                Comprobante de Pago
              </label>
              <input
                type="file"
                id="receipt"
                accept="image/*"
                onChange={(e) => setReceipt(e.target.files?.[0])}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={onBackToCart}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-4"
              >
                Volver al Carrito
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {isSubmitting ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PaymentModal

