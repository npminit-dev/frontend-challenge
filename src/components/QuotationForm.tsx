// src/components/QuotationSimulator/QuotationForm.tsx
import { useState, ChangeEvent } from 'react';
import { PriceBreak, Product } from '../types/Product';
import './QuotationForm.css'
import { QuotationProduct } from './QuotationProduct';

export interface CompanyData {
  name: string;
  rut: string;
  email: string;
  phone: string;
}

export interface SelectedProduct {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

interface QuotationFormProps {
  companyData: CompanyData;
  setCompanyData: (data: CompanyData) => void;
  products: Product[];
  onProductSelect: (product: SelectedProduct) => void;
}

export const QuotationForm = ({
  companyData,
  setCompanyData,
  products,
  onProductSelect,
}: QuotationFormProps) => {
  // Maneja cambios de datos de empresa
  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  return (
    <div className="quotation-form">

      {/* Datos de la empresa */}
      <div className="form-card">
        <h2>Datos de la Empresa</h2>
        <div className="company-inputs">
          <input
            type="text"
            name="name"
            value={companyData.name}
            onChange={handleCompanyChange}
            placeholder="Nombre de la empresa"
          />
          <input
            type="text"
            name="rut"
            value={companyData.rut}
            onChange={handleCompanyChange}
            placeholder="RUT"
          />
          <input
            type="email"
            name="email"
            value={companyData.email}
            onChange={handleCompanyChange}
            placeholder="Email"
          />
          <input
            type="tel"
            name="phone"
            value={companyData.phone}
            onChange={handleCompanyChange}
            placeholder="Teléfono"
          />
        </div>
      </div>

      {/* Lista de productos */}
      <div className="form-card">
        <h2>Productos</h2>
        <div className="product-list">
          {products.map((product) => (
            <QuotationProduct
              key={product.id}
              product={product}
              onProductSelect={onProductSelect}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
