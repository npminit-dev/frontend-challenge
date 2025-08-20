import { PriceBreak, Product } from './types/Product';

export interface PriceCalculation {
  unitPrice: number;
  discount?: number;
}

/**
 * Calcula el precio unitario de un producto según la cantidad,
 * aplicando el mejor descuento posible de los priceBreaks.
 */
export const calculatePrice = (
  product: Product,
  quantity: number
): PriceCalculation => {
  // Ordenar los priceBreaks por minQty descendente
  const sortedBreaks = [...product.priceBreaks as PriceBreak[]].sort(
    (a, b) => b.minQty - a.minQty
  );

  // Buscar el primer priceBreak que cumpla la cantidad
  const applicableBreak = sortedBreaks.find((pb) => quantity >= pb.minQty);

  if (!applicableBreak) {
    // No hay priceBreak aplicable, usamos precio base
    return { unitPrice: product.basePrice };
  }

  return {
    unitPrice: applicableBreak.price,
    discount: applicableBreak.discount,
  };
};
