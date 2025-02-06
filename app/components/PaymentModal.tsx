"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useCart } from "@/app/context/CartContext"
import { X } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onBackToCart: () => void
  cartItems: { name: string; price: string; quantity: number }[]
  total: number
}

const PaymentModal = ({ isOpen, onClose, onBackToCart, cartItems, total }: PaymentModalProps) => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { clearCart } = useCart()

  const validateForm = () => {
    if (!name.trim()) return "El nombre es requerido"
    if (!phone.replace(/\D/g, '').match(/^[9]\d{7}$/)) return "Teléfono inválido (8 dígitos)"
    if (!receipt) return "Adjunte un comprobante"
    if (!receipt.type.startsWith("image/")) return "Solo se aceptan imágenes"
    return null
  }

  const handleConfirm = async () => {
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("customerName", name.trim())
    formData.append("customerPhone", phone.replace(/\D/g, ''))
    formData.append("totalAmount", total.toFixed(2))
    formData.append("items", JSON.stringify(cartItems))
    formData.append("receipt", receipt!)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`)
      }

      if (data.success) {
        clearCart()
        onClose()
        alert("✅ Pedido registrado exitosamente")
      }
    } catch (error) {
      console.error("Error en la solicitud:", error)
      alert(error instanceof Error ? error.message : "Error desconocido al procesar el pedido")
    } finally {
      setIsSubmitting(false)
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
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirmar Pago</h2>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Resumen del Pedido</h3>
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-medium">
                        S/{(parseFloat(item.price.replace("S/", "")) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-lg font-bold text-amber-600">
                    Total: S/{total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Datos de Contacto</label>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="tel"
                    placeholder="Número de WhatsApp"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 border rounded-lg mt-3 focus:ring-2 focus:ring-amber-400"
                    maxLength={9}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Comprobante de Pago</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                    className="w-full file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">Formatos aceptados: JPG, PNG</p>
                </div>

                <Image
                  src="/qr-placeholder.svg"
                  alt="Código QR de pago"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
                <p className="text-center text-sm text-gray-600">
                  Cuenta Interbancaria: <span className="font-bold">123-4567890-123-45</span>
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-amber-600 transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Procesando...
                  </span>
                ) : "Confirmar Pedido"}
              </motion.button>

              <button
                onClick={onBackToCart}
                className="w-full text-gray-600 hover:text-amber-700 underline text-sm"
                disabled={isSubmitting}
              >
                Volver al carrito
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PaymentModal