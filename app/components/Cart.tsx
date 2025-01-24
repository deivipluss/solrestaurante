// app/components/Cart.tsx
"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/app/context/CartContext"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react" // Importa Trash para el ícono de vaciar

const Cart = () => {
  const { cart, removeFromCart, getTotal, clearCart, updateQuantity } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = () => {
    if (!name || !phone) {
      alert("Por favor, ingresa tu nombre y número de WhatsApp.")
      return
    }

    const total = getTotal()
    const message = `Hola, soy ${name}. Quiero hacer el siguiente pedido:\n\n${cart
      .map((item) => `${item.name} - ${item.quantity} x ${item.price}`)
      .join("\n")}\n\nTotal: S/${total.toFixed(2)}\n\nMi número de contacto es ${phone}.`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/51987654321?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
    setIsSubmitted(true)

    // Limpiar el carrito y redireccionar después de 5 segundos
    setTimeout(() => {
      clearCart()
      setIsOpen(false)
      router.push("/")
    }, 5000)
  }

  // Cerrar el carrito si se hace clic fuera del modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isOpen && !target.closest(".cart-modal")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <>
      {/* Botón para abrir el carrito */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50"
      >
        <span>Ver Carrito</span>
        <span className="bg-white text-amber-700 px-2 py-1 rounded-full text-sm">
          {cart.length}
        </span>
        {/* Botón para vaciar el carrito con ícono de tacho */}
        {cart.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation() // Evita que el clic se propague al botón principal
              clearCart()
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash size={16} /> {/* Ícono de tacho */}
          </button>
        )}
      </motion.button>

      {/* Modal del carrito */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-md p-6 cart-modal"
            >
              <h2 className="text-2xl font-heading font-bold mb-4">Tu Pedido</h2>

              {isSubmitted ? (
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    Su pedido se confirmará en un periodo máximo de dos minutos a través de su
                    número WhatsApp. ¡Gracias por preferirnos!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-yellow-600 transition-all shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Cerrar
                  </motion.button>
                </div>
              ) : cart.length === 0 ? (
                <p className="text-gray-600">No hay productos en el carrito.</p>
              ) : (
                <>
                  {/* Lista de productos en el carrito */}
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.quantity} x {item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.name, parseInt(e.target.value))
                            }
                            className="w-16 p-1 border border-gray-300 rounded-lg text-center"
                          />
                          <button
                            onClick={() => removeFromCart(item.name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={16} /> {/* Ícono de tacho */}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total del pedido */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold">Total:</span>
                    <span className="text-amber-700 font-bold">
                      S/{getTotal().toFixed(2)}
                    </span>
                  </div>

                  {/* Formulario para nombre y WhatsApp */}
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Tu nombre *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Tu número de WhatsApp *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-yellow-600 transition-all shadow-md"
                      onClick={handleSubmit}
                    >
                      Enviar Pedido por WhatsApp
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Volver a la Carta
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Cart