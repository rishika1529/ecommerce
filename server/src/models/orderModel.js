import db from '../config/db.js';
import * as cartModel from './cartModel.js';

const USER_ID = 1;

export const createOrder = async (address) => {
  const cartItems = await cartModel.getCart();
  if (cartItems.length === 0) throw new Error('Cart is empty. Please add items before placing an order.');

  // Validate stock for all items before placing order
  const stockErrors = [];
  for (const item of cartItems) {
    const product = await db.get(`SELECT id, name, stock FROM products WHERE id = ?`, item.product_id);
    if (!product) {
      stockErrors.push(`Product "${item.name}" is no longer available.`);
    } else if (product.stock < item.quantity) {
      stockErrors.push(`"${product.name}" only has ${product.stock} in stock (you requested ${item.quantity}).`);
    }
  }

  if (stockErrors.length > 0) {
    throw new Error(`Insufficient stock: ${stockErrors.join(' ')}`);
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Use manual transaction since sqlite wrapper doesn't have transaction() helper
  await db.run('BEGIN TRANSACTION');
  try {
    const orderResult = await db.run(
      `INSERT INTO orders (user_id, total, address_line, city, state, zip) VALUES (?, ?, ?, ?, ?, ?)`,
      USER_ID, total, address.address_line, address.city, address.state, address.zip
    );
    const orderId = orderResult.lastID;

    for (const item of cartItems) {
      await db.run(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        orderId, item.product_id, item.quantity, item.price
      );

      // Atomic stock deduction with check (stock >= quantity)
      const updateResult = await db.run(
        `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
        item.quantity, item.product_id, item.quantity
      );
      if (updateResult.changes === 0) {
        throw new Error(`Failed to reserve stock for "${item.name}". It may have been purchased by another user.`);
      }
    }

    await cartModel.clearCart();
    await db.run('COMMIT');
    return getOrderById(orderId);
  } catch (err) {
    await db.run('ROLLBACK');
    throw err;
  }
};

export const getOrderById = async (id) => {
  const order = await db.get(`SELECT * FROM orders WHERE id = ? AND user_id = ?`, id, USER_ID);
  if (!order) return null;
  const items = await db.all(`
    SELECT oi.*, p.name, p.images FROM order_items oi
    JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?
  `, id);
  return { ...order, items: items.map(i => ({ ...i, images: JSON.parse(i.images) })) };
};
