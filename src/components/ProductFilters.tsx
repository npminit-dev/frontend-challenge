import { useState } from 'react'
import { categories, suppliers } from '../data/products'
import './ProductFilters.css'

interface ProductFiltersProps {
  selectedCategory: string
  searchQuery: string
  sortBy: string
  selectedSupplier: string | null
  priceRange: { min: number; max: number } | null
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: string) => void
  onSupplierChange: (supplier: string | null) => void
  onPriceRangeChange: (range: { min: number; max: number } | null) => void
  onClearFilters: () => void
}

const ProductFilters = ({
  selectedCategory,
  searchQuery,
  sortBy,
  selectedSupplier,
  priceRange,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onSupplierChange,
  onPriceRangeChange,
  onClearFilters
}: ProductFiltersProps) => {

  const [minPriceInput, setMinPriceInput] = useState(priceRange?.min || '')
  const [maxPriceInput, setMaxPriceInput] = useState(priceRange?.max || '')

  const handlePriceChange = () => {
    const min = Number(minPriceInput)
    const max = Number(maxPriceInput)
    if (!isNaN(min) && !isNaN(max) && min <= max) {
      onPriceRangeChange({ min, max })
    } else {
      onPriceRangeChange(null)
    }
  }

  const handleClearPrice = () => {
    setMinPriceInput('')
    setMaxPriceInput('')
    onPriceRangeChange(null)
  }

  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => onSearchChange('')}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h2 className="filter-title p1-medium">Categorías</h2>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <label>
            <h2 className="filter-title p1-medium">Ordenar por</h2>
            <select 
              value={sortBy} 
              onChange={(e) => onSortChange(e.target.value)}
              className="sort-select p1"
            >
              <option value="name">Nombre A-Z</option>
              <option value="price">Precio</option>
              <option value="stock">Stock disponible</option>
            </select>
          </label>
        </div>

        {/* Supplier Filters */}
        <div className="filter-section">
          <h2 className="filter-title p1-medium">Proveedores</h2>
          <div className="supplier-list">
            <button
              className={`category-btn ${selectedSupplier === null ? 'active' : ''}`}
              onClick={() => onSupplierChange(null)}
            >
              Todos
            </button>
            {suppliers.map(supplier => (
              <button
                key={supplier.id}
                className={`category-btn ${selectedSupplier === supplier.id ? 'active' : ''}`}
                onClick={() => onSupplierChange(supplier.id)}
              >
                {supplier.name} ({supplier.products})
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filters */}
        <div className="filter-section">
          <h2 className="filter-title p1-medium">Rango de precios</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="sort-select"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="sort-select"
            />
            <button className="btn btn-primary" onClick={handlePriceChange}>
              Aplicar
            </button>
            <button className="btn" onClick={handleClearPrice}>
              Limpiar
            </button>
          </div>
        </div>

        {/* Clear All Filters */}
        <div className="filter-section">
          <button className="btn btn-secondary w-full" onClick={onClearFilters}>
            Limpiar todos los filtros
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters
