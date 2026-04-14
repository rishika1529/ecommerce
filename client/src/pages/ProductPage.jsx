import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ImageCarousel from '../components/ImageCarousel';
import EmptyState from '../components/EmptyState';
import { Star, ShoppingCart, Zap, Shield, RotateCcw, Truck, Loader2, PackageX } from 'lucide-react';
import './ProductPage.css';

const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTUwIDE2MEgyNTBWMjQwSDE1MFYxNjBaIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjE4NSIgcj0iMTAiIGZpbGw9IiNEMUQ1REIiLz48cGF0aCBkPSJNMTUwIDIzMEwxODUgMjAwTDIxMCAyMjBMMjMwIDIwMEwyNTAgMjIwVjI0MEgxNTBWMjMwWiIgZmlsbD0iI0QxRDVEQiIvPjwvc3ZnPg==';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Validate ID is numeric
    if (!/^\d+$/.test(id)) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    api.getProduct(id)
      .then(setProduct)
      .catch((err) => {
        setProduct(null);
        setError(err.message || 'Product not found');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);
    await addToCart(product.id);
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuyNow = async () => {
    if (buying) return;
    setBuying(true);
    const result = await addToCart(product.id);
    if (result.success) {
      navigate('/cart');
    }
    setBuying(false);
  };

  if (loading) return (
    <div className="product-page container">
      <div className="pp-grid">
        <div className="skeleton" style={{ height: 400, borderRadius: 8 }}></div>
        <div>
          <div className="skeleton" style={{ height: 30, width: '80%', marginBottom: 16 }}></div>
          <div className="skeleton" style={{ height: 20, width: '50%', marginBottom: 16 }}></div>
          <div className="skeleton" style={{ height: 40, width: '30%' }}></div>
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 8 }}></div>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="product-page container">
      <EmptyState
        icon={PackageX}
        title={error || 'Product not found'}
        subtitle="The product you're looking for doesn't exist or may have been removed."
        actionText="Browse Products"
        actionTo="/"
      />
    </div>
  );

  const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={16} fill={i < Math.round(rating) ? 'var(--color-star)' : 'none'} stroke="var(--color-star)" />
  ));

  const specs = product.specs || {};
  const outOfStock = product.stock <= 0;

  return (
    <div className="product-page container">
      <div className="pp-breadcrumb">
        <Link to="/">Home</Link> / <Link to={`/?category=${product.category_id}`}>{product.category_name}</Link> / <span>{product.name}</span>
      </div>

      <div className="pp-grid">
        {/* Left: Images */}
        <div className="pp-images">
          <ImageCarousel images={product.images} />
        </div>

        {/* Middle: Details */}
        <div className="pp-details">
          <h1 className="pp-title">{product.name}</h1>
          <div className="pp-rating">
            <span className="pp-rating-num">{product.rating}</span>
            <div className="stars">{renderStars(product.rating)}</div>
            <a href="#" className="pp-reviews">{product.review_count?.toLocaleString()} ratings</a>
          </div>
          <div className="pp-separator"></div>
          <div className="pp-price-section">
            <span className="pp-price-label">Price:</span>
            <span className="price">
              <span className="price-symbol">$</span>
              <span className="price-whole">{Math.floor(product.price)}</span>
              <span className="price-fraction">{((product.price % 1) * 100).toFixed(0).padStart(2, '0')}</span>
            </span>
          </div>
          <div className="pp-perks">
            <div className="pp-perk"><Truck size={16} /> FREE delivery on orders over $25</div>
            <div className="pp-perk"><RotateCcw size={16} /> Free 30-day returns</div>
            <div className="pp-perk"><Shield size={16} /> 1-year warranty included</div>
          </div>
          <div className="pp-separator"></div>
          <div className="pp-about">
            <h3>About this item</h3>
            <p>{product.description}</p>
          </div>
          {Object.keys(specs).length > 0 && (
            <div className="pp-specs">
              <h3>Technical Details</h3>
              <table className="specs-table">
                <tbody>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="spec-key">{key.replace(/_/g, ' ')}</td>
                      <td className="spec-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Buy box */}
        <div className="pp-buybox">
          <div className="buybox-card">
            <div className="buybox-price">
              <span className="price">
                <span className="price-symbol">$</span>
                <span className="price-whole">{Math.floor(product.price)}</span>
                <span className="price-fraction">{((product.price % 1) * 100).toFixed(0).padStart(2, '0')}</span>
              </span>
            </div>
            <div className="buybox-delivery">
              <Truck size={16} /> FREE delivery <strong>Tomorrow</strong>
            </div>
            <div className={`buybox-stock ${outOfStock ? 'out' : 'in'}`}>
              {outOfStock ? 'Out of Stock' : `In Stock (${product.stock} left)`}
            </div>
            <button
              className="btn btn-primary btn-lg buybox-btn"
              onClick={handleAddToCart}
              disabled={adding || outOfStock}
            >
              {adding ? (
                <><Loader2 size={16} className="spinner" /> Adding...</>
              ) : (
                <><ShoppingCart size={16} /> Add to Cart</>
              )}
            </button>
            <button
              className="btn btn-accent btn-lg buybox-btn"
              onClick={handleBuyNow}
              disabled={buying || outOfStock}
            >
              {buying ? (
                <><Loader2 size={16} className="spinner" /> Processing...</>
              ) : (
                <><Zap size={16} /> Buy Now</>
              )}
            </button>
            <div className="buybox-meta">
              <div><span className="meta-label">Ships from</span> <span>ShopVerse</span></div>
              <div><span className="meta-label">Sold by</span> <span>ShopVerse</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
