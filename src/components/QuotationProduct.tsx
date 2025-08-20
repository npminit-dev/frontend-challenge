import { useState, ChangeEvent } from 'react';
import { PriceBreak, Product } from '../types/Product';
import { SelectedProduct } from './QuotationForm';

interface QuotationProductProps {
  product: Product;
  onProductSelect: (product: SelectedProduct) => void;
}

export const QuotationProduct = ({ product, onProductSelect }: QuotationProductProps) => {
  const [quantity, setQuantity] = useState<string>(''); // inicia vacío para mostrar placeholder

  const calculatePrice = (qty: number) => {
    let unitPrice = product.basePrice;
    let discount;
    const sortedBreaks = [...(product.priceBreaks as PriceBreak[])].sort((a, b) => b.minQty - a.minQty);
    for (const pb of sortedBreaks) {
      if (qty >= pb.minQty) {
        unitPrice = pb.price;
        discount = pb.discount;
        break;
      }
    }
    return { unitPrice, discount };
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);

    if (value === '') {
      // Cadena vacía → cantidad = 0
      onProductSelect({ id: product.id, name: product.name, quantity: 0, unitPrice: 0 });
      return;
    }

    const qty = Number(value);
    if (!isNaN(qty) && qty > 0) {
      const { unitPrice, discount } = calculatePrice(qty);
      onProductSelect({ id: product.id, name: product.name, quantity: qty, unitPrice, discount });
    }
  };

  const handleBlur = () => {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      setQuantity(''); // placeholder visible
      onProductSelect({ id: product.id, name: product.name, quantity: 0, unitPrice: 0 });
      return;
    }
    // qty > 0 ya se actualizó en onChange
  };

  const handleFocus = () => {
    if (quantity === '0') setQuantity('');
  };

  return (
    <div className="product-item">
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-base-price">Precio base: ${product.basePrice}</p>
      </div>
      <input
        type="number"
        min={0}
        max={product.stock}
        value={quantity}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="Cantidad"
      />
    </div>
  );
};
