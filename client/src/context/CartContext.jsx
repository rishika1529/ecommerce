import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { useToast } from './ToastContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { showToast } = useToast();

  const refreshCart = useCallback(async () => {
    try {
      const data = await api.getCart();
      setCartCount(data.count);
    } catch { setCartCount(0); }
  }, []);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const data = await api.addToCart(productId, quantity);
      setCartCount(data.count);
      showToast('Added to cart!', 'success');
      return { success: true, data };
    } catch (err) {
      showToast(err.message || 'Failed to add to cart', 'error');
      return { success: false, error: err.message };
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, refreshCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}
