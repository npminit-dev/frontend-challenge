// src/components/QuotationSimulator/Quotation.tsx
import { useState } from 'react';
import { products } from '../data/products';
import { QuotationForm, CompanyData, SelectedProduct } from '../components/QuotationForm';
import { QuotationSummary } from '../components/QuotationSummary';
import './Quotation.css';

export const Quotation = () => {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    rut: '',
    email: '',
    phone: '',
  });

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  const handleProductSelection = (product: SelectedProduct) => {
    setSelectedProducts((prev) => {
      if (product.quantity === 0) {
        return prev.filter(p => p.id !== product.id);
      }
      // si ya existe, actualiza; si no, agrega
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      } else {
        return [...prev, product];
      }
    });
  };

  return (
    <div className="quotation-simulator">
      <h1 className="quotation-title">Simulador de Cotización</h1>

      <div className="quotation-form-wrapper">
        <QuotationForm
          companyData={companyData}
          setCompanyData={setCompanyData}
          products={products}
          onProductSelect={handleProductSelection}
        />
      </div>

      <div className="quotation-summary-wrapper">
        <QuotationSummary
          companyData={companyData}
          selectedProducts={selectedProducts}
        />
      </div>
    </div>
  );
};
