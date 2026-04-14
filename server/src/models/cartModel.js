import db from '../config/db.js';

const USER_ID = 1; // Demo user

export const getCart = () => {
  const rows = db.prepare(`
    SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.images, p.stock
    FROM cart_items ci JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `).all(USER_ID);
  return rows.map(r => ({ ...r, images: JSON.parse(r.images) }));
};

export const addItem = (productId, quantity = 1) => {
  const existing = db.prepare(`SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?`).get(USER_ID, productId);
  if (existing) {
    db.prepare(`UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`).run(quantity, existing.id);
    return { ...existing, quantity: existing.quantity + quantity };
  }
  const result = db.prepare(`INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`).run(USER_ID, productId, quantity);
  return { id: result.lastInsertRowid, product_id: productId, quantity };
};

export const updateQuantity = (id, quantity) => {
  db.prepare(`UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?`).run(quantity, id, USER_ID);
  return { id, quantity };
};

export const removeItem = (id) => {
  db.prepare(`DELETE FROM cart_items WHERE id = ? AND user_id = ?`).run(id, USER_ID);
};

export const clearCart = () => {
  db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(USER_ID);
};

export const getCartCount = () => {
  const row = db.prepare(`SELECT COALESCE(SUM(quantity), 0) as count FROM cart_items WHERE user_id = ?`).get(USER_ID);
  return row.count;
};

// Get a specific cart item by its cart_items ID
export const getItemById = (id) => {
  return db.prepare(`SELECT * FROM cart_items WHERE id = ? AND user_id = ?`).get(id, USER_ID);
};

// Get cart item by product_id (for stock checking before add)
export const getItemByProductId = (productId) => {
  return db.prepare(`SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?`).get(USER_ID, productId);
};
