import { Star, ShoppingCart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import './ProductCard.css';

const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTUwIDE2MEgyNTBWMjQwSDE1MFYxNjBaIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjE4NSIgcj0iMTAiIGZpbGw9IiNEMUQ1REIiLz48cGF0aCBkPSJNMTUwIDIzMEwxODUgMjAwTDIxMCAyMjBMMjMwIDIwMEwyNTAgMjIwVjI0MEgxNTBWMjMwWiIgZmlsbD0iI0QxRDVEQiIvPjwvc3ZnPg==';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    await addToCart(product.id);
    setTimeout(() => setAdding(false), 800);
  };

  const handleImgError = (e) => {
    e.target.src = FALLBACK_IMG;
    e.target.classList.add('fallback-img');
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} size={14} fill={i <= Math.round(rating) ? 'var(--color-star)' : 'none'} stroke="var(--color-star)" />
      );
    }
    return stars;
  };

  const formatPrice = (price) => {
    const [whole, fraction] = price.toFixed(2).split('.');
    return (
      <span className="price">
        <span className="price-symbol">$</span>
        <span className="price-whole">{whole}</span>
        <span className="price-fraction">{fraction}</span>
      </span>
    );
  };

  const outOfStock = product.stock <= 0;

  return (
    <Link to={`/product/${product.id}`} className="product-card" id={`product-card-${product.id}`}>
      <div className="card-image-wrap">
        <img src={product.images?.[0] || FALLBACK_IMG} alt={product.name} className="card-image" loading="lazy" onError={handleImgError} />
        {outOfStock && <div className="card-out-badge">Out of Stock</div>}
      </div>
      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        <div className="card-rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span className="card-reviews">{product.review_count?.toLocaleString()}</span>
        </div>
        <div className="card-price">{formatPrice(product.price)}</div>
        {product.price >= 25 && <div className="card-shipping">FREE delivery</div>}
        <button
          className={`btn btn-primary card-add-btn ${adding ? 'added' : ''}`}
          onClick={handleAdd}
          disabled={adding || outOfStock}
          aria-label={`Add ${product.name} to cart`}
        >
          {adding ? (
            <><Loader2 size={14} className="spinner" /> Adding...</>
          ) : outOfStock ? (
            'Out of Stock'
          ) : (
            <><ShoppingCart size={14} /> Add to Cart</>
          )}
        </button>
      </div>
    </Link>
  );
}
