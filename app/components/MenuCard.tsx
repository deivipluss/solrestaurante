// app/components/MenuCard.tsx
"use client"

import React, { useState } from "react"
import { useCart } from "@/app/context/CartContext"
import Image from "next/image"
import { Star } from "lucide-react" // Eliminada importación de Trash
import { motion } from "framer-motion"

interface MenuCardProps {
  item: {
    name: string
    description?: string
    price: string
    image?: string
    popular?: boolean
  }
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { addToCart } = useCart()
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    addToCart({ name: item.name, price: item.price, quantity })
    setIsQuantityModalOpen(false)
    setQuantity(1)
  }

  return (
    <>
      {/* Tarjeta del producto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div className="relative h-48 w-full">
          <Image
            src={item.image || "/api/placeholder/400/300"}
            alt={item.name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={item.popular}
          />
          {item.popular && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Star size={12} className="text-amber-900" />
              Popular
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-heading font-bold mb-2 text-gray-900 line-clamp-1">{item.name}</h3>
          {item.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <span className="text-amber-700 font-bold text-lg">{item.price}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-yellow-600 transition-all shadow-md"
              onClick={() => setIsQuantityModalOpen(true)}
            >
              Ordenar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal de cantidad */}
      {isQuantityModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000]">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl w-full max-w-sm p-6"
          >
            <h3 className="text-xl font-heading font-bold mb-4">Selecciona la cantidad</h3>
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="bg-gray-100 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all"
              >
                -
              </button>
              <span className="text-2xl font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="bg-gray-100 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all"
              >
                +
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all"
                onClick={() => setIsQuantityModalOpen(false)}
              >
                Volver
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-yellow-600 transition-all shadow-md"
                onClick={handleAddToCart}
              >
                Confirmar ({quantity})
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default MenuCard