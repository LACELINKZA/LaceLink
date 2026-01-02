# LaceLink

A wig marketplace connecting shoppers with verified vendors and fast shipping and reliable reviews

## Features
- Marketplace for wigs and hair units
- Vendor onboarding and verification
- Product uploads with pricing control
- Reviews with photo uploads
- Affiliate links (Amazon + vendor sites)
- Admin dashboard for approvals

## Tech Stack
- Next.js (App Router)
- PostgreSQL + Prisma
- NextAuth (Google, magic link, credentials)
- UploadThing (image uploads)
- Tailwind CSS

## Local Development
1) Copy env:
- duplicate `.env.example` -> `.env`
- fill in DATABASE_URL + NEXTAUTH_SECRET (and optional Google/Email/UploadThing)

2) Install + migrate:
```bash
npm install
npx prisma migrate dev --name init
```

3) Run:
```bash
npm run dev
```

## Deploy
This project is designed to be deployed on Vercel (recommended) or any Node host with a PostgreSQL database.

> Note: GitHub Pages is static hosting and does not support Next.js API routes + authentication.
