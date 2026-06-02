# Implementation Plan & Progress

> **Last Updated:** May 17, 2026
> **Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Neon PostgreSQL, Cloudinary, NextAuth v5, Resend

---

## Phase 1: Database Foundation ✅

| Step | Task | Status | Files |
|------|------|--------|-------|
| 1.1 | Install `@neondatabase/serverless` | ✅ Done | `package.json` |
| 1.2 | Create `lib/db.ts` with connection | ✅ Done | `lib/db.ts` |
| 1.3 | Write raw SQL migration (6 tables, 11 indexes) | ✅ Done | `db/migrations/001_initial.sql` |
| 1.4 | Create `db/migrate.ts` migration runner | ✅ Done | `db/migrate.ts` |
| 1.5 | Update `.env` with `DATABASE_URL` | ✅ Done | `.env`, `.env.example` |
| 1.6 | Add `db:migrate` script to `package.json` | ✅ Done | `package.json` |

**Schema Tables:** `users`, `products`, `product_images`, `product_variants`, `orders`, `order_items`, `migrations`

**Run migrations:** `npm run db:migrate`

---

## Phase 2: Product API Layer ✅

| Step | Task | Status | Files |
|------|------|--------|-------|
| 2.1 | `GET /api/products` — filter, sort, pagination (24/page) | ✅ Done | `app/api/products/route.ts` |
| 2.2 | `GET /api/products/[id]` — single product + images + variants | ✅ Done | `app/api/products/[id]/route.ts` |
| 2.3 | `GET /api/search` — full-text search | ✅ Done | `app/api/search/route.ts` |
| 2.4 | Update `app/page.tsx` to query DB | ✅ Done | `app/page.tsx` |
| 2.5 | Update `app/products/page.tsx` to query DB | ✅ Done | `app/products/page.tsx` |
| 2.6 | Update `app/products/[category]/page.tsx` to query DB | ✅ Done | `app/products/[category]/page.tsx` |
| 2.7 | Update `app/product/[id]/page.tsx` to query DB | ✅ Done | `app/product/[id]/page.tsx`, `ProductDetailClient.tsx` |
| 2.8 | Update `app/search/page.tsx` to query DB | ✅ Done | `app/search/page.tsx` |
| 2.9 | Create `lib/format.ts` for consistent response formatting | ✅ Done | `lib/format.ts` |
| 2.10 | Update `lib/data.ts` with new types (`Product`, `ProductImage`, `ProductVariant`) | ✅ Done | `lib/data.ts` |
| 2.11 | Add `formatPrice()` to `lib/utils.ts` (hides decimals when whole number) | ✅ Done | `lib/utils.ts` |

**Filters supported:** category, new arrivals, price range (min/max), size
**Sort options:** newest, price low-to-high, price high-to-low

---

## Phase 3: Cloudinary Integration ✅

| Step | Task | Status | Files |
|------|------|--------|-------|
| 3.1 | Install `cloudinary` SDK | ✅ Done | `package.json` |
| 3.2 | Create `lib/cloudinary.ts` with config | ✅ Done | `lib/cloudinary.ts` |
| 3.3 | `POST /api/upload` — image upload (max 5MB, jpg/png/webp) | ✅ Done | `app/api/upload/route.ts` |
| 3.4 | `DELETE /api/upload` — delete by `publicId` | ✅ Done | `app/api/upload/route.ts` |
| 3.5 | Update `.env` with Cloudinary vars | ✅ Done | `.env` |
| 3.6 | Auto-optimize URLs with `f_auto,q_auto,w_800` | ✅ Done | `lib/cloudinary.ts`, `lib/format.ts` |
| 3.7 | Images organized in `menace/products/` folder | ✅ Done | `lib/cloudinary.ts` |

**Env vars:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (also supports `CLOUDINARY_URL`)

---

## Phase 4: Authentication ✅

| Step | Task | Status | Files |
|------|------|--------|-------|
| 4.1 | Install `next-auth@beta`, `bcryptjs` | ✅ Done | `package.json` |
| 4.2 | `lib/auth.ts` — NextAuth config (Credentials, JWT, role) | ✅ Done | `lib/auth.ts` |
| 4.3 | `app/api/auth/[...nextauth]/route.ts` — Auth handlers | ✅ Done | `app/api/auth/[...nextauth]/route.ts` |
| 4.4 | `POST /api/auth/register` — user registration | ✅ Done | `app/api/auth/register/route.ts` |
| 4.5 | `app/(auth)/login/page.tsx` — login form | ✅ Done | `app/(auth)/login/page.tsx` |
| 4.6 | `app/(auth)/register/page.tsx` — registration form | ✅ Done | `app/(auth)/register/page.tsx` |
| 4.7 | `middleware.ts` — protect `/admin` routes | ✅ Done | `middleware.ts` |
| 4.8 | Update `Navbar` with login/logout state | ✅ Done | `components/Navbar.tsx` |
| 4.9 | Wrap layout with `SessionProvider` | ✅ Done | `app/layout.tsx` |
| 4.10 | Guest order tracking (`/order/track`) | ✅ Done | `app/order/track/page.tsx`, `app/api/orders/track/route.ts` |

**Auth details:**
- Email/password login with bcrypt hashing
- JWT sessions (30-day expiry, HTTP-only cookie)
- Role-based access (`customer`, `admin`)
- Guest checkout allowed; order tracking via email + order number
- First admin created via manual DB insertion

**Env var:** `AUTH_SECRET`

---

## Phase 5: Admin Panel ✅

| Step | Task | Status | Files |
|------|------|--------|-------|
| 5.1 | Admin layout + dashboard (stats, recent orders) | ✅ Done | `app/admin/layout.tsx`, `app/admin/page.tsx` |
| 5.2 | Product list table | ✅ Done | `app/admin/products/page.tsx` |
| 5.3 | Product create page with image upload | ✅ Done | `app/admin/products/new/page.tsx` |
| 5.4 | Product edit page with image upload, variants, delete | ✅ Done | `app/admin/products/[id]/page.tsx` |
| 5.5 | Order management list with status badges | ✅ Done | `app/admin/orders/page.tsx` |
| 5.6 | Order detail page with status update buttons | ✅ Done | `app/admin/orders/[id]/page.tsx` |
| 5.7 | `POST /api/admin/products` — create product | ✅ Done | `app/api/admin/products/route.ts` |
| 5.8 | `GET/PUT/DELETE /api/admin/products/[id]` — CRUD | ✅ Done | `app/api/admin/products/[id]/route.ts` |
| 5.9 | `PATCH /api/admin/orders` — update order status | ✅ Done | `app/api/admin/orders/route.ts` |
| 5.10 | `GET /api/admin/orders/[id]` — order detail | ✅ Done | `app/api/admin/orders/[id]/route.ts` |

**Features:**
- Sidebar navigation (Dashboard, Products, Orders)
- Dashboard: total revenue, order count, product count, low stock alerts, recent orders
- Product CRUD with Cloudinary image upload, variant management (size/color/stock)
- Order list with status badges, detail view with one-click status updates
- All routes protected by admin role check

---

## Phase 6: Order System ✅

| Step | Task | Status | Files |
|------|------|--------|-------|
| 6.1 | `POST /api/orders` — create order with date-based order number + stock reservation | ✅ Done | `app/api/orders/route.ts` |
| 6.2 | `GET /api/orders/[id]` — order lookup | ✅ Done | `app/api/orders/[id]/route.ts` |
| 6.3 | Update checkout page to call API | ✅ Done | `app/checkout/page.tsx` |
| 6.4 | Order confirmation page (`/order/[id]`) | ✅ Done | `app/order/[id]/page.tsx` |
| 6.5 | Update admin order status to restore stock on cancel | ✅ Done | `app/api/admin/orders/route.ts` |
| 6.6 | Add `settings` table for configurable shipping | ✅ Done | `db/migrations/002_settings.sql` |
| 6.7 | Admin shipping settings page | ✅ Done | `app/admin/settings/page.tsx`, `app/api/admin/settings/route.ts` |

**Features:**
- Order numbers: date-based format `ORD-YYYYMMDD-XXX`
- Stock: reserved on order creation, restored on cancellation
- Shipping: configurable threshold and cost via admin settings
- Checkout: real API integration, redirects to confirmation page
- Confirmation page: full order details with tracking link

---

## Phase 7: Email Notifications (Resend) ✅

| Step | Task | Status | Files |
|------|------|--------|-------|
| 7.1 | Install `resend`, `@react-email/components`, `@react-email/render` | ✅ Done | `package.json` |
| 7.2 | Order confirmation email template | ✅ Done | `lib/email/templates/OrderConfirmationEmail.tsx` |
| 7.3 | Order status change email template | ✅ Done | `lib/email/templates/OrderStatusEmail.tsx` |
| 7.4 | New order notification (admin) template | ✅ Done | `lib/email/templates/NewOrderEmail.tsx` |
| 7.5 | `lib/email/index.ts` — send helpers | ✅ Done | `lib/email/index.ts` |
| 7.6 | Trigger on order creation (`POST /api/orders`) | ✅ Done | `app/api/orders/route.ts` |
| 7.7 | Trigger on status change (`PATCH /api/admin/orders`) | ✅ Done | `app/api/admin/orders/route.ts` |
| 7.8 | Update `.env` with email vars | ✅ Done | `.env` |

**Features:**
- Editorial/minimal template style matching app aesthetic
- Triggers: order confirmation (customer), status change (customer), new order (admin)
- Domain placeholders (`EMAIL_FROM`, `ADMIN_EMAIL`) ready for custom domain setup

---

## Phase 8: Security Hardening ✅

| Step | Task | Status | Files |
|------|------|--------|-------|
| 8.1 | `zod` validation on all API routes | ✅ Done | `lib/validators.ts`, API routes |
| 8.2 | Rate limiting middleware (API 100 req/min, Auth 5/15min) | ✅ Done | `middleware.ts` |
| 8.3 | Security headers in `next.config.ts` | ✅ Done | `next.config.ts` |
| 8.4 | CSRF protection on state-changing routes | ⏳ | API routes |

**Done:**
- Cloudinary signed direct uploads (client → Cloudinary, bypasses server)
- Upload rate limit: 100 signatures/hour per IP
- Max file size: 100MB (Cloudinary free tier max)
- Allowed formats: jpg, jpeg, png, webp
- Max dimensions: 5000×5000px
- Zod validation applied to: product creation/update, order creation, order status update, user registration, admin settings
- Rate limiting: 100 req/min for APIs, 5 req/15min for auth endpoints
- Security headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

---

## Phase 9: SEO & Performance ✅

| Step | Task | Status | Files |
|------|------|--------|-------|
| 9.1 | Dynamic metadata per product page | ✅ Done | `app/product/[id]/page.tsx` |
| 9.2 | Sitemap generation (`/sitemap.xml`) | ✅ Done | `app/sitemap.ts` |
| 9.3 | robots.txt (`/robots.txt`) | ✅ Done | `app/robots.ts` |
| 9.4 | JSON-LD structured data for products | ✅ Done | `app/product/[id]/page.tsx` |
| 9.5 | Database indexes on common queries | ✅ Done | `db/migrations/001_initial.sql` |
| 9.6 | ISR caching (1 hour) on product/search APIs | ✅ Done | `app/api/products/route.ts`, `app/api/products/[id]/route.ts`, `app/api/search/route.ts` |

**Features:**
- Sitemap auto-includes all products with `lastModified` dates
- Robots.txt blocks `/admin/`, `/api/`, `/login`, `/register`, `/checkout`
- JSON-LD `Product` schema with price, availability, images
- ISR: product/search API responses cached for 1 hour

---

## Phase 10: Testing ✅

| Step | Task | Status | Files |
|------|------|--------|-------|
| 10.1 | Install Vitest + Testing Library | ✅ Done | `package.json` |
| 10.2 | Unit tests: validators, utils | ✅ Done | `tests/unit/` |
| 10.3 | Integration tests: API routes (mocked DB) | ✅ Done | `tests/integration/` |
| 10.4 | E2E tests: checkout flow (Playwright) | ✅ Done | `tests/e2e/` |

**Done:**
- Vitest configured with jsdom environment
- 33 unit tests passing (validators: 20, utils: 13)
- 10 integration tests passing (API routes with mocked DB)
- Playwright E2E tests configured (checkout, navigation, admin protection)
- Test scripts: `npm test` (watch), `npm run test:run`, `npm run test:coverage`, `npm run test:e2e`

---

## Summary

| Phase | Status | Progress |
|-------|--------|----------|
| 1. Database Foundation | ✅ Complete | 100% |
| 2. Product API Layer | ✅ Complete | 100% |
| 3. Cloudinary Integration | ✅ Complete | 100% |
| 4. Authentication | ✅ Complete | 100% |
| 5. Admin Panel | ✅ Complete | 100% |
| 6. Order System | ✅ Complete | 100% |
| 7. Email Notifications | ✅ Complete | 100% |
| 8. Security Hardening | ✅ Complete | 75% (CSRF pending) |
| 9. SEO & Performance | ✅ Complete | 100% |
| 10. Testing | ✅ Complete | 100% |

**Overall Progress:** ~95% complete
