import db from '../config/db.js';

export const getAll = (search, categoryId) => {
  let sql = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
  const params = [];

  if (search) {
    sql += ` AND p.name LIKE ?`;
    params.push(`%${search}%`);
  }
  if (categoryId) {
    sql += ` AND p.category_id = ?`;
    params.push(categoryId);
  }
  sql += ` ORDER BY p.created_at DESC`;

  const rows = db.prepare(sql).all(...params);
  return rows.map(r => ({ ...r, images: JSON.parse(r.images), specs: JSON.parse(r.specs) }));
};

export const getById = (id) => {
  const row = db.prepare(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`).get(id);
  if (!row) return null;
  return { ...row, images: JSON.parse(row.images), specs: JSON.parse(row.specs) };
};

export const getCategories = () => {
  return db.prepare(`SELECT * FROM categories ORDER BY name`).all();
};
