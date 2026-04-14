import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, MapPin, Menu, X, User, RotateCcw, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from 'react';
import './Header.css';

const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNNzUgODVIMTI1VjExNUg3NVY4NVoiIHN0cm9rZT0iI0Q1RDlEOSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+';

export default function Header() {
  const { cartCount } = useCart();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/');
    }
    setDrawerOpen(false);
  };

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [drawerOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
    { id: 3, name: 'Clothing' },
    { id: 4, name: 'Home & Kitchen' },
    { id: 5, name: 'Sports & Outdoors' },
    { id: 6, name: 'Beauty' },
  ];

  return (
    <>
      <header className="header">
        {/* Top bar */}
        <div className="header-inner">
          {/* Mobile menu button */}
          <button
            className="header-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="header-logo" aria-label="ShopVerse Home">
            <span className="logo-text">ShopVerse</span>
            <span className="logo-dot">.in</span>
          </Link>

          <div className="header-deliver">
            <MapPin size={16} />
            <div>
              <span className="deliver-label">Deliver to</span>
              <span className="deliver-location">India</span>
            </div>
          </div>

          <form className="header-search" onSubmit={handleSearch} role="search">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              id="header-search-input"
              aria-label="Search products"
            />
            <button type="submit" className="search-btn" id="header-search-btn" aria-label="Submit search">
              <Search size={20} />
            </button>
          </form>

          <nav className="header-nav" aria-label="User navigation">
            <Link to="/" className="nav-link">
              <span className="nav-line1">Hello, User</span>
              <span className="nav-line2">Account</span>
            </Link>
            <Link to="/" className="nav-link">
              <span className="nav-line1">Returns</span>
              <span className="nav-line2">& Orders</span>
            </Link>
            <Link to="/cart" className="nav-cart" id="header-cart-link" aria-label={`Shopping cart, ${cartCount} items`}>
              <div className="cart-icon-wrap">
                <ShoppingCart size={28} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span className="cart-text">Cart</span>
            </Link>
          </nav>
        </div>

        {/* Category bar (desktop) */}
        <div className="header-bottom">
          <div className="header-bottom-inner">
            <button className="header-menu-btn" onClick={() => setDrawerOpen(true)} aria-label="Open all categories">
              <Menu size={18} /> All
            </button>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/?category=${cat.id}`}
                className="header-cat-link"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} aria-hidden="true" />

      {/* Mobile drawer */}
      <div className={`drawer ${drawerOpen ? 'open' : ''}`} ref={drawerRef} role="dialog" aria-label="Navigation menu">
        <div className="drawer-header">
          <User size={24} />
          <span className="drawer-greeting">Hello, User</span>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <div className="drawer-section">
          <h3 className="drawer-section-title">Shop by Category</h3>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/?category=${cat.id}`}
              className="drawer-link"
              onClick={() => setDrawerOpen(false)}
            >
              {cat.name}
              <ChevronRight size={16} />
            </Link>
          ))}
        </div>

        <div className="drawer-divider" />

        <div className="drawer-section">
          <h3 className="drawer-section-title">Your Account</h3>
          <Link to="/" className="drawer-link" onClick={() => setDrawerOpen(false)}>
            <User size={16} /> Account
          </Link>
          <Link to="/" className="drawer-link" onClick={() => setDrawerOpen(false)}>
            <RotateCcw size={16} /> Returns & Orders
          </Link>
          <Link to="/cart" className="drawer-link" onClick={() => setDrawerOpen(false)}>
            <ShoppingCart size={16} /> Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
        </div>
      </div>
    </>
  );
}
