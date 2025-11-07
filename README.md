# React + Supabase Starter

A modern, production-ready starter template optimized for building full-stack applications with React, Shadcn UI, and Supabase. This template is specifically configured for an enhanced development experience with Cursor AI.

## ✨ Features

- **⚡ React + Vite** - Fast development with Hot Module Replacement (HMR)
- **🎨 Shadcn UI** - Beautiful, accessible UI components built on Radix UI and Tailwind CSS
- **🔐 Supabase** - Backend-as-a-Service with PostgreSQL database, authentication, and real-time subscriptions
- **📘 TypeScript** - Full type safety across the entire stack
- **🎯 Cursor Optimized** - Pre-configured for the best AI-assisted development experience
- **🔧 React Compiler** - Automatic optimization of React components

## 🚀 Supabase Features Showcase

This template provides three key Supabase features to start:

- 🔐 Authentication and Profile managenent
- 📁 File Uploads
- 💬 Realtime Chat

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI**: Shadcn UI, Tailwind CSS, Radix UI
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Tooling**: ESLint, Prettier, React Compiler

## 📦 Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Supabase project:
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from Settings > API
   - Create a storage bucket named `uploads` (or update the bucket name in `src/components/storage/dropzone.tsx`)
4. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and anon key:
     ```env
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-publishable-key-or-anon-key
     ```
5. Start Supabase locally:
   ```bash
   npx supabase start
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## 🤖 Cursor AI 

This template is optimized for use with Cursor, featuring:
- Pre-configured cursor rules
- Ready for local development with Supabase Local MCP

## 🛠️ Build On Top

- When you're ready to start building your own features:
  - Remove the sample migration file: `20251107150000_showcase_create_bucket.sql`
  - Delete the demo component: `src/components/showcase.tsx`
  - (Optional) Clean your local database by restarting Supabase with:
    ```bash
    npx supabase db reset
    ```
- 🚀 You're now set to begin developing and customizing your application!


---

## 📝 License

This project is licensed under the MIT License.

---

### 🙌 Stay Connected

Follow me on [X (@tomaspozo_)](https://x.com/tomaspozo_) for updates and more!


