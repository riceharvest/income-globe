# Income Globe

A clean, beautiful website showing what the bottom 90% of earners make in each country. Real income distribution data for 31 countries, sourced from WID.world, OECD, and ILO.

## Features

- **Country income cards** — P10, P25, median, P75, P90 monthly income for each country (USD + local currency)
- **Search & filter** — by country name, region, sort by median income
- **Compare mode** — side-by-side comparison of 2-3 countries
- **"Where do you fit?"** — enter your income to see your percentile in any country
- **Dark mode** — default dark theme with Geist font

## Stack

- [React Router v7](https://reactrouter.com/) (framework mode, SSR)
- [Hono](https://hono.dev/) (API server)
- [Neon](https://neon.tech/) (Postgres) + [Drizzle ORM](https://orm.drizzle.team/)
- [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS v4](https://tailwindcss.com/)
- [Bun](https://bun.sh/) runtime

## Setup

```bash
# Install dependencies
pnpm install

# Copy env file and set your Neon DATABASE_URL
cp .env.example .env

# Push schema to database
pnpm run db:push

# Seed the database with income data for 31 countries
pnpm run db:seed

# Start dev server
pnpm run dev
```

The app works without a database — it uses static JSON data as a fallback. The database is only needed if you want to use the Hono API endpoints.

## Data Sources

Income distribution data (monthly, USD PPP-adjusted) from:

- **WID.world** — World Inequality Database
- **OECD** — Organisation for Economic Co-operation and Development
- **ILO** — International Labour Organization

Data years: 2022-2024. Percentiles shown: P10, P25, P50 (median), P75, P90.

## Countries Covered

Nigeria, South Africa, Kenya, Ghana, Egypt, Morocco, India, Philippines, Indonesia, Vietnam, Bangladesh, Pakistan, Thailand, Malaysia, Germany, Netherlands, United Kingdom, France, Spain, Italy, Poland, Romania, Ukraine, Brazil, Mexico, Colombia, Peru, Ecuador, Argentina, Chile, United States.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm typecheck` | Type checking |
| `pnpm db:push` | Push schema to database |
| `pnpm db:seed` | Seed database with country data |

## Deployment

Deploy to Vercel:

```bash
vercel
```
