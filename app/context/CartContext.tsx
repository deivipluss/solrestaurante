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
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    const existingItem = cart.find((cartItem) => cartItem.name === item.name)
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      )
    } else {
      setCart([...cart, { ...item, quantity: item.quantity }])
    }
  }

  const removeFromCart = (itemName: string) => {
    setCart(cart.filter((item) => item.name !== itemName))
  }

  const updateQuantity = (itemName: string, quantity: number) => {
    setCart(
      cart.map((item) =>
        item.name === itemName ? { ...item, quantity: quantity } : item
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

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}
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