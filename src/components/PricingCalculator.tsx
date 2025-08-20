import { useState, useEffect } from 'react'
import { Product } from '../types/Product'
import { useCart } from '../CartContext'
import './PricingCalculator.css'
import { useToast } from '../ToastContext'
import { useNavigate } from 'react-router-dom'

interface PricingCalculatorProps {
  product: Product
  selectedColor?: string
  selectedSize?: string
}

const PricingCalculator = ({ product, selectedColor, selectedSize }: PricingCalculatorProps) => {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedBreak, setSelectedBreak] = useState<number>(0)
  const { addToast } = useToast()
  const navigate = useNavigate()

  // Ajustar cantidad si el stock cambia
  useEffect(() => {
    if (product.stock === 0) setQuantity(0)
    else if (quantity > product.stock) setQuantity(product.stock)
  }, [product.stock])

  // Calcula precio unitario según priceBreaks
  const getUnitPrice = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) return product.basePrice
    let applicableBreak = product.priceBreaks[0]
    for (let pb of product.priceBreaks) {
      if (qty >= pb.minQty) applicableBreak = pb
    }
    return applicableBreak.price
  }

  const calculatePrice = (qty: number) => getUnitPrice(qty) * qty

  const getDiscount = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) return 0
    const baseTotal = product.basePrice * qty
    const discountedTotal = calculatePrice(qty)
    return ((baseTotal - discountedTotal) / baseTotal) * 100
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price)

  const currentPrice = calculatePrice(quantity)
  const discountPercent = getDiscount(quantity)
  const canAddToCart = product.stock > 0

  const handleAddToCart = () => {
    if (!canAddToCart) {
      addToast('No hay stock disponible para este producto', 'error')
      return
    } else {
      const unitPrice = getUnitPrice(quantity)

      addToCart({
        id: product.id,
        name: product.name,
        basePrice: product.basePrice,
        unitPrice,
        quantity,
        priceBreaks: product.priceBreaks,
        color: selectedColor,
        size: selectedSize,
      })

      addToast('Producto agregado al carrito', 'success')
    }

  }

  return (
    <div className="pricing-calculator">
      <div className="calculator-header">
        <h3 className="calculator-title p1-medium">Calculadora de Precios</h3>
        <p className="calculator-subtitle l1">
          Calcula el precio según la cantidad que necesitas
        </p>
      </div>

      <div className="calculator-content">
        {/* Quantity Input */}
        <div className="quantity-section">
          <label className="quantity-label p1-medium">Cantidad</label>
          <div className="quantity-input-group">
            <button
              className="quantity-btn"
              disabled={!canAddToCart || quantity <= 1}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              min={1}
              max={product.stock}
              disabled={!canAddToCart}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1
                setQuantity(Math.min(Math.max(1, val), product.stock))
              }}
              className="quantity-input p1"
            />
            <button
              className="quantity-btn"
              disabled={!canAddToCart || quantity >= product.stock}
              onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}
            >
              +
            </button>
            <span className="quantity-unit l1">unidades</span>
          </div>
        </div>

        {/* Price Breaks */}
        {product.priceBreaks && product.priceBreaks.length > 0 && (
          <div className="price-breaks-section">
            <h4 className="breaks-title p1-medium">Descuentos por volumen</h4>
            <div className="price-breaks">
              {product.priceBreaks.map((priceBreak, index) => {
                const isActive = quantity >= priceBreak.minQty
                const isSelected = selectedBreak === index
                return (
                  <div
                    key={index}
                    className={`price-break ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedBreak(index)
                      setQuantity(priceBreak.minQty)
                    }}
                  >
                    <div className="break-quantity l1">{priceBreak.minQty}+ unidades</div>
                    <div className="break-price p1-medium">{formatPrice(priceBreak.price)}</div>
                    {priceBreak.discount && (
                      <div className="break-discount l1">-{priceBreak.discount}%</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="price-summary">
          <div className="summary-row">
            <span className="summary-label p1">Precio unitario:</span>
            <span className="summary-value p1-medium">{formatPrice(currentPrice / quantity)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label p1">Cantidad:</span>
            <span className="summary-value p1-medium">{quantity} unidades</span>
          </div>
          {discountPercent > 0 && (
            <div className="summary-row discount-row">
              <span className="summary-label p1">Descuento:</span>
              <span className="summary-value discount-value p1-medium">-{discountPercent.toFixed(0)}%</span>
            </div>
          )}
          <div className="summary-row total-row">
            <span className="summary-label p1-medium">Total:</span>
            <span className="summary-value total-value h2">{formatPrice(currentPrice)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="calculator-actions">
          <button
            className="btn btn-secondary cta1"
            onClick={() => {
              navigate('/quotation')
            }}
          >
            <span className="material-icons">email</span>
            Solicitar cotización oficial
          </button>

          <button
            className="btn btn-primary cta1"
            onClick={handleAddToCart}
          >
            <span className="material-icons">shopping_cart</span>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default PricingCalculator
