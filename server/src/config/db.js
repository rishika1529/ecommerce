import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const dbPath = process.env.DB_PATH || './data/ecommerce.db';
mkdirSync(dirname(dbPath), { recursive: true });

// Initialize sql.js (pure WASM — no native bindings!)
const SQL = await initSqlJs();

let database;
if (existsSync(dbPath)) {
  database = new SQL.Database(readFileSync(dbPath));
} else {
  database = new SQL.Database();
}

database.run('PRAGMA foreign_keys = ON');

// Persist database to disk
function save() {
  writeFileSync(dbPath, Buffer.from(database.export()));
}

// Wrapper that matches the async sqlite API used by our models
let _inTransaction = false;

const db = {
  all(sql, ...params) {
    const stmt = database.prepare(sql);
    if (params.length) stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  },

  get(sql, ...params) {
    const stmt = database.prepare(sql);
    if (params.length) stmt.bind(params);
    const row = stmt.step() ? stmt.getAsObject() : undefined;
    stmt.free();
    return row;
  },

  run(sql, ...params) {
    const upper = sql.trim().toUpperCase();

    // Handle transaction control statements
    if (upper.startsWith('BEGIN')) {
      database.run(sql);
      _inTransaction = true;
      return { lastID: 0, changes: 0 };
    }
    if (upper.startsWith('COMMIT')) {
      database.run(sql);
      _inTransaction = false;
      save();
      return { lastID: 0, changes: 0 };
    }
    if (upper.startsWith('ROLLBACK')) {
      database.run(sql);
      _inTransaction = false;
      return { lastID: 0, changes: 0 };
    }

    // Normal statement
    if (params.length) {
      database.run(sql, params);
    } else {
      database.run(sql);
    }
    const changes = database.getRowsModified();
    const [result] = database.exec('SELECT last_insert_rowid() as lastID');
    const lastID = result ? result.values[0][0] : 0;

    // Only save to disk outside of transactions
    if (!_inTransaction) {
      save();
    }

    return { lastID, changes };
  },

  exec(sql) {
    database.exec(sql);
    save();
  }
};

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    images TEXT DEFAULT '[]',
    specs TEXT DEFAULT '{}',
    rating REAL DEFAULT 4.0,
    review_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    total REAL NOT NULL,
    address_line TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    status TEXT DEFAULT 'placed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price REAL NOT NULL
  );
`);

export default db;
