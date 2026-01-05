# LaceLink v5 — Stripe Connect payouts (DB-backed)

## Local setup
1) Install deps
   npm install

2) Create your .env from .env.example
   cp .env.example .env

3) Run Prisma migration (creates sqlite dev.db)
   npm run prisma:migrate

4) Start dev server
   npm run dev

## How payouts work
- Vendor logs in (demo) and clicks "Connect Stripe (Get Paid)"
- Connected account ID (acct_...) is stored in the DB (Vendor table)
- Checkout uses destination charges:
  - application_fee_amount = PLATFORM_FEE_CENTS
  - transfer_data.destination = vendor.stripeAccountId

## Production note
SQLite is for local dev. For Vercel, switch Prisma datasource provider to postgresql and set DATABASE_URL to a hosted Postgres (Neon, etc.).
