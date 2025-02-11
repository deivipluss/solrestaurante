"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Order {
  id: string
  customerName: string
  customerPhone: string
  totalAmount: number
  items: { itemName: string; quantity: number; price: number }[]
  createdAt: string
}

const AdminTerminal: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const data = await response.json()
        setOrders(Array.isArray(data.orders) ? data.orders : [])
      } catch (err) {
        setError("Error al cargar los pedidos. Por favor, intente de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
    const intervalId = setInterval(fetchOrders, 30000)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return <div className="text-center py-8">Cargando pedidos...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Terminal de Administrador</h2>
      {Array.isArray(orders) && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-lg p-4 shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{order.customerName}</h3>
                  <p className="text-sm text-gray-600">{order.customerPhone}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-600">S/ {order.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <li key={index} className="py-2 flex justify-between">
                    <span className="text-gray-700">
                      {item.quantity}x {item.itemName}
                    </span>
                    <span className="text-gray-600">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No hay pedidos disponibles.</p>
      )}
    </div>
  )
}

export default AdminTerminal

