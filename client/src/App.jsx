import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/confirmation/:id" element={<ConfirmationPage />} />
              </Routes>
            </main>
            <footer className="footer">
              <div className="footer-back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to top
              </div>
              <div className="footer-main">
                <div className="footer-content container">
                  <div className="footer-col">
                    <h4>Get to Know Us</h4>
                    <a href="#">About ShopVerse</a>
                    <a href="#">Careers</a>
                    <a href="#">Press</a>
                  </div>
                  <div className="footer-col">
                    <h4>Make Money with Us</h4>
                    <a href="#">Sell on ShopVerse</a>
                    <a href="#">Become an Affiliate</a>
                    <a href="#">Advertise</a>
                  </div>
                  <div className="footer-col">
                    <h4>Payment</h4>
                    <a href="#">Gift Cards</a>
                    <a href="#">Reload Balance</a>
                    <a href="#">Payment Methods</a>
                  </div>
                  <div className="footer-col">
                    <h4>Let Us Help You</h4>
                    <a href="#">Your Account</a>
                    <a href="#">Returns</a>
                    <a href="#">Help</a>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <span className="logo-text" style={{ fontSize: 16 }}>ShopVerse</span>
                <span className="logo-dot" style={{ fontSize: 14 }}>.in</span>
                <span style={{ color: '#999', marginLeft: 12, fontSize: 12 }}>© 2026 ShopVerse. All rights reserved.</span>
              </div>
            </footer>
          </div>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
