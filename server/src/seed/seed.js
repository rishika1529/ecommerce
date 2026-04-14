import 'dotenv/config';
import db from '../config/db.js';

// Skip seeding if products already exist
const existing = db.get('SELECT COUNT(*) as count FROM products');
if (existing && existing.count > 0) {
  console.log(`Database already has ${existing.count} products, skipping seed.`);
  process.exit(0);
}

// Clear existing data (safety)
await db.exec(`DELETE FROM order_items; DELETE FROM orders; DELETE FROM cart_items; DELETE FROM products; DELETE FROM categories; DELETE FROM users;`);

// Demo user
await db.run(`INSERT INTO users (id, name, email) VALUES (1, 'Demo User', 'demo@example.com')`);

// Categories
const cats = ['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports & Outdoors', 'Beauty'];
for (const c of cats) {
  await db.run(`INSERT INTO categories (name) VALUES (?)`, c);
}

const catRows = await db.all(`SELECT * FROM categories`);
const catIds = {};
catRows.forEach(c => catIds[c.name] = c.id);

// Products
const products = [
  // Electronics
  { name: 'Sony WH-1000XM5 Wireless Headphones', description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30 hours battery life with quick charging.', price: 348.00, stock: 45, category: 'Electronics', rating: 4.7, reviews: 12847,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'],
    specs: { Brand: 'Sony', Model: 'WH-1000XM5', Color: 'Black', Connectivity: 'Bluetooth 5.2', Battery: '30 hours', Weight: '250g' }},
  { name: 'Apple MacBook Air M2 15-inch', description: 'Supercharged by M2 chip. 15.3-inch Liquid Retina display. Up to 18 hours battery life. Fanless design for silent operation. 8GB unified memory with 256GB SSD.', price: 1299.00, stock: 20, category: 'Electronics', rating: 4.8, reviews: 8934,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop'],
    specs: { Brand: 'Apple', Chip: 'M2', Display: '15.3" Liquid Retina', RAM: '8GB', Storage: '256GB SSD', Battery: '18 hours' }},
  { name: 'Samsung Galaxy S24 Ultra', description: 'Galaxy AI is here. With a built-in S Pen, powerful camera, and titanium frame. 200MP camera system with advanced Nightography.', price: 1199.99, stock: 33, category: 'Electronics', rating: 4.6, reviews: 6721,
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'],
    specs: { Brand: 'Samsung', Model: 'Galaxy S24 Ultra', Display: '6.8" QHD+', Camera: '200MP', RAM: '12GB', Storage: '256GB' }},
  { name: 'JBL Charge 5 Portable Speaker', description: 'Powerful JBL Original Pro Sound with deep bass. IP67 waterproof and dustproof. 20 hours of playtime. Built-in powerbank.', price: 179.95, stock: 67, category: 'Electronics', rating: 4.7, reviews: 23456,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop'],
    specs: { Brand: 'JBL', Model: 'Charge 5', Waterproof: 'IP67', Battery: '20 hours', Weight: '960g' }},

  // Books
  { name: 'Atomic Habits by James Clear', description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny changes, remarkable results. #1 New York Times bestseller with over 15 million copies sold.', price: 11.98, stock: 200, category: 'Books', rating: 4.8, reviews: 98234,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop'],
    specs: { Author: 'James Clear', Pages: '320', Publisher: 'Avery', Format: 'Paperback', Language: 'English' }},
  { name: 'The Psychology of Money', description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. 19 short stories exploring the strange ways people think about money.', price: 14.99, stock: 150, category: 'Books', rating: 4.7, reviews: 45678,
    images: ['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=600&fit=crop'],
    specs: { Author: 'Morgan Housel', Pages: '256', Publisher: 'Harriman House', Format: 'Paperback', Language: 'English' }},
  { name: 'Dune by Frank Herbert', description: 'Set on the desert planet Arrakis, Dune is the story of Paul Atreides. A stunning blend of adventure and mysticism, environmentalism and politics.', price: 9.99, stock: 120, category: 'Books', rating: 4.6, reviews: 34567,
    images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&h=600&fit=crop'],
    specs: { Author: 'Frank Herbert', Pages: '688', Publisher: 'Ace', Format: 'Paperback', Language: 'English' }},

  // Clothing
  { name: 'Nike Dri-FIT Running Shirt', description: 'Sweat-wicking technology keeps you dry and comfortable. Lightweight mesh fabric for breathability. Standard fit for a relaxed feel.', price: 35.00, stock: 80, category: 'Clothing', rating: 4.5, reviews: 5678,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop'],
    specs: { Brand: 'Nike', Material: 'Polyester Dri-FIT', Fit: 'Standard', Care: 'Machine Wash' }},
  { name: "Levi's 501 Original Fit Jeans", description: 'The iconic straight fit with a button fly. Sits at the waist. 100% cotton for authentic denim feel. The jean that started it all.', price: 69.50, stock: 55, category: 'Clothing', rating: 4.4, reviews: 12345,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop'],
    specs: { Brand: "Levi's", Fit: '501 Original', Material: '100% Cotton', Rise: 'Regular', Closure: 'Button Fly' }},
  { name: 'North Face Puffer Jacket', description: 'Insulated with 700-fill goose down. Water-resistant DryVent shell. Packable design folds into internal pocket. Perfect for cold weather adventures.', price: 249.00, stock: 30, category: 'Clothing', rating: 4.7, reviews: 8901,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1544923246-77307dd270b5?w=600&h=600&fit=crop'],
    specs: { Brand: 'The North Face', Fill: '700-fill Goose Down', Shell: 'DryVent', Packable: 'Yes', Weight: '450g' }},

  // Home & Kitchen
  { name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker', description: '7 appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. 6-quart capacity feeds up to 6 people.', price: 89.95, stock: 42, category: 'Home & Kitchen', rating: 4.7, reviews: 67890,
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&h=600&fit=crop'],
    specs: { Brand: 'Instant Pot', Capacity: '6 Quart', Functions: '7-in-1', Material: 'Stainless Steel', Wattage: '1000W' }},
  { name: 'Dyson V15 Detect Cordless Vacuum', description: 'Laser reveals microscopic dust. Piezo sensor counts and sizes particles. Up to 60 minutes run time. HEPA whole-machine filtration.', price: 749.99, stock: 15, category: 'Home & Kitchen', rating: 4.6, reviews: 4567,
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1527515637462-cee1cc710d1d?w=600&h=600&fit=crop'],
    specs: { Brand: 'Dyson', Model: 'V15 Detect', Runtime: '60 min', Filtration: 'HEPA', Weight: '6.8 lbs' }},
  { name: 'Le Creuset Dutch Oven 5.5 Qt', description: 'Enameled cast iron for superior heat distribution. Colorful exterior enamel resists chipping and cracking. Ideal for slow-cooking, braising, and roasting.', price: 379.95, stock: 25, category: 'Home & Kitchen', rating: 4.8, reviews: 15678,
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&h=600&fit=crop'],
    specs: { Brand: 'Le Creuset', Material: 'Enameled Cast Iron', Capacity: '5.5 Qt', Oven_Safe: '500°F', Dishwasher_Safe: 'Yes' }},

  // Sports & Outdoors
  { name: 'Yeti Rambler 26oz Bottle', description: 'Double-wall vacuum insulation keeps drinks cold or hot. 18/8 stainless steel. Dishwasher safe. No-sweat design with TripleHaul cap.', price: 40.00, stock: 90, category: 'Sports & Outdoors', rating: 4.8, reviews: 23456,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=600&fit=crop'],
    specs: { Brand: 'YETI', Capacity: '26 oz', Material: '18/8 Stainless Steel', Insulation: 'Double-Wall Vacuum', BPA_Free: 'Yes' }},
  { name: 'Fitbit Charge 6 Fitness Tracker', description: 'Advanced health metrics including heart rate, SpO2, and stress management. Built-in GPS. 7-day battery life. Water resistant to 50m.', price: 159.95, stock: 38, category: 'Sports & Outdoors', rating: 4.3, reviews: 8765,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1510017803350-a3e40060a2a8?w=600&h=600&fit=crop'],
    specs: { Brand: 'Fitbit', Model: 'Charge 6', Battery: '7 days', Water_Resistant: '50m', GPS: 'Built-in' }},
  { name: 'Coleman Sundome 4-Person Tent', description: 'Easy setup in about 10 minutes. WeatherTec system with patented welded floors. Large windows and ground vent for airflow.', price: 79.99, stock: 22, category: 'Sports & Outdoors', rating: 4.5, reviews: 19876,
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=600&fit=crop'],
    specs: { Brand: 'Coleman', Capacity: '4-Person', Setup: '10 minutes', Floor: 'Welded', Seasons: '3-Season' }},

  // Beauty
  { name: 'CeraVe Moisturizing Cream', description: 'Developed with dermatologists. 3 essential ceramides and hyaluronic acid. Non-comedogenic, fragrance-free. 24-hour hydration for dry to very dry skin.', price: 16.08, stock: 130, category: 'Beauty', rating: 4.7, reviews: 87654,
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1570194065650-d99fb4a38b5f?w=600&h=600&fit=crop'],
    specs: { Brand: 'CeraVe', Size: '19 oz', Skin_Type: 'Dry to Very Dry', Key_Ingredients: 'Ceramides, Hyaluronic Acid', Fragrance: 'Free' }},
  { name: 'Revlon One-Step Hair Dryer & Volumizer', description: 'Unique oval brush design for smoothing hair. Ionic technology reduces frizz. 3 heat/speed settings. Lightweight and easy to use.', price: 34.98, stock: 48, category: 'Beauty', rating: 4.5, reviews: 34567,
    images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&h=600&fit=crop'],
    specs: { Brand: 'Revlon', Type: 'Hair Dryer & Volumizer', Technology: 'Ionic', Settings: '3 Heat/Speed', Cord: '6 ft' }},
  { name: 'Olaplex No.3 Hair Perfector', description: 'At-home bond building treatment. Reduces breakage and strengthens hair. Restores healthy appearance. For all hair types.', price: 28.00, stock: 60, category: 'Beauty', rating: 4.4, reviews: 45678,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop'],
    specs: { Brand: 'Olaplex', Product: 'No.3 Hair Perfector', Size: '3.3 fl oz', Hair_Type: 'All Types', Treatment: 'Bond Building' }},
];

for (const p of products) {
  await db.run(
    `INSERT INTO products (name, description, price, stock, category_id, images, specs, rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    p.name, p.description, p.price, p.stock, catIds[p.category], JSON.stringify(p.images), JSON.stringify(p.specs), p.rating, p.reviews
  );
}

console.log(`Seeded ${products.length} products across ${cats.length} categories.`);
process.exit(0);
