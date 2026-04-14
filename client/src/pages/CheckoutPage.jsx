import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';
import { Lock, CreditCard, Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import './CheckoutPage.css';

const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTUwIDE2MEgyNTBWMjQwSDE1MFYxNjBaIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iNCIvPjwvc3ZnPg==';

// Validation rules
const validate = {
  address_line: (v) => {
    if (!v.trim()) return 'Street address is required';
    if (v.trim().length < 5) return 'Address must be at least 5 characters';
    return '';
  },
  city: (v) => {
    if (!v.trim()) return 'City is required';
    if (!/^[a-zA-Z\s.\-']+$/.test(v.trim())) return 'City must contain only letters';
    return '';
  },
  state: (v) => {
    if (!v.trim()) return 'State is required';
    if (v.trim().length < 2) return 'State must be at least 2 characters';
    return '';
  },
  zip: (v) => {
    if (!v.trim()) return 'ZIP code is required';
    if (!/^\d{5}(-\d{4})?$/.test(v.trim())) return 'Enter a valid ZIP (e.g., 10001 or 10001-1234)';
    return '';
  },
};

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ address_line: '', city: '', state: '', zip: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setCartCount } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    api.getCart()
      .then(data => {
        if (data.items.length === 0) {
          showToast('Your cart is empty. Add items to checkout.', 'info');
          navigate('/', { replace: true });
          return;
        }
        setItems(data.items);
        setLoading(false);
      })
      .catch(() => {
        showToast('Failed to load cart', 'error');
        setLoading(false);
      });
  }, [navigate, showToast]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 25 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validate on change if already touched
    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: validate[name](value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validate[name](value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = {};
    let hasError = false;
    for (const field of Object.keys(validate)) {
      const err = validate[field](form[field]);
      if (err) { errors[field] = err; hasError = true; }
    }
    setFieldErrors(errors);
    setTouched({ address_line: true, city: true, state: true, zip: true });

    if (hasError) {
      setError('Please fix the errors above');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const order = await api.placeOrder(form);
      setCartCount(0);
      showToast('Order placed successfully!', 'success');
      navigate(`/confirmation/${order.id}`);
    } catch (err) {
      setError(err.message);
      showToast(err.message || 'Failed to place order', 'error');
      setSubmitting(false);
    }
  };

  const handleImgError = (e) => {
    e.target.src = FALLBACK_IMG;
  };

  if (loading) return (
    <div className="checkout-page container">
      <div className="skeleton" style={{ height: 40, width: 240, marginBottom: 24, borderRadius: 8 }}></div>
      <div className="checkout-layout">
        <div className="checkout-form-section">
          <div className="skeleton" style={{ height: 280, borderRadius: 8, marginBottom: 16 }}></div>
          <div className="skeleton" style={{ height: 100, borderRadius: 8 }}></div>
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 8 }}></div>
      </div>
    </div>
  );

  return (
    <div className="checkout-page container">
      <div className="checkout-header">
        <Lock size={20} />
        <h1>Secure Checkout</h1>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
        <div className="checkout-form-section">
          {/* Shipping Address */}
          <div className="checkout-card">
            <h2 className="checkout-section-title">1. Shipping Address</h2>
            <div className="form-grid">
              <div className={`form-group form-full ${fieldErrors.address_line && touched.address_line ? 'has-error' : ''}`}>
                <label htmlFor="address_line">Street Address</label>
                <input
                  id="address_line"
                  name="address_line"
                  value={form.address_line}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="123 Main Street, Apt 4"
                  disabled={submitting}
                  autoComplete="street-address"
                />
                {fieldErrors.address_line && touched.address_line && (
                  <span className="form-error"><AlertCircle size={12} /> {fieldErrors.address_line}</span>
                )}
              </div>
              <div className={`form-group ${fieldErrors.city && touched.city ? 'has-error' : ''}`}>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="New York"
                  disabled={submitting}
                  autoComplete="address-level2"
                />
                {fieldErrors.city && touched.city && (
                  <span className="form-error"><AlertCircle size={12} /> {fieldErrors.city}</span>
                )}
              </div>
              <div className={`form-group ${fieldErrors.state && touched.state ? 'has-error' : ''}`}>
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="NY"
                  disabled={submitting}
                  autoComplete="address-level1"
                />
                {fieldErrors.state && touched.state && (
                  <span className="form-error"><AlertCircle size={12} /> {fieldErrors.state}</span>
                )}
              </div>
              <div className={`form-group ${fieldErrors.zip && touched.zip ? 'has-error' : ''}`}>
                <label htmlFor="zip">ZIP Code</label>
                <input
                  id="zip"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10001"
                  disabled={submitting}
                  autoComplete="postal-code"
                />
                {fieldErrors.zip && touched.zip && (
                  <span className="form-error"><AlertCircle size={12} /> {fieldErrors.zip}</span>
                )}
              </div>
            </div>
          </div>

          {/* Payment (mock) */}
          <div className="checkout-card">
            <h2 className="checkout-section-title">2. Payment Method</h2>
            <div className="payment-mock">
              <CreditCard size={20} />
              <div>
                <div className="payment-type">Credit/Debit Card</div>
                <div className="payment-detail">•••• •••• •••• 4242</div>
              </div>
            </div>
          </div>

          {/* Review Items */}
          <div className="checkout-card">
            <h2 className="checkout-section-title">3. Review Items ({items.length})</h2>
            <div className="review-items">
              {items.map(item => (
                <div key={item.id} className="review-item">
                  <img src={item.images?.[0] || FALLBACK_IMG} alt={item.name} className="review-item-img" onError={handleImgError} />
                  <div className="review-item-info">
                    <div className="review-item-name">{item.name}</div>
                    <div className="review-item-qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="review-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="checkout-summary-card">
            <button
              className="btn btn-primary btn-lg checkout-submit-btn"
              type="submit"
              disabled={submitting}
              id="checkout-place-order-btn"
            >
              {submitting ? (
                <><Loader2 size={16} className="spinner" /> Placing Order...</>
              ) : (
                'Place your order'
              )}
            </button>
            {error && <div className="checkout-error"><AlertCircle size={14} /> {error}</div>}
            <div className="summary-separator"></div>
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row"><span>Items ({items.reduce((s, i) => s + i.quantity, 0)}):</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping:</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Est. Tax:</span><span>${tax.toFixed(2)}</span></div>
            <div className="summary-separator"></div>
            <div className="summary-row summary-total"><span>Order Total:</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>
      </form>
    </div>
  );
}
