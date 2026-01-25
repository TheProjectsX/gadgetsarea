# Gadgets Area

[Gadgets Area Frontend](https://gadgetsarea.vercel.app/) | [Dashboard](https://gadgetsarea-dashboard.vercel.app/) | [Backend](https://gadgetsarea-server.vercel.app/)

**Admin Credentials**

- Email: `admin@example.com`
- Password: `123456`

---

## Project Overview

**Gadgets Area** is a full-featured e-commerce platform focused on gadgets. Users can browse products by categories, filter by brand, price, and availability, manage their cart, place orders, and track or cancel them.

The **Admin Dashboard** allows management of categories, products, orders, and users. Admins can CRUD products and categories, update product statuses and tags, manage orders, and edit user profiles.

Key features:

- Multi-category product listing
- Brand, price, and availability filters
- Cart management (add/remove items)
- Order tracking and cancellation
- Stripe payment integration
- Role-based authentication (users/admin)
- Email & password authentication with JWT and cookie-based authorization

---

## Tech Stack

**Backend:**

- Node.js with Express
- TypeScript
- MongoDB with Prisma ORM
- JWT & Cookie-based authentication

**Frontend (Client):**

- Next.js
- TypeScript
- Redux & RTK Query
- Tailwind CSS

**Admin Dashboard:**

- React.js
- Redux & RTK Query
- Tailwind CSS

---

## Features

### User

- Browse products by categories
- Filter products by brand, price, availability
- Add/remove items from cart
- View orders and order details
- Cancel orders
- Secure authentication

### Admin

- CRUD operations for categories and products
- Update product status and tags
- View and manage all orders
- Change order statuses
- Manage users and profiles

---

## Live Demo

- **Frontend:** [https://gadgetsarea.vercel.app/](https://gadgetsarea.vercel.app/)
- **Dashboard:** [https://gadgetsarea-dashboard.vercel.app/](https://gadgetsarea-dashboard.vercel.app/)
- **Backend API:** [https://gadgetsarea-server.vercel.app/](https://gadgetsarea-server.vercel.app/)

---

## Installation

1. Clone the repo:

```bash
git clone <repo-url>
```

2. Install dependencies for backend, client, and dashboard:

```bash
# Backend
cd server-side
npm install

# FClient
cd client-side
npm install

# Dashboard
cd dashboard
npm install
```

3. Set up `.env` variables for MongoDB, JWT secret, Stripe keys, etc.

4. Run projects locally:

```bash
# Backend
npm run dev

# Client
npm run dev

# Dashboard
npm run dev
```

## License

MIT License © 2026

---

**Gadgets Area** — A modern, full-stack e-commerce solution for gadgets enthusiasts.
