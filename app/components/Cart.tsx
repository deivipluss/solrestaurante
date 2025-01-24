// app/components/Cart.tsx
"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { useCart } from "@/app/context/CartContext"
import Link from "next/link"

const Cart = () => {
  const { cart, removeFromCart, getTotal, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const handleSubmit = () => {
    const total = getTotal()
    const message = `Hola, soy ${name}. Quiero hacer el siguiente pedido:\n\n${cart
      .map((item) => `${item.name} - ${item.quantity} x ${item.price}`)
      .join("\n")}\n\nTotal: S/${total.toFixed(2)}\n\nMi número de contacto es ${phone}.`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/51987654321?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
    clearCart()
    setIsOpen(false)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
      >
        <span>Ver Carrito</span>
        <span className="bg-white text-amber-700 px-2 py-1 rounded-full text-sm">
          {cart.length}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-heading font-bold mb-4">Tu Pedido</h2>
              {cart.length === 0 ? (
                <p className="text-gray-600">No hay productos en el carrito.</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.quantity} x {item.price}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold">Total:</span>
                    <span className="text-amber-700 font-bold">
                      S/{getTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Tu número de WhatsApp"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-yellow-600 transition-all shadow-md"
                    >
                      Enviar Pedido por WhatsApp
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