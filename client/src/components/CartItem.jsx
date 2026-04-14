import { Minus, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CartItem.css';

const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTUwIDE2MEgyNTBWMjQwSDE1MFYxNjBaIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjE4NSIgcj0iMTAiIGZpbGw9IiNEMUQ1REIiLz48cGF0aCBkPSJNMTUwIDIzMEwxODUgMjAwTDIxMCAyMjBMMjMwIDIwMEwyNTAgMjIwVjI0MEgxNTBWMjMwWiIgZmlsbD0iI0QxRDVEQiIvPjwvc3ZnPg==';

export default function CartItem({ item, onUpdate, onRemove, disabled }) {
  const handleImgError = (e) => {
    e.target.src = FALLBACK_IMG;
    e.target.classList.add('fallback-img');
  };

  const overStock = item.stock > 0 && item.quantity > item.stock;

  return (
    <div className="cart-item" id={`cart-item-${item.id}`}>
      <Link to={`/product/${item.product_id}`} className="cart-item-image-wrap">
        <img src={item.images?.[0] || FALLBACK_IMG} alt={item.name} className="cart-item-image" onError={handleImgError} />
      </Link>
      <div className="cart-item-details">
        <Link to={`/product/${item.product_id}`} className="cart-item-title">{item.name}</Link>
        <div className="cart-item-stock">
          {item.stock > 0 ? (
            <span className="in-stock">In Stock</span>
          ) : (
            <span className="out-stock">Out of Stock</span>
          )}
        </div>
        {overStock && (
          <div className="cart-item-warning">
            <AlertTriangle size={13} />
            Only {item.stock} available — please reduce quantity
          </div>
        )}
        <div className="cart-item-actions">
          <div className="qty-control">
            <button
              className="qty-btn"
              onClick={() => item.quantity > 1 ? onUpdate(item.id, item.quantity - 1) : onRemove(item.id)}
              disabled={disabled}
              aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
            >
              {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => onUpdate(item.id, item.quantity + 1)}
              disabled={disabled}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="cart-divider">|</span>
          <button className="cart-remove-btn" onClick={() => onRemove(item.id)} disabled={disabled}>Delete</button>
        </div>
      </div>
      <div className="cart-item-price">
        <span className="price">
          <span className="price-symbol">$</span>
          <span className="price-whole">{Math.floor(item.price * item.quantity)}</span>
          <span className="price-fraction">{((item.price * item.quantity) % 1 * 100).toFixed(0).padStart(2, '0')}</span>
        </span>
      </div>
    </div>
  );
}
