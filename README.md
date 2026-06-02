# MENACE - E-Commerce Store

A modern, production-ready e-commerce platform built with Next.js 15, React 19, and TypeScript.

## Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Database:** Neon PostgreSQL (serverless)
- **Auth:** NextAuth v5 (Credentials provider, JWT sessions, role-based access)
- **Storage:** Cloudinary (signed direct uploads, auto-optimization)
- **Email:** Resend (order confirmation, status change, admin notifications)
- **Validation:** Zod (API input validation)
- **Testing:** Vitest (unit/integration), Playwright (E2E)

## Features

- Product catalog with filtering, sorting, and search
- Guest checkout with order tracking
- Admin panel (dashboard, product CRUD, order management, shipping settings)
- Date-based order numbers (`ORD-YYYYMMDD-XXX`)
- Stock reservation on order creation, restoration on cancellation
- Configurable shipping via admin settings
- Email notifications (Resend)
- SEO optimized (sitemap, robots.txt, JSON-LD, ISR caching)
- Security headers, rate limiting, Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL account
- Cloudinary account
- Resend account

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
DATABASE_URL=postgresql://...
CLOUDINARY_URL=cloudinary://...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
AUTH_SECRET=your-secret-here
App_URL=http://localhost:3000
```

### Database Setup

```bash
npm run db:migrate
```

### Seed Admin User

```bash
npm run db:seed
```

Default admin credentials:
- **Email:** `admin@menace.com`
- **Password:** `admin12345`

> Change the password after first login.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed admin user |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint` | Run ESLint |

## Project Structure

```
├── app/                    # Next.js app router
│   ├── admin/              # Admin panel
│   ├── api/                # API routes
│   ├── product/            # Product pages
│   └── ...
├── components/             # React components
├── db/                     # Database migrations & scripts
├── lib/                    # Utilities (db, auth, email, validators)
├── tests/                  # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # E2E tests
└── ...
```

## Admin Panel

Access at `/admin`. Features:
- Dashboard with stats and recent orders
- Product CRUD with Cloudinary image upload
- Order management with status updates
- Shipping settings (threshold, cost)

## Testing

```bash
npm run test:run    # Unit + Integration
npm run test:e2e    # E2E (requires dev server)
```

## Deployment

Build output is configured for standalone deployment:

```bash
npm run build
npm run start
```

Compatible with Vercel, Docker, or any Node.js hosting platform.

## License

MIT
