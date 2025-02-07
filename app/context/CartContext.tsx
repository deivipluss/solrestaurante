"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

interface CartItem {
  name: string
  price: string
  quantity: number
}

interface Order {
  items: CartItem[]
  total: number
  customerName: string
  customerPhone: string
  paymentReceipt: File | null
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemName: string) => void
  updateQuantity: (itemName: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getTotalQuantity: () => number
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  createOrder: (customerName: string, customerPhone: string, paymentReceipt: File) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = useCallback((item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem,
        )
      }
      return [...prevCart, { ...item, quantity: item.quantity }]
    })
  }, [])

  const removeFromCart = useCallback((itemName: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== itemName))
  }, [])

  const updateQuantity = useCallback((itemName: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.name === itemName ? { ...item, quantity: Math.max(1, quantity) } : item)),
    )
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = Number.parseFloat(item.price.replace("S/", ""))
      return total + price * item.quantity
    }, 0)
  }, [cart])

  const getTotalQuantity = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const createOrder = useCallback(
    async (customerName: string, customerPhone: string, paymentReceipt: File): Promise<void> => {
      const order: Order = {
        items: [...cart],
        total: getTotal(),
        customerName,
        customerPhone,
        paymentReceipt,
      }

      const formData = new FormData()
      formData.append("customerName", order.customerName)
      formData.append("customerPhone", order.customerPhone)
      formData.append("totalAmount", order.total.toString())
      formData.append("items", JSON.stringify(order.items))
      formData.append("receipt", order.paymentReceipt)

      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Error del servidor: ${response.status} - ${errorText}`)
        }

        const result = await response.json()

        if (result.success) {
          clearCart()
          setIsOpen(false)
          // No mostramos el alert aquí, lo manejaremos en el componente
          return
        } else {
          throw new Error(result.error || "Error desconocido al crear el pedido")
        }
      } catch (error) {
        console.error("Error detallado:", error)
        throw error // Propagamos el error para manejarlo en el componente
      }
    },
    [cart, getTotal, clearCart],
  )

  const contextValue = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getTotalQuantity,
      isOpen,
      setIsOpen,
      createOrder,
    }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getTotalQuantity, isOpen, createOrder],
  )

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

