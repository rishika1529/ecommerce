const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const fetchJSON = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeout);

    // Handle non-JSON responses gracefully
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      return {};
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Request failed (${res.status})`);
    }

    return data;
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  }
};

export const api = {
  // Products
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchJSON(`/products${q ? `?${q}` : ''}`);
  },
  getProduct: (id) => fetchJSON(`/products/${id}`),
  getCategories: () => fetchJSON('/products/categories'),

  // Cart
  getCart: () => fetchJSON('/cart'),
  addToCart: (product_id, quantity = 1) => fetchJSON('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),
  updateCartItem: (id, quantity) => fetchJSON(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeCartItem: (id) => fetchJSON(`/cart/${id}`, { method: 'DELETE' }),

  // Orders
  placeOrder: (address) => fetchJSON('/orders', { method: 'POST', body: JSON.stringify(address) }),
  getOrder: (id) => fetchJSON(`/orders/${id}`),
};
