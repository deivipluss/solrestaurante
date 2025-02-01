// app/components/Cart.tsx
"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/app/context/CartContext"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react"

const Cart = () => {
  const { cart, removeFromCart, getTotal, clearCart, getTotalQuantity } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  
  const totalQuantity = getTotalQuantity()

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

    setTimeout(() => {
      clearCart()
      setIsOpen(false)
      router.push("/")
    }, 5000)
  }

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
      {/* Botón flotante del carrito mejorado */}
      <motion.button
        key={totalQuantity}
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 8px 25px rgba(180, 83, 9, 0.3)"
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 hover:shadow-3xl transition-all"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
        
        <motion.span
          key={totalQuantity}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            rotate: [0, 15, -15, 0],
            transition: { type: "spring", stiffness: 500 } 
          }}
          className="bg-white text-amber-700 px-3 py-1.5 rounded-full text-sm font-bold min-w-[36px]"
        >
          {totalQuantity}
        </motion.span>
      </motion.button>

      {/* Modal del carrito */}
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
              className="bg-white rounded-2xl w-full max-w-md p-6 cart-modal shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Tu Pedido</h2>

              {isSubmitted ? (
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-600 mb-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  <p className="text-gray-700">
                    ¡Pedido confirmado! Redirigiendo a WhatsApp...
                  </p>
                </div>
              ) : cart.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  Tu carrito está vacío
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto">
                    {cart.map((item) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-between items-center p-3 bg-amber-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.quantity} x {item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-700 font-semibold">
                            S/{(parseFloat(item.price.replace("S/", "")) * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.name)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-6 px-2">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="text-2xl font-bold text-amber-700">
                      S/{getTotal().toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Tu nombre *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <input
                      type="tel"
                      placeholder="Tu número de WhatsApp *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-yellow-600 transition-all"
                      onClick={handleSubmit}
                    >
                      Enviar pedido
                    </motion.button>
                    
                    <button
                      className="w-full text-gray-600 hover:text-amber-700 py-3 rounded-xl font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Seguir comprando
                    </button>
                    
                    <button
                      className="text-red-500 hover:text-red-700 flex items-center justify-center gap-2 text-sm"
                      onClick={clearCart}
                    >
                      <Trash size={16} />
                      Vaciar carrito
                    </button>
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