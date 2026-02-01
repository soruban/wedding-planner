This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Local Development

### Prerequisites

- Node.js 18+ and pnpm
- Docker Desktop (for local database)

### Setup

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Environment Variables**:

   Copy the example environment file:

   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your Clerk credentials.

3. **Start Local Database**:

   ```bash
   docker compose up -d
   ```

4. **Initialize Database**:

   Run migrations to create tables:

   ```bash
   npx prisma migrate dev
   ```

5. **Run the Development Server**:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Management

- **View Data**: `npx prisma studio`
- **Create Migration**: `npx prisma migrate dev --name <migration_name>`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
