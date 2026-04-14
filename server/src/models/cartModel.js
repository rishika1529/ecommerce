import db from '../config/db.js';

const USER_ID = 1; // Demo user

export const getCart = async () => {
  const rows = await db.all(`
    SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.images, p.stock
    FROM cart_items ci JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `, USER_ID);
  return rows.map(r => ({ ...r, images: JSON.parse(r.images) }));
};

export const addItem = async (productId, quantity = 1) => {
  const existing = await db.get(`SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?`, USER_ID, productId);
  if (existing) {
    await db.run(`UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`, quantity, existing.id);
    return { ...existing, quantity: existing.quantity + quantity };
  }
  const result = await db.run(`INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`, USER_ID, productId, quantity);
  return { id: result.lastID, product_id: productId, quantity };
};

export const updateQuantity = async (id, quantity) => {
  await db.run(`UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?`, quantity, id, USER_ID);
  return { id, quantity };
};

export const removeItem = async (id) => {
  await db.run(`DELETE FROM cart_items WHERE id = ? AND user_id = ?`, id, USER_ID);
};

export const clearCart = async () => {
  await db.run(`DELETE FROM cart_items WHERE user_id = ?`, USER_ID);
};

export const getCartCount = async () => {
  const row = await db.get(`SELECT COALESCE(SUM(quantity), 0) as count FROM cart_items WHERE user_id = ?`, USER_ID);
  return row.count;
};

// Get a specific cart item by its cart_items ID
export const getItemById = async (id) => {
  return db.get(`SELECT * FROM cart_items WHERE id = ? AND user_id = ?`, id, USER_ID);
};

// Get cart item by product_id (for stock checking before add)
export const getItemByProductId = async (productId) => {
  return db.get(`SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?`, USER_ID, productId);
};
