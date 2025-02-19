"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/app/context/CartContext"
import { Trash } from 'lucide-react'
import PaymentModal from "./PaymentModal"

interface CartItem {
  name: string
  quantity: number
  price: number
}

interface PreparedCartItem {
  itemName: string
  quantity: number
  price: number
}

const Cart = () => {
  const { cart, removeFromCart, getTotal, clearCart, getTotalQuantity, isOpen, setIsOpen } = useCart()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const totalQuantity = getTotalQuantity()

  const prepareCartForDatabase = (): PreparedCartItem[] => {
    return cart.map(item => ({
      itemName: item.name,
      quantity: item.quantity,
      price: item.price
    }))
  }

  const handlePayNow = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío')
      return
    }
    
    const total = getTotal()
    if (total <= 0) {
      alert('El total debe ser mayor a 0')
      return
    }

    const invalidItems = cart.some(item => 
      isNaN(item.price) || item.price <= 0
    )

    if (invalidItems) {
      alert('Hay items con precios inválidos')
      return
    }

    setIsPaymentModalOpen(true)
    setIsOpen(false)
  }

  const handleBackToCart = () => {
    setIsPaymentModalOpen(false)
    setIsOpen(true)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isOpen && !target.closest(".modal-pedido")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, setIsOpen])

  const formatPrice = (price: number): string => {
    return `S/${price.toFixed(2)}`
  }

  return (
    <>
      <motion.button
        key={totalQuantity}
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 8px 25px rgba(180, 83, 9, 0.3)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 hover:shadow-3xl transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
          <path d="M2 17L12 22L22 17" />
          <path d="M2 12L12 17L22 12" />
          <path d="M18 7L6 12" strokeLinecap="round" />
        </svg>

        <motion.span
          key={totalQuantity}
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            rotate: [0, 15, -15, 0],
            transition: { type: "spring", stiffness: 500 },
          }}
          className="bg-white text-amber-700 px-3 py-1.5 rounded-full text-sm font-bold min-w-[36px]"
        >
          {totalQuantity}
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && !isPaymentModalOpen && (
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
              className="bg-white rounded-2xl w-full max-w-md p-6 modal-pedido shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Mi Pedido</h2>

              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Aún no has agregado platillos</p>
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
                          <p className="text-sm text-gray-600">{item.quantity} porciones</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-700 font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.name)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label={`Eliminar ${item.name} del carrito`}
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-6 px-2">
                    <span className="font-bold text-lg">Total a pagar:</span>
                    <span className="text-2xl font-bold text-amber-700">
                      {formatPrice(getTotal())}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-yellow-600 transition-all"
                      onClick={handlePayNow}
                    >
                      Pagar ahora
                    </motion.button>

                    <button
                      className="w-full text-gray-600 hover:text-amber-700 py-3 rounded-xl font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Volver a la carta
                    </button>

                    <button
                      className="text-red-500 hover:text-red-700 flex items-center justify-center gap-2 text-sm"
                      onClick={clearCart}
                    >
                      <Trash size={16} />
                      Eliminar pedidos
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setIsOpen(false)
        }}
        onBackToCart={handleBackToCart}
        cartItems={prepareCartForDatabase()}
        total={getTotal()}
      />
    </>
  )
}

export default Cart