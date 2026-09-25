# NexGensis — Product Admin Dashboard

A modern, responsive, and robust **Product Management Admin Dashboard** built with **Next.js (App Router)**, **React 19**, **Tailwind CSS**, and **Axios**, powered by the **DummyJSON API**.

Designed for high usability, clean typography, intuitive user interactions, and robust state management via URL search parameters.

---

## 🚀 Live Demo & Repository
- **Local Dev Server:** `http://localhost:3000`
- **Default Test Credentials:**
  - **Username:** `emilys`
  - **Password:** `emilyspass`

---

## 🛠️ Tech Stack & Dependencies

- **Framework:** Next.js (App Router, TypeScript)
- **Library:** React 19
- **Styling:** Tailwind CSS (Modern light theme with soft blue glow accents and crisp card borders)
- **HTTP Client:** Axios (Single shared client with request & response interceptors)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Source:** [DummyJSON API](https://dummyjson.com/docs)
- **Zero Heavy Abstractions:** Built with zero bulky state libraries (no Redux, Zustand, React Query, or SWR) and 100% custom table, modal, and pagination components.

---

## 📋 Features Completed

### 1. Authentication & Route Security
- **Login Page (`/login`):**
  - Authenticates against DummyJSON `POST /auth/login`.
  - Convenient "Fill Demo" helper for instant testing (`emilys` / `emilyspass`).
  - Validation with error messaging for incorrect credentials.
  - Double-click / rapid submission prevention via loading and disabled states.
- **Session Management:**
  - Auth token and user profile securely persisted in `localStorage`.
  - Automatic `Authorization: Bearer <token>` injection on all outbound requests via Axios request interceptor.
  - Centralized 401 response handling with automatic session invalidation and redirect.
  - Protected route guard (`ProtectedRoute`) redirecting unauthenticated users to `/login` and authenticated users away from `/login`.
  - Sign-out button in header and sidebar.

### 2. Product Catalog & Responsive Views
- **Desktop View:**
  - Clean table displaying thumbnail image, title, brand/SKU, category badge, formatted USD price with discount percentage, star rating with review count, and inventory status badge (In Stock / Low Stock / Out of Stock).
  - Row quick action buttons: View Details, Edit Product, Delete Product.
- **Mobile View:**
  - Responsive card grid layout (`ProductCardGrid`) optimized for small viewports.
  - Zero horizontal overflow.
  - Responsive collapsible sidebar drawer with hamburger menu.

### 3. Real-Time Search & Race Condition Prevention
- Debounced search (400ms delay) to prevent spamming requests on every keystroke.
- Input updates instantaneously for a smooth typing experience.
- Automatic reset to Page 1 upon searching.
- **Stale Request / Race Condition Guard:** In-flight network requests are automatically cancelled using `AbortController` when search terms change, combined with request sequence tracking so delayed requests (`&delay=2000`) never overwrite newer results.

### 4. Category Filtering & DummyJSON Handling
- Dynamic category list loaded from `GET /products/categories`.
- Filter dropdown to isolate products by category.
- **Architectural Decision (DummyJSON Limitation):** DummyJSON does not support combining search keywords (`/products/search?q=...`) and category endpoints (`/products/category/...`) in a single server call. As a clean, user-friendly decision:
  - When an active search query is entered, search takes priority and searches the full catalog.
  - A helpful badge explains that search is active across all categories.
  - Category filter is re-enabled when the search input is cleared.

### 5. Sorting
- Server-side sorting by `price`, `rating`, or `title`.
- Order toggle button for Ascending (`asc ↑`) and Descending (`desc ↓`).

### 6. Full URL State Preservation
- All filter parameters (`page`, `limit`, `search`, `category`, `sortBy`, `order`) are synchronized with URL search parameters.
- Refreshing or sharing URLs preserves the exact dashboard state.
- **Defensive Parameter Sanitization:** Safe fallbacks for malformed or out-of-range parameters (`?page=abc`, `?page=999`, invalid limit) without crashing.

### 7. Pagination
- Powered by DummyJSON `limit` and `skip`.
- Page number windowing with ellipsis (`1, 2, 3 ... 10`).
- Previous / Next buttons with boundary disabling.
- Page size selector (`10`, `20`, `50` per page).
- Descriptive range indicator: `"Showing 1–10 of 194 products"`.

### 8. Product Details (`/products/[id]`)
- Dynamic route fetching individual product data from `GET /products/:id`.
- Multi-image gallery with large preview and clickable thumbnail selector.
- Detailed specifications, warranty, shipping, and return policy badges.
- Customer reviews section with star ratings, reviewer names, dates, and comments.
- Defensive 404 Not Found state for non-existent or invalid product IDs with a return button.

### 9. CRUD Operations & Mutation Layer
- **Add Product:** Modal form with validation for title, category, price, discount, stock quantity, brand, and description. Calls `POST /products/add`.
- **Edit Product:** Modal pre-populated with existing product information. Calls `PUT /products/:id`.
- **Delete Product:** Safe confirmation modal dialog preventing accidental deletion. Calls `DELETE /products/:id`.
- **Frontend Mutation Layer:** Since DummyJSON is a mock API and does not permanently persist mutations to a database, the application maintains a local mutation overlay cache so created, modified, and deleted products reflect immediately in the UI and pagination counts.
- **Toast Notifications:** Feedback alerts upon successful creation, update, or deletion.

### 10. States & Error Handling
- Shimmer skeleton loaders for tables and mobile cards.
- Empty state with reset filters button when zero results match.
- API error state with a dedicated **Retry Request** button.
- Global 404 page for unmatched routes.

---

## 📁 Project Architecture & Directory Structure

```
nexgensis-product-admin-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with AuthProvider & ToastProvider
│   │   ├── globals.css               # Modern light theme tokens & soft glow utilities
│   │   ├── page.tsx                  # Root redirect (to /products or /login)
│   │   ├── not-found.tsx             # 404 Not Found page
│   │   ├── login/
│   │   │   └── page.tsx              # Authentication page with demo credentials helper
│   │   └── products/
│   │       ├── page.tsx              # Product catalog list, filters, table/card views
│   │       └── [id]/
│   │           └── page.tsx          # Dynamic product detail page with reviews & gallery
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx    # Client-side authentication route guard
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx   # Responsive layout with mobile drawer
│   │   │   ├── Sidebar.tsx           # Sidebar navigation & user sign-out
│   │   │   └── Header.tsx            # Header bar with user profile & mobile toggle
│   │   ├── products/
│   │   │   ├── ProductFilters.tsx    # Debounced search, category dropdown, sort controls
│   │   │   ├── ProductTable.tsx      # Desktop data table view
│   │   │   ├── ProductCardGrid.tsx   # Mobile responsive card grid view
│   │   │   ├── Pagination.tsx        # Limit/skip pagination with page numbers
│   │   │   ├── ProductFormModal.tsx  # Add & Edit modal with validation
│   │   │   ├── DeleteConfirmModal.tsx# Deletion confirmation dialog
│   │   │   └── ProductDetailView.tsx # Image gallery, specs, and reviews
│   │   └── ui/
│   │       ├── Button.tsx            # Reusable button with variants & loading state
│   │       ├── Input.tsx             # Input with icons & error labels
│   │       ├── Select.tsx            # Dropdown select component
│   │       ├── Modal.tsx             # Accessible dialog modal
│   │       ├── Badge.tsx             # Status and category badges
│   │       ├── Skeleton.tsx          # Shimmer skeletons for table/cards
│   │       ├── EmptyState.tsx        # Empty search/filter illustration & reset
│   │       └── ErrorState.tsx        # Error alert with Retry button
│   ├── context/
│   │   ├── AuthContext.tsx           # Auth state, login/logout, localStorage persistence
│   │   └── ToastContext.tsx          # Toast feedback notifications
│   ├── hooks/
│   │   ├── useDebounce.ts            # Input debounce hook
│   │   └── useProductUrlParams.ts    # URL query parameter synchronization & sanitization
│   ├── lib/
│   │   ├── axios.ts                  # Shared Axios client with interceptors
│   │   └── utils.ts                  # Currency, date formatting & sanitization helpers
│   ├── services/
│   │   ├── auth.service.ts           # Login & profile API methods
│   │   └── product.service.ts        # Product CRUD & category API methods
│   └── types/
│       ├── auth.types.ts             # Auth & User TypeScript interfaces
│       └── product.types.ts          # Product, Review, Filter & Category interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## ⚙️ Setup & Installation Instructions

### Prerequisites
- Node.js `v18.0.0` or higher (Tested on Node `v24.14.1`)
- npm `v9.0.0` or higher

### Steps
1. Clone or extract the repository files:
   ```bash
   cd nexgensis-product-admin-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. Log in using the test credentials:
   - **Username:** `emilys`
   - **Password:** `emilyspass`

### Production Build & Linting
- To test the production build:
  ```bash
  npm run build
  npm start
  ```
- To run code quality checks:
  ```bash
  npm run lint
  ```

---

## 🔑 Environment Variables
No external API keys or secret environment variables are required. The application interfaces directly with public DummyJSON endpoints (`https://dummyjson.com`).

---

## 💡 Technical Challenge & Solution

### Problem: Stale Responses & Race Conditions During Search
When users type rapidly into a search bar, multiple asynchronous requests are initiated. If an earlier request is artificially delayed by network jitter or server latency (e.g. `?delay=2000`) and resolves *after* a newer, shorter request has already finished, it would overwrite the newer results with outdated data.

### Solution:
We implemented a two-tier defense mechanism in `product.service.ts` and `ProductsPage`:
1. **Network-level Cancellation (`AbortController`):** Whenever the user updates search query, category, or page, the previous active `AbortController` cancels the in-flight Axios request before firing a new one.
2. **Execution Sequence Guard (`requestSequenceRef`):** A monotonically increasing sequence ID increments on every request. Even if an aborted or delayed promise resolves, only the response matching `requestSequenceRef.current` is allowed to commit to React state.

---

## 🤖 How AI Tools Were Used
AI coding assistance was utilized during this assignment to:
- Rapidly bootstrap project boilerplate and TypeScript interface models matching DummyJSON's schema.
- Brainstorm cohesive color palettes and modern light admin dashboard aesthetics (soft blue gradient glow, rounded cards, clean spacing).
- Structure clean separation of concerns between UI components, custom hooks, and the shared Axios service layer.
- Ensure strict compliance with all assignment constraints (no heavy external state managers, zero-dependency custom pagination and modals).
