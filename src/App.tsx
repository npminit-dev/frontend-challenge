import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import './App.css'
import { CartProvider } from './CartContext'
import { ToastProvider } from './ToastContext'
import { lazy, Suspense } from 'react'
import ProductList from './pages/ProductList'
import Loader from './components/Loader'

// 🔹 Importación diferida (lazy)
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Quotation = lazy(() => import('./pages/Quotation').then(module => ({ default: module.Quotation })))

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <div className="App">
          <Header />
          <main>
            {/* 🔹 Suspense para mostrar fallback mientras se carga */}
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/quotation" element={<Quotation />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </CartProvider>
    </ToastProvider>
  )
}

export default App