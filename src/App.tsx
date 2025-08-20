import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import './App.css'
import { CartProvider } from './CartContext'
import Cart from './pages/Cart'
import { Quotation } from './pages/Quotation'
import { ToastProvider } from './ToastContext'

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/quotation" element={<Quotation />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </ToastProvider>
  )
}

export default App