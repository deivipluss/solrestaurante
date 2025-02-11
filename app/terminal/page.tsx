"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react'

interface Order {
  id: string
  customerName: string
  customerPhone: string
  totalAmount: number
  items: { itemName: string; quantity: number; price: number }[]
  createdAt: string
  status: "pending" | "processing" | "completed"
}

const AdminTerminal: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [newOrderAlert, setNewOrderAlert] = useState(false)

  const playAlertSound = useCallback(() => {
    if (soundEnabled) {
      const audio = new Audio("/alert-sound.mp3") // Asegúrate de tener este archivo en tu carpeta public
      audio.play()
    }
  }, [soundEnabled])

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      const newOrders = Array.isArray(data.orders) ? data.orders : []
      
      if (newOrders.length > orders.length) {
        playAlertSound()
        setNewOrderAlert(true)
        setTimeout(() => setNewOrderAlert(false), 5000)
      }
      
      setOrders(newOrders)
    } catch (err) {
      setError("Error al cargar los pedidos. Por favor, intente de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }, [orders.length, playAlertSound])

  useEffect(() => {
    fetchOrders()
    const intervalId = setInterval(fetchOrders, 30000)
    return () => clearInterval(intervalId)
  }, [fetchOrders])

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        throw new Error('Failed to update order status')
      }
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-red-600 text-xl font-semibold mb-4">{error}</p>
          <button 
            onClick={fetchOrders}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-amber-600 to-amber-400">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Terminal de Administrador</h2>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-white hover:text-amber-200 transition-colors"
              >
                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {newOrderAlert && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="bg-green-500 text-white p-4 text-center"
              >
                ¡Nuevo pedido recibido!
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6">
            {Array.isArray(orders) && orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                      order.status === 'pending' ? 'border-amber-500' :
                      order.status === 'processing' ? 'border-blue-500' :
                      'border-green-500'
                    }`}
                  >
                    <div 
                      className="p-4 cursor-pointer hover:bg-amber-50 transition-colors"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{order.customerName}</h3>
                          <p className="text-sm text-gray-600">{order.customerPhone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-600">S/ {order.totalAmount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status === 'pending' ? 'Pendiente' :
                           order.status === 'processing' ? 'En proceso' :
                           'Completado'}
                        </span>
                        {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedOrder === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 bg-amber-50">
                            <ul className="divide-y divide-amber-200">
                              {order.items.map((item, index) => (
                                <li key={index} className="py-2 flex justify-between">
                                  <span className="text-gray-700">
                                    {item.quantity}x {item.itemName}
                                  </span>
                                  <span className="text-gray-600">S/ {(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 flex justify-end space-x-2">
                              <button
                                onClick={() => updateOrderStatus(order.id, 'processing')}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                disabled={order.status !== 'pending'}
                              >
                                Procesar
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                disabled={order.status === 'completed'}
                              >
                                Completar
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-8">No hay pedidos disponibles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTerminal
