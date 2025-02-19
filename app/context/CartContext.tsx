"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import { Decimal } from "../utils/decimal"

interface CartItem {
  name: string
  price: number
  quantity: number
}

interface PreparedCartItem {
  itemName: string
  price: Decimal
  quantity: number
}

interface Order {
  items: PreparedCartItem[]
  totalAmount: Decimal
  customerName: string
  customerPhone: string
  paymentProof: File
  status: string
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
  createOrder: (customerName: string, customerPhone: string, paymentProof: File) => Promise<void>
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
          cartItem.name === item.name 
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity } 
            : cartItem
        )
      }
      return [...prevCart, item]
    })
  }, [])

  const removeFromCart = useCallback((itemName: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== itemName))
  }, [])

  const updateQuantity = useCallback((itemName: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => 
        item.name === itemName 
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cart])

  const getTotalQuantity = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const prepareItemsForOrder = useCallback((items: CartItem[]): PreparedCartItem[] => {
    return items.map(item => ({
      itemName: item.name,
      price: Decimal.from(item.price),
      quantity: item.quantity
    }))
  }, [])

  const createOrder = useCallback(
    async (customerName: string, customerPhone: string, paymentProof: File): Promise<void> => {
      try {
        if (!customerName.trim()) {
          throw new Error("El nombre es requerido")
        }

        if (!/^\d{9}$/.test(customerPhone)) {
          throw new Error("El número de teléfono debe tener 9 dígitos")
        }

        if (!paymentProof) {
          throw new Error("El comprobante de pago es requerido")
        }

        const preparedItems = prepareItemsForOrder(cart)
        const totalAmount = Decimal.from(getTotal())

        const formData = new FormData()
        formData.append("customerName", customerName.trim())
        formData.append("customerPhone", customerPhone)
        formData.append("totalAmount", totalAmount.toString())
        formData.append("items", JSON.stringify(preparedItems))
        formData.append("receipt", paymentProof)
        formData.append("status", "PENDING")

        const response = await fetch("/api/orders", {
          method: "POST",
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Error del servidor: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          clearCart()
          setIsOpen(false)
          return
        } else {
          throw new Error(result.error || "Error desconocido al crear el pedido")
        }
      } catch (error) {
        console.error("Error detallado:", error)
        throw error
      }
    },
    [cart, getTotal, clearCart, prepareItemsForOrder]
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
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getTotalQuantity, isOpen, createOrder]
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

export default CartContext