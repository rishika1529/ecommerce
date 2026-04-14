# ShopVerse — E-Commerce Demo

A full-stack Amazon-style e-commerce application built with **React (Vite)** + **Express** + **SQLite**.

> **Demo app** — No real payments. Uses a hardcoded demo user (user ID 1) for cart/orders.

---

## 🚀 Tech Stack

| Layer     | Technology                                  |
| --------- | ------------------------------------------- |
| Frontend  | React 19, Vite 8, React Router 7, Lucide   |
| Backend   | Node.js, Express 4, Helmet, express-validator |
| Database  | SQLite (via better-sqlite3)                 |
| Styling   | Vanilla CSS (custom design system)          |

---

## 📁 Project Structure

```
ecommerce-demo/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── api/api.js         # API client with timeout & error handling
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Header.jsx     # Amazon-style nav with mobile drawer
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── ImageCarousel.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── Toast.css
│   │   ├── context/
│   │   │   ├── CartContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   └── ConfirmationPage.jsx
│   │   ├── index.css          # Global styles & design tokens
│   │   └── App.jsx
│   ├── .env                   # Client environment variables
│   ├── vercel.json            # Vercel deployment config
│   └── vite.config.js
├── server/                    # Express backend
│   ├── src/
│   │   ├── app.js             # Entry point with security middleware
│   │   ├── config/db.js       # SQLite setup & schema
│   │   ├── controllers/       # Route handlers with validation
│   │   ├── middleware/         # Shared validation helpers
│   │   ├── models/            # Database queries
│   │   ├── routes/            # Express routers
│   │   └── seed/seed.js       # Sample data seeder
│   ├── .env                   # Server environment variables
│   └── render.yaml            # Render deployment blueprint
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### 1. Clone & install

```bash
git clone <repo-url>
cd ecommerce-demo

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment

```bash
# Server — copy and edit .env
cd server
cp .env.example .env

# Client — copy and edit .env
cd ../client
cp .env.example .env
```

### 3. Seed the database

```bash
cd server
npm run seed
```

### 4. Run the app

**Terminal 1 — Server:**
```bash
cd server
npm run dev      # starts on port 5000 with auto-reload
```

**Terminal 2 — Client:**
```bash
cd client
npm run dev      # starts on port 3000
```

Open **http://localhost:3000** in your browser.

---

## 🔧 Environment Variables

### Server (`server/.env`)

| Variable      | Default                    | Description                       |
| ------------- | -------------------------- | --------------------------------- |
| `PORT`        | `5000`                     | Server port                       |
| `DB_PATH`     | `./data/ecommerce.db`      | SQLite database file path         |
| `NODE_ENV`    | `development`              | `development` or `production`     |
| `CORS_ORIGIN` | `http://localhost:3000`    | Allowed CORS origin               |

### Client (`client/.env`)

| Variable         | Default  | Description                                    |
| ---------------- | -------- | ---------------------------------------------- |
| `VITE_API_BASE`  | `/api`   | API base URL (`/api` for proxy, full URL for production) |

---

## 📋 API Endpoints

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| GET    | `/api/health`          | Health check          |
| GET    | `/api/products`        | List products (query: `search`, `category`) |
| GET    | `/api/products/:id`    | Get product by ID     |
| GET    | `/api/products/categories` | List categories   |
| GET    | `/api/cart`            | Get cart items        |
| POST   | `/api/cart`            | Add item to cart      |
| PUT    | `/api/cart/:id`        | Update cart item qty  |
| DELETE | `/api/cart/:id`        | Remove cart item      |
| POST   | `/api/orders`          | Place order           |
| GET    | `/api/orders/:id`      | Get order by ID       |

---

## 🛡️ Security & Validation

- **Helmet** — sets security HTTP headers
- **CORS** — restricted to configured origin in production
- **Body limit** — 10KB max request body
- **Input sanitization** — HTML tags stripped from all string inputs
- **ID validation** — all ID params validated as positive integers
- **Stock validation** — stock checked before add-to-cart and before order placement
- **Address validation** — all fields validated for format and length
- **Atomic stock deduction** — race-condition-safe stock updates in SQLite

---

## 🎨 Features

- **Product Catalog** — search, filter by category, product detail pages
- **Shopping Cart** — add/update/remove items with stock validation
- **Checkout** — form validation, order summary, mock payment
- **Order Confirmation** — user-friendly order ID (`SV-000001`), delivery timeline
- **Toast Notifications** — success/error/info messages
- **Loading States** — skeleton screens on all pages
- **Disabled Buttons** — prevent double-clicks during async operations
- **Empty States** — friendly messages when cart/products are empty
- **Fallback Images** — graceful handling of broken image URLs
- **Responsive Design** — mobile drawer nav, tablet/phone layouts
- **Error Handling** — proper HTTP status codes, descriptive error messages

---

## 🚢 Deployment

### Client → Vercel

1. Push your code to GitHub
2. Import the `client/` directory in [Vercel](https://vercel.com)
3. Set environment variable: `VITE_API_BASE=https://your-api.onrender.com/api`
4. Deploy — `vercel.json` handles SPA routing

### Server → Render

1. Push your code to GitHub
2. Import the `server/` directory in [Render](https://render.com)
3. Set environment variables (see table above)
4. Set build command: `npm install`
5. Set start command: `npm start`

> ⚠️ **Note:** SQLite data is ephemeral on Render's free tier. For persistent data, use Render's persistent disk or switch to PostgreSQL.

---

## ⚠️ Assumptions & Limitations

1. **No authentication** — uses a hardcoded demo user (ID: 1)
2. **No real payments** — payment section is a mock UI
3. **SQLite** — single-file database, not suitable for high-concurrency production use
4. **Demo data** — product images use Unsplash URLs (may occasionally be unavailable)
5. **Single session** — all browser tabs share the same cart (server-side cart)
6. **No pagination** — all products loaded at once (fine for ~20 items)

---

## 📜 Available Scripts

### Server

| Script       | Command              | Description           |
| ------------ | -------------------- | --------------------- |
| `npm start`  | `node src/app.js`    | Start production server |
| `npm run dev`| `node --watch src/app.js` | Start with auto-reload |
| `npm run seed` | `node src/seed/seed.js` | Seed demo data      |

### Client

| Script         | Command         | Description          |
| -------------- | --------------- | -------------------- |
| `npm run dev`  | `vite`          | Start dev server     |
| `npm run build`| `vite build`    | Production build     |
| `npm run preview` | `vite preview` | Preview production build |

---

## 📝 License

This is a demo/educational project. Use freely.
