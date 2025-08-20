// src/components/QuotationSimulator/QuotationSummary.tsx
import { SelectedProduct, CompanyData } from './QuotationForm';
import jsPDF from 'jspdf';
import './QuotationSummary.css'
import { useToast } from '../ToastContext';

interface QuotationSummaryProps {
  selectedProducts: SelectedProduct[];
  companyData: CompanyData;
}

export const QuotationSummary = ({
  selectedProducts,
  companyData,
}: QuotationSummaryProps) => {
  const total = selectedProducts.reduce(
    (sum, p) => sum + p.unitPrice * p.quantity,
    0
  );

  const { addToast, removeToast } = useToast()

  const generatePDF = () => {
    const loadingId = addToast('Generando PDF...', 'loading');
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Cotización de Productos', 14, 20);

    // Datos de la empresa
    doc.setFontSize(12);
    doc.text(`Empresa: ${companyData.name}`, 14, 30);
    doc.text(`RUT: ${companyData.rut}`, 14, 36);
    doc.text(`Email: ${companyData.email}`, 14, 42);
    doc.text(`Teléfono: ${companyData.phone}`, 14, 48);

    // Productos
    let y = 60;
    selectedProducts.forEach((p) => {
      doc.text(
        `${p.name} - Cant: ${p.quantity} - Precio Unit: $${p.unitPrice} ${p.discount ? `(Desc: ${p.discount}%)` : ''
        }`,
        14,
        y
      );
      y += 6;
    });

    doc.text(`Total: $${total}`, 14, y + 6);
    setTimeout(() => {
      removeToast(loadingId);
      addToast('PDF generado correctamente.', 'success');
      doc.save(`cotizacion_${companyData.name || 'empresa'}.pdf`);
    }, 2000)
  };

  if (selectedProducts.length === 0) return <p>No hay productos seleccionados.</p>;

  return (
    <div className="quotation-summary">
      <h2>Resumen de Cotización</h2>

      <div className="summary-list">
        {selectedProducts.map((p) => (
          <div key={p.id} className="summary-item">
            <span className="product-name">{p.name} (x{p.quantity})</span>
            <span className="product-price">
              ${p.unitPrice}
              {p.discount ? ` (-${p.discount}%)` : ''}
            </span>
          </div>
        ))}
      </div>

      <div className="summary-total">
        <span>Total:</span>
        <span>${total}</span>
      </div>

      <button onClick={generatePDF} className="btn-export">
        Exportar PDF
      </button>
    </div>
  );
};
