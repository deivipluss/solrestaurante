"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useCart } from "@/app/context/CartContext"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onBackToCart: () => void
  total: number
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onBackToCart, total }) => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const { clearCart } = useCart()

  const handleConfirm = async () => {
    if (!name || !phone || !receipt) {
      alert("Por favor, complete todos los campos y adjunte el comprobante de pago.")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("phone", phone)
    formData.append("total", total.toString())
    formData.append("receipt", receipt)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Pago confirmado y guardado en la base de datos. ID de la orden:", result.orderId)
        clearCart()
        onClose()
        alert(`Pago confirmado. Número de orden: ${result.orderId}`)
      } else {
        throw new Error("Error al procesar el pago")
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      alert("Hubo un error al procesar el pago. Por favor, intente nuevamente.")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirmar Pago</h2>

            <div className="mb-6">
              <p className="text-lg font-semibold text-amber-700">Total a pagar: S/{total.toFixed(2)}</p>
            </div>

            <div className="mb-4">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Código QR de pago"
                width={200}
                height={200}
                className="mx-auto"
              />
              <p className="text-center text-sm text-gray-600 mt-2">Escanea el código QR para realizar el pago</p>
            </div>

            <div className="mb-4">
              <p className="text-center text-sm font-medium text-gray-700">
                Número de cuenta interbancario:
                <br />
                <span className="font-bold">123-4567890-123-45</span>
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700"
              />
              <input
                type="tel"
                placeholder="Tu número de WhatsApp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700"
              />
              <div>
                <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 mb-2">
                  Adjuntar comprobante de pago
                </label>
                <input
                  type="file"
                  id="receipt"
                  accept="image/*"
                  onChange={(e) => setReceipt(e.target.files ? e.target.files[0] : null)}
                  className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-yellow-600 transition-all mb-4"
              onClick={handleConfirm}
            >
              ¡Confirmar ahora!
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-lg hover:bg-gray-300 transition-all"
              onClick={onBackToCart}
            >
              Volver al pedido
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PaymentModal

