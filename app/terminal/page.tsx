"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Volume2, VolumeX, X } from "lucide-react"
import { Decimal } from "@prisma/client/runtime/library"

interface OrderItem {
  id: number
  itemName: string
  quantity: number
  price: Decimal
  orderId: number
}

interface PaymentProof {
  id: number
  cloudinaryUrl: string
  orderId: number
}

interface Order {
  id: number
  customerName: string
  customerPhone: string
  totalAmount: Decimal
  items: OrderItem[]
  createdAt: Date
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "DELIVERED"
  paymentProof: PaymentProof
}

const AdminTerminal: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [newOrderAlert, setNewOrderAlert] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const lastFetchTimeRef = useRef<number>(0)
  const alertIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const playAlertSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch((error) => console.error("Error playing sound:", error))
    }
  }, [soundEnabled])

  const stopAlertSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  const checkPendingOrders = useCallback(() => {
    const hasPendingOrders = orders.some((order) => order.status === "PENDING")
    if (hasPendingOrders) {
      playAlertSound()
      setNewOrderAlert(true)
    } else {
      stopAlertSound()
      setNewOrderAlert(false)
    }
  }, [orders, playAlertSound, stopAlertSound])

  const fetchOrders = useCallback(async () => {
    try {
      const currentTime = Date.now()
      const response = await fetch(`/api/orders?since=${lastFetchTimeRef.current}`)
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      const newOrders = Array.isArray(data.orders) ? data.orders : []

      if (newOrders.length > 0) {
        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders]
          newOrders.forEach((newOrder: Order) => {
            const index = updatedOrders.findIndex((order) => order.id === newOrder.id)
            if (index !== -1) {
              updatedOrders[index] = newOrder
            } else {
              updatedOrders.push(newOrder)
            }
          })
          return updatedOrders.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        })
      }

      lastFetchTimeRef.current = currentTime
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Error al cargar los pedidos. Por favor, intente de nuevo.")
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    audioRef.current = new Audio("/alert-sound.mp3")
    audioRef.current.loop = true

    workerRef.current = new Worker(new URL("../workers/keepAlive.worker.ts", import.meta.url))

    const keepAlive = () => {
      if (workerRef.current) {
        workerRef.current.postMessage("keepAlive")
      }
      setTimeout(keepAlive, 20000)
    }
    keepAlive()

    const updateInterval = 10000
    let intervalId: NodeJS.Timeout

    const startInterval = (interval: number) => {
      clearInterval(intervalId)
      intervalId = setInterval(fetchOrders, interval)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        startInterval(60000)
      } else {
        startInterval(updateInterval)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    startInterval(updateInterval)
    fetchOrders()

    return () => {
      clearInterval(intervalId)
      if (alertIntervalRef.current) {
        clearInterval(alertIntervalRef.current)
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (workerRef.current) {
        workerRef.current.terminate()
      }
      stopAlertSound()
    }
  }, [fetchOrders, stopAlertSound])

  useEffect(() => {
    checkPendingOrders()
    if (alertIntervalRef.current) {
      clearInterval(alertIntervalRef.current)
    }
    alertIntervalRef.current = setInterval(checkPendingOrders, 5000)
    return () => {
      if (alertIntervalRef.current) {
        clearInterval(alertIntervalRef.current)
      }
    }
  }, [checkPendingOrders])

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const updateOrderStatus = async (orderId: number, newStatus: Order["status"]) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update order status")
      }
      
      const updatedOrder = await response.json()
      setOrders((prevOrders) =>
        prevOrders.map((order) => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const formatPrice = (price: Decimal | number): string => {
    if (price instanceof Decimal) {
      return `S/${price.toFixed(2)}`
    }
    return `S/${Number(price).toFixed(2)}`
  }

  const sendWhatsAppMessage = (phoneNumber: string, order: Order) => {
    const formattedPhoneNumber = phoneNumber.startsWith("+51") ? phoneNumber : `+51${phoneNumber}`
    const items = order.items
      .map((item) => `• ${item.quantity}x ${item.itemName}`)
      .join("\n")
    const message = `¡Hola! 👋 Gracias por tu pedido en Sol de Oro ☀️🥘\n\n` +
      `Tu pedido ha sido confirmado:\n\n${items}\n\n` +
      `💰 Total: ${formatPrice(order.totalAmount)}\n\n` +
      `🕒 Por favor, recógelo en 30 minutos.\n\n` +
      `¡Gracias por tu preferencia! 😊`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhoneNumber}&text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
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
            onClick={() => fetchOrders()}
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
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                      order.status === "PENDING"
                        ? "border-amber-500"
                        : order.status === "CONFIRMED"
                          ? "border-blue-500"
                          : order.status === "CANCELLED"
                            ? "border-red-500"
                            : "border-green-500"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{order.customerName}</h3>
                          <p className="text-sm text-gray-600">
                            {order.customerPhone.startsWith("+51") ? order.customerPhone : `+51${order.customerPhone}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-600">{formatPrice(order.totalAmount)}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : order.status === "CONFIRMED"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status === "PENDING"
                            ? "Pendiente"
                            : order.status === "CONFIRMED"
                              ? "Confirmado"
                              : order.status === "CANCELLED"
                                ? "Cancelado"
                                : "Entregado"}
                        </span>
                        <img
                          src={order.paymentProof.cloudinaryUrl}
                          alt="Comprobante de pago"
                          className="w-16 h-16 object-cover rounded-md cursor-pointer"
                          onClick={() => openImageModal(order.paymentProof.cloudinaryUrl)}
                        />
                      </div>
                      {order.status === "PENDING" && (
                        <div className="mt-4 flex justify-end space-x-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, "CONFIRMED")}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                      {order.status === "CONFIRMED" && (
                        <div className="mt-4 flex justify-end space-x-2">
                          <button
                            onClick={() => sendWhatsAppMessage(order.customerPhone, order)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Confirmar por WhatsApp
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Entregado
                          </button>
                        </div>
                      )}
                    </div>
                    <div
                      className="p-4 cursor-pointer hover:bg-amber-50 transition-colors flex justify-between items-center"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <span className="text-sm font-medium text-gray-600">
                        {expandedOrder === order.id ? "Ocultar detalles" : "Ver detalles"}
                      </span>
                      {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                              {order.items.map((item) => (
                                <li key={item.id} className="py-2 flex justify-between">
                                  <span className="text-gray-700">
                                    {item.quantity}x {item.itemName}
                                  </span>
                                  <span className="text-gray-600">
                                    {formatPrice(new Decimal(item.price).mul(item.quantity))}
                                  </span>
                                </li>
                              ))}
                            </ul>
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

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] flex items-center justify-center overflow-hidden">
            <button 
              onClick={closeImageModal} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Comprobante de pago"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTerminal