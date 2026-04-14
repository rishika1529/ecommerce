import * as cartModel from '../models/cartModel.js';
import * as productModel from '../models/productModel.js';
import { isPositiveInt } from '../middleware/validate.js';

export const getCart = (req, res) => {
  try {
    const items = cartModel.getCart();
    const count = cartModel.getCartCount();
    res.json({ items, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Validate product_id
    if (!product_id || !isPositiveInt(product_id)) {
      return res.status(400).json({ error: 'Invalid product ID. Must be a positive integer.' });
    }

    // Validate quantity
    const qty = quantity || 1;
    if (!isPositiveInt(qty) || qty > 99) {
      return res.status(400).json({ error: 'Quantity must be between 1 and 99.' });
    }

    // Check product exists
    const product = productModel.getById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Check stock availability
    const existingItem = cartModel.getItemByProductId(product_id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const totalRequested = currentQtyInCart + qty;

    if (totalRequested > product.stock) {
      return res.status(409).json({
        error: `Insufficient stock. Only ${product.stock} available (${currentQtyInCart} already in cart).`,
        available: product.stock,
        inCart: currentQtyInCart,
      });
    }

    const item = cartModel.addItem(product_id, qty);
    const count = cartModel.getCartCount();
    res.status(201).json({ item, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCartItem = (req, res) => {
  try {
    if (!isPositiveInt(req.params.id)) {
      return res.status(400).json({ error: 'Invalid cart item ID.' });
    }

    const { quantity } = req.body;
    if (!quantity || !isPositiveInt(quantity) || quantity > 99) {
      return res.status(400).json({ error: 'Quantity must be between 1 and 99.' });
    }

    // Check stock for the update
    const cartItem = cartModel.getItemById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    const product = productModel.getById(cartItem.product_id);
    if (product && quantity > product.stock) {
      return res.status(409).json({
        error: `Insufficient stock. Only ${product.stock} available.`,
        available: product.stock,
      });
    }

    const item = cartModel.updateQuantity(req.params.id, quantity);
    const count = cartModel.getCartCount();
    res.json({ item, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeCartItem = (req, res) => {
  try {
    if (!isPositiveInt(req.params.id)) {
      return res.status(400).json({ error: 'Invalid cart item ID.' });
    }

    cartModel.removeItem(req.params.id);
    const count = cartModel.getCartCount();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
