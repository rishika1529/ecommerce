import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/api';
import EmptyState from '../components/EmptyState';
import { CheckCircle, Package, Truck, MapPin, FileQuestion } from 'lucide-react';
import './ConfirmationPage.css';

const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTUwIDE2MEgyNTBWMjQwSDE1MFYxNjBaIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iNCIvPjwvc3ZnPg==';

export default function ConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Validate order ID
    if (!/^\d+$/.test(id)) {
      setError('Invalid order ID format');
      setLoading(false);
      return;
    }

    api.getOrder(id)
      .then(setOrder)
      .catch((err) => {
        setOrder(null);
        setError(err.message || 'Order not found');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleImgError = (e) => {
    e.target.src = FALLBACK_IMG;
  };

  if (loading) return (
    <div className="confirm-page container">
      <div className="skeleton" style={{ height: 120, borderRadius: 8, marginBottom: 24 }}></div>
      <div className="confirm-grid">
        <div className="skeleton" style={{ height: 400, borderRadius: 8 }}></div>
        <div className="skeleton" style={{ height: 250, borderRadius: 8 }}></div>
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="confirm-page container">
      <EmptyState
        icon={FileQuestion}
        title={error || 'Order not found'}
        subtitle="We couldn't find this order. Please check the order ID and try again."
        actionText="Back to Home"
        actionTo="/"
      />
    </div>
  );

  // User-friendly order ID
  const displayId = order.display_id || `SV-${String(order.id).padStart(6, '0')}`;

  return (
    <div className="confirm-page container">
      <div className="confirm-success">
        <div className="confirm-check-circle">
          <CheckCircle size={48} />
        </div>
        <h1 className="confirm-title">Order Placed Successfully!</h1>
        <p className="confirm-subtitle">Thank you for your purchase. Your order has been confirmed.</p>
      </div>

      <div className="confirm-grid">
        <div className="confirm-card">
          <div className="confirm-order-id">
            <Package size={20} />
            <div>
              <span className="confirm-label">Order ID</span>
              <span className="confirm-value">{displayId}</span>
            </div>
          </div>

          <div className="confirm-timeline">
            <div className="timeline-step active">
              <div className="timeline-dot"></div>
              <div className="timeline-info">
                <span className="timeline-title">Order Placed</span>
                <span className="timeline-date">{new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot"></div>
              <div className="timeline-info">
                <span className="timeline-title">Processing</span>
                <span className="timeline-date">Estimated 1-2 days</span>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot"></div>
              <div className="timeline-info">
                <span className="timeline-title">Shipped</span>
                <span className="timeline-date">Estimated 2-3 days</span>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot"></div>
              <div className="timeline-info">
                <span className="timeline-title">Delivered</span>
                <span className="timeline-date">Estimated 3-5 days</span>
              </div>
            </div>
          </div>

          <div className="confirm-address">
            <MapPin size={16} />
            <div>
              <span className="confirm-label">Shipping to</span>
              <span>{order.address_line}, {order.city}, {order.state} {order.zip}</span>
            </div>
          </div>

          <h3 className="confirm-items-title">Items Ordered</h3>
          <div className="confirm-items">
            {order.items?.map(item => {
              // Handle images — they may already be parsed as array or still be JSON string
              let imgUrl = FALLBACK_IMG;
              try {
                const imgs = Array.isArray(item.images) ? item.images : JSON.parse(item.images);
                imgUrl = imgs?.[0] || FALLBACK_IMG;
              } catch {
                imgUrl = FALLBACK_IMG;
              }

              return (
                <div key={item.id} className="confirm-item">
                  <img src={imgUrl} alt={item.name} className="confirm-item-img" onError={handleImgError} />
                  <div className="confirm-item-info">
                    <span className="confirm-item-name">{item.name}</span>
                    <span className="confirm-item-meta">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                  </div>
                  <span className="confirm-item-total">${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="confirm-sidebar">
          <div className="confirm-summary-card">
            <h3>Payment Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span className="free-text">FREE</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${(order.total * 0.08).toFixed(2)}</span>
            </div>
            <div className="summary-separator"></div>
            <div className="summary-row summary-total">
              <span>Total:</span>
              <span>${(order.total * 1.08).toFixed(2)}</span>
            </div>
          </div>
          <Link to="/" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
