# BiteSize ERP

A mini ERP for a cloud kitchen — kitchen inventory tracking, an order desk, and a financial register, all connected in real time.

## Features

- **Kitchen Tracker** — view raw ingredient stock, restock with one click, automatic Low Stock badges
- **Order Desk** — incoming orders, create new orders (preset pizza menu or custom), Fulfill & Cook deducts ingredients and books revenue
- **Financial Register** — live revenue, cost, and profit KPIs plus a 5-day sales chart
- **Admin auth** — simple login / sign-up screen (in-memory accounts)

## Getting started

### Requirements

- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node.js)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

### Demo login

- Email: `admin@bitesize.com`
- Password: `admin123`

Or use the **Sign up** tab to create a new admin account (stored in memory only — it resets on page reload).

## Build for production

```bash
npm run build
npm run preview
```

The production build is output to the `dist/` folder.

## Project structure

```
bitesize-erp/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx     # app entry point
    ├── index.css    # Tailwind imports
    └── App.jsx      # the entire BiteSize ERP app
```

## Notes

- All data (inventory, orders, revenue, accounts) is held in React state only — nothing persists after a page reload. To add persistence, connect a backend or database of your choice.
- Built with React, Vite, Tailwind CSS, Recharts, and lucide-react icons.
