# Sonaverse Renewal Project

Sonaverse(소나버스) 리뉴얼 프로젝트의 프론트엔드/백엔드 통합 레포지토리입니다. Next.js 14 (App Router)와 MongoDB를 기반으로 구축되었습니다.

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [SWR](https://swr.vercel.app/) (Data Fetching), React Context
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Authentication (NextAuth.js or Custom)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Other API Keys (if applicable)
# NEXT_PUBLIC_API_URL=...
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages & API routes
│   ├── admin/           # Admin dashboard pages
│   ├── api/             # Backend API endpoints
│   ├── (public)/        # Public facing pages (grouped)
│   └── ...
├── features/            # Feature-based modules (components, hooks, logic)
│   ├── home/
│   ├── products/
│   ├── stories/
│   └── ...
├── lib/                 # Shared libraries & utilities
│   ├── models/          # Mongoose models
│   ├── hooks/           # Shared hooks
│   ├── db.ts            # Database connection
│   └── utils.ts         # Utility functions
├── shared/              # Shared UI components & layouts
│   ├── components/
│   └── ...
└── ...
```

## 🧪 Testing

Run unit and integration tests using Vitest:

```bash
npm test        # Run tests once
npm run test:watch # Run tests in watch mode
```

## 📦 Build & Deploy

To create a production build:

```bash
npm run build
npm start
```

## 📝 License

This project is proprietary software.
