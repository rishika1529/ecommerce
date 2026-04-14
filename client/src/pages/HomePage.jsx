import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/api';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { SlidersHorizontal, X, PackageOpen } from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') || '';

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (categoryId) params.category = categoryId;
    api.getProducts(params).then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [search, categoryId]);

  const activeCat = categories.find(c => String(c.id) === categoryId);

  return (
    <div className="home">
      {/* Hero banner */}
      {!search && !categoryId && (
        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Shop the Latest Deals</h1>
            <p className="hero-subtitle">Discover thousands of products at unbeatable prices</p>
          </div>
          <div className="hero-overlay"></div>
        </div>
      )}

      <div className="home-container container">
        {/* Filters bar */}
        <div className="filters-bar">
          <div className="filters-left">
            <SlidersHorizontal size={16} />
            <span className="filters-count">{products.length} results</span>
            {search && (
              <Link to={categoryId ? `/?category=${categoryId}` : '/'} className="filter-tag">
                "{search}" <X size={12} />
              </Link>
            )}
            {activeCat && (
              <Link to={search ? `/?search=${search}` : '/'} className="filter-tag">
                {activeCat.name} <X size={12} />
              </Link>
            )}
          </div>
          <div className="category-pills">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/?category=${cat.id}`}
                className={`cat-pill ${String(cat.id) === categoryId ? 'active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton" style={{ aspectRatio: '1', width: '100%' }}></div>
                <div style={{ padding: '12px' }}>
                  <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }}></div>
                  <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 8 }}></div>
                  <div className="skeleton" style={{ height: 24, width: '40%' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="No products found"
            subtitle={search ? `We couldn't find any results for "${search}". Try different keywords or browse our categories.` : 'Try a different category or search term.'}
            actionText="View All Products"
            actionTo="/"
          />
        ) : (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
