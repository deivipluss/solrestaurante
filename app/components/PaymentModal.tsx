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
  cartItems: { name: string; price: string; quantity: number }[]
  total: number
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onBackToCart, cartItems, total }) => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const { clearCart, createOrder } = useCart()

  const handleConfirm = () => {
    if (!name || !phone || !receipt) {
      alert("Por favor, complete todos los campos y adjunte el comprobante de pago.")
      return
    }

    const order = createOrder(name, phone, receipt)

    // Aquí iría la lógica para procesar el pago y enviar la información
    console.log("Orden confirmada", order)
    clearCart()
    onClose()
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
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Resumen del pedido:</h3>
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>S/{(Number.parseFloat(item.price.replace("S/", "")) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-lg font-semibold text-amber-700">Total a pagar: S/{total.toFixed(2)}</p>
              </div>
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

