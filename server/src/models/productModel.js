import db from '../config/db.js';

export const getAll = async (search, categoryId) => {
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

  const rows = await db.all(sql, ...params);
  return rows.map(r => ({ ...r, images: JSON.parse(r.images), specs: JSON.parse(r.specs) }));
};

export const getById = async (id) => {
  const row = await db.get(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`, id);
  if (!row) return null;
  return { ...row, images: JSON.parse(row.images), specs: JSON.parse(row.specs) };
};

export const getCategories = async () => {
  return db.all(`SELECT * FROM categories ORDER BY name`);
};
