// src/pages/ProductList.tsx
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import { products as allProducts } from '../data/products'
import { Product } from '../types/Product'
import './ProductList.css'
import { useToast } from '../ToastContext'

const ProductList = () => {
  // Estados
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)

  // Loading
  const [loading, setLoading] = useState(true)
  const { addToast, removeToast } = useToast()
  useEffect(() => {
    // Simula carga de productos (2 segundos)
    const loadingId = addToast('Cargando productos...', 'loading')
    setLoading(true)
    const timer = setTimeout(() => {
      setFilteredProducts(allProducts)
      removeToast(loadingId) // Remueve el toast de carga
      addToast('Productos cargados!', 'success')
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Función de filtrado combinada
  const filterProducts = (
    category: string,
    search: string,
    sort: string,
    supplier: string | null = selectedSupplier,
    range: { min: number; max: number } | null = priceRange
  ) => {
    let filtered = [...allProducts]

    if (category !== 'all') filtered = filtered.filter(p => p.category === category)

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      )
    }

    if (supplier) filtered = filtered.filter(p => p.supplier === supplier)

    if (range) filtered = filtered.filter(p => p.basePrice >= range.min && p.basePrice <= range.max)

    switch (sort) {
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'price': filtered.sort((a, b) => a.basePrice - b.basePrice); break
      case 'stock': filtered.sort((a, b) => b.stock - a.stock); break
    }

    setFilteredProducts(filtered)
  }

  const calcAvailableCategories = () => {
    const uniqueCategories = new Set(filteredProducts.map(p => p.category))
    return [...Array.from(uniqueCategories)].length
  }

  // Handlers
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterProducts(category, searchQuery, sortBy)
  }

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    filterProducts(selectedCategory, search, sortBy)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    filterProducts(selectedCategory, searchQuery, sort)
  }

  const handleSupplierChange = (supplier: string | null) => {
    setSelectedSupplier(supplier)
    filterProducts(selectedCategory, searchQuery, sortBy, supplier)
  }

  const handlePriceRangeChange = (range: { min: number; max: number } | null) => {
    setPriceRange(range)
    filterProducts(selectedCategory, searchQuery, sortBy, selectedSupplier, range)
  }

  const handleClearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSortBy('name')
    setSelectedSupplier(null)
    setPriceRange(null)
    filterProducts('all', '', 'name', null, null)
  }

  return (
    <div className="product-list-page page-appear">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>

          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">{filteredProducts.length}</span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">{calcAvailableCategories()}</span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <ProductFilters
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            sortBy={sortBy}
            selectedSupplier={selectedSupplier}
            priceRange={priceRange}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            onSupplierChange={handleSupplierChange}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products Section */}
        <div className="products-section">
          {!loading && filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">No se encontraron productos que coincidan con tu búsqueda.</p>
              <button
                className="btn btn-primary cta1"
                onClick={handleClearFilters}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
