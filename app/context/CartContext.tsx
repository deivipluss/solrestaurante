// app/context/CartContext.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface CartItem {
  name: string
  price: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemName: string) => void
  updateQuantity: (itemName: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getTotalQuantity: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.name === item.name)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: item.quantity }]
    })
  }

  const removeFromCart = (itemName: string) => {
    setCart(prevCart => prevCart.filter(item => item.name !== itemName))
  }

  const updateQuantity = (itemName: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.name === itemName ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace("S/", ""))
      return total + price * item.quantity
    }, 0)
  }

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getTotalQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}