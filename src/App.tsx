import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminSignInPage from './pages/AdminSignInPage';
import AdminSignUpPage from './pages/AdminSignUpPage';
import AdminPage from './pages/AdminPage';
import UserDashboard from './pages/UserDashboard';
import CountdownTimer from './components/CountdownTimer';
import FeaturedProducts from './components/FeaturedProducts';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProductProvider } from './context/ProductContext';
import Footer from './components/Footer';
import SlideCart from './components/SlideCart';
import FloatingLanterns from './components/FloatingLanterns';

const CartContext = React.createContext<{
  openCart: () => void;
  closeCart: () => void;
}>({
  openCart: () => {},
  closeCart: () => {},
});

export { CartContext };

function AppContent({ isCartOpen, closeCart }: { isCartOpen: boolean; closeCart: () => void }) {
  const { loading } = useAuth();
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark flex items-center justify-center">
        <div className="animate-pulse text-yellow-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark islamic-pattern light-pattern texture-overlay transition-colors duration-300 relative overflow-x-hidden">
      <FloatingLanterns />
      {/* Navigation */}
      {!location.pathname.startsWith('/admin') && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/account" element={<UserDashboard />} />
        <Route path="/admin/signin" element={<AdminSignInPage />} />
        <Route path="/admin/signup" element={<AdminSignUpPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      {!location.pathname.startsWith('/admin') && <Footer />}
      <SlideCart isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartContextValue = React.useMemo(() => ({
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false)
  }), []);


  // Ensure providers are properly nested
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <ThemeProvider>
            <CartProvider>
              <CartContext.Provider value={cartContextValue}>
                <AppContent isCartOpen={isCartOpen} closeCart={cartContextValue.closeCart} />
              </CartContext.Provider>
            </CartProvider>
          </ThemeProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;