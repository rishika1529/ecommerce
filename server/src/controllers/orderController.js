import * as orderModel from '../models/orderModel.js';
import { isPositiveInt, validateAddress, sanitizeBody } from '../middleware/validate.js';

export const placeOrder = (req, res) => {
  try {
    // Sanitize all string inputs
    const sanitized = sanitizeBody(req.body);

    // Validate address fields
    const errors = validateAddress(sanitized);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0].message, fieldErrors: errors });
    }

    const order = orderModel.createOrder(sanitized);

    // Return with user-friendly order ID format
    res.status(201).json({
      ...order,
      display_id: `SV-${String(order.id).padStart(6, '0')}`,
    });
  } catch (err) {
    // Differentiate stock errors from other errors
    if (err.message.includes('stock') || err.message.includes('Cart is empty')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
};

export const getOrder = (req, res) => {
  try {
    if (!isPositiveInt(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID. Must be a positive integer.' });
    }

    const order = orderModel.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Add user-friendly display ID
    res.json({
      ...order,
      display_id: `SV-${String(order.id).padStart(6, '0')}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
