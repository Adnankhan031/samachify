import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
  productId: string
  name: string
  packSize: string
  price: string
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, packSize: string) => void
  updateQuantity: (productId: string, packSize: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | null>(null)

const CART_STORAGE_KEY = 'samachify_cart'

const loadFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadFromStorage)

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Silently ignore storage errors
    }
  }, [items])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.packSize === item.packSize)
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId && i.packSize === item.packSize
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (productId: string, packSize: string) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.packSize === packSize)))
  }

  const updateQuantity = (productId: string, packSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, packSize)
      return
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.packSize === packSize ? { ...i, quantity } : i
      )
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const totalPrice = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace('₹', '').replace(',', '')) || 0
    return sum + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
