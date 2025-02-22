"use client"

import type React from "react"
import { useState } from "react"
import { useCart } from "@/app/context/CartContext"
import Image from "next/image"
import { Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { MenuItem } from "@/app/menu/types"

interface MenuCardProps {
  item: MenuItem
  featured?: boolean
}

const MenuCard: React.FC<MenuCardProps> = ({ item, featured = false }) => {
  const { addToCart } = useCart()
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const formatPrice = (price: number): string => {
    return `S/${price.toFixed(2)}`
  }

  const handleAddToCart = () => {
    addToCart({
      name: item.name,
      price: item.price,
      quantity
    })
    
    setIsQuantityModalOpen(false)
    setQuantity(1)
    setShowConfirmation(true)
    setTimeout(() => setShowConfirmation(false), 1000)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 ${
          featured ? 'ring-2 ring-amber-500' : ''
        }`}
      >
        <div className="relative h-48 w-full">
          <Image
            src={item.image || "/placeholder.svg?height=400&width=300"}
            alt={item.name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={item.popular}
          />
          {item.popular && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
              <Star size={12} className="text-amber-900" />
              Popular
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
              {item.description}
            </p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-amber-700">
              {formatPrice(item.price)}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-5 py-2 rounded-lg hover:from-amber-700 hover:to-yellow-600 transition-all shadow-md"
              onClick={() => setIsQuantityModalOpen(true)}
            >
              Ordenar
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isQuantityModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-xs p-6 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Cantidad a ordenar
              </h3>

              <div className="flex items-center justify-between mb-8">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <span className="text-3xl font-bold text-amber-700">−</span>
                </motion.button>

                <div className="flex flex-col items-center mx-4">
                  <span className="text-6xl font-bold text-amber-700">{quantity}</span>
                  <span className="text-sm text-gray-500 mt-1">unidades</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <span className="text-3xl font-bold text-amber-700">+</span>
                </motion.button>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center relative overflow-hidden"
                  onClick={handleAddToCart}
                >
                  <AnimatePresence mode="wait">
                    {showConfirmation ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute"
                      >
                        ✓
                      </motion.span>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Confirmar pedido
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <button
                  className="w-full text-gray-500 hover:text-amber-700 py-3 rounded-xl font-medium transition-colors"
                  onClick={() => setIsQuantityModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MenuCard