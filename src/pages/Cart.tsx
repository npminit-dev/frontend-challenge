// Cart.tsx
import { useCart } from '../CartContext'
import { Link } from 'react-router-dom'
import './Cart.css'

const Cart = () => {
  const { cart, totalItems, removeFromCart, clearCart } = useCart()

  const totalPrice = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price)

  if (cart.length === 0) {
    return (
      <div className="cart-page empty">
        <h2>Tu carrito está vacío</h2>
        <Link to="/" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Carrito de Compras ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>

      <div className="cart-items">
        {cart.map((item, index) => {
          const totalItemPrice = item.unitPrice * item.quantity
          const discountPercent = item.basePrice > item.unitPrice
            ? Math.round(((item.basePrice - item.unitPrice) / item.basePrice) * 100)
            : 0

          return (
            <div key={index} className="cart-item">
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                {item.color && <span className="item-variant">Color: {item.color}</span>}
                {item.size && <span className="item-variant">Talla: {item.size}</span>}
              </div>

              <div className="item-quantity">
                <span>{item.quantity}</span>
              </div>

              <div className="item-price">
                <span>{formatPrice(totalItemPrice)}</span>
                {discountPercent > 0 && <span className="item-discount">-{discountPercent}%</span>}
              </div>

              <div className="item-actions">
                <button
                  onClick={() => removeFromCart(item.id, item.color, item.size)}
                  className="btn btn-secondary"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="cart-summary">
        <span>Total:</span>
        <span className="total-price">{formatPrice(totalPrice)}</span>
      </div>

      <div className="cart-actions">
        <button onClick={clearCart} className="btn btn-secondary">
          Vaciar carrito
        </button>
        <button className="btn btn-primary">
          Finalizar compra
        </button>
      </div>
    </div>
  )
}

export default Cart
