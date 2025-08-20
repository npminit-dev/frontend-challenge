import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface PriceBreak {
  minQty: number
  price: number
  discount?: number
}

export interface CartItem {
  id: number
  name: string
  basePrice: number
  unitPrice: number
  quantity: number
  priceBreaks?: PriceBreak[]
  color?: string
  size?: string
}

interface CartContextType {
  cart: CartItem[]
  totalItems: number
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number, color?: string, size?: string) => void
  clearCart: () => void
}

const cartContextDefValues: CartContextType = {
  cart: [],
  totalItems: 0,
  addToCart: () => null,
  removeFromCart: () => null,
  clearCart: () => null,
}

export const CartContext = createContext<CartContextType>(cartContextDefValues)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

// Función para calcular el precio unitario según priceBreaks y cantidad
const getUnitPrice = (basePrice: number, quantity: number, priceBreaks?: PriceBreak[]) => {
  if (!priceBreaks || priceBreaks.length === 0) return basePrice
  let applicableBreak = { minQty: 1, price: basePrice }
  for (let pb of priceBreaks) {
    if (quantity >= pb.minQty) applicableBreak = pb
  }
  return applicableBreak.price
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'))

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const index = prev.findIndex(
        i => i.id === item.id && i.color === item.color && i.size === item.size
      )

      const newQuantity = index !== -1 ? prev[index].quantity + item.quantity : item.quantity
      const unitPrice = getUnitPrice(item.basePrice, newQuantity, item.priceBreaks)

      if (index !== -1) {
        const updated = [...prev]
        updated[index] = { ...updated[index], quantity: newQuantity, unitPrice }
        return updated
      } else {
        return [...prev, { ...item, unitPrice }]
      }
    })
  }

  const removeFromCart = (id: number, color?: string, size?: string) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.color === color && i.size === size)))
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, totalItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
