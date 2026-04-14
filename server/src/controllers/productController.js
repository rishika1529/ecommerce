import * as productModel from '../models/productModel.js';
import { isPositiveInt, sanitizeString } from '../middleware/validate.js';

export const getProducts = (req, res) => {
  try {
    const search = req.query.search ? sanitizeString(req.query.search) : undefined;
    const category = req.query.category;

    if (category && !isPositiveInt(category)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const products = productModel.getAll(search, category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProduct = (req, res) => {
  try {
    if (!isPositiveInt(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID. Must be a positive integer.' });
    }

    const product = productModel.getById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategories = (req, res) => {
  try {
    res.json(productModel.getCategories());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
