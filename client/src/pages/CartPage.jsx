import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import './CartPage.css';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null); // Track which item is being updated
  const { setCartCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const loadCart = useCallback(async () => {
    try {
      const data = await api.getCart();
      setItems(data.items);
      setCartCount(data.count);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, [setCartCount]);

  useEffect(() => { loadCart(); }, [loadCart]);

  const handleUpdate = async (id, quantity) => {
    setActionId(id);
    try {
      const data = await api.updateCartItem(id, quantity);
      setCartCount(data.count);
      await loadCart();
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
    setActionId(null);
  };

  const handleRemove = async (id) => {
    setActionId(id);
    try {
      const data = await api.removeCartItem(id);
      setCartCount(data.count);
      showToast('Item removed from cart', 'info');
      await loadCart();
    } catch (err) {
      showToast(err.message || 'Failed to remove item', 'error');
    }
    setActionId(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) return (
    <div className="cart-page container">
      <div className="skeleton" style={{ height: 40, width: 200, marginBottom: 20, borderRadius: 8 }}></div>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 200, marginBottom: 12, borderRadius: 8 }}></div>)}
    </div>
  );

  return (
    <div className="cart-page container">
      <div className="cart-layout">
        <div className="cart-main">
          <div className="cart-header-row">
            <h1 className="cart-title">Shopping Cart</h1>
            {items.length > 0 && <span className="cart-price-header">Price</span>}
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              subtitle="Browse our products and find something you love!"
              actionText="Continue Shopping"
              actionTo="/"
            />
          ) : (
            <div className="cart-items">
              {items.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  disabled={actionId === item.id}
                />
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="cart-subtotal-row">
              Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''}):
              <span className="cart-subtotal-amount"> ${subtotal.toFixed(2)}</span>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-sidebar">
            <div className="cart-summary-card">
              <div className="cart-secure"><ShieldCheck size={16} color="var(--color-success)" /> Your order qualifies for FREE delivery</div>
              <div className="cart-summary-total">
                Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''}):
                <strong> ${subtotal.toFixed(2)}</strong>
              </div>
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={() => navigate('/checkout')}
                id="cart-checkout-btn"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
