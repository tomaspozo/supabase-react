# React + Shadcn UI + Supabase Starter

A modern, production-ready starter template optimized for building full-stack applications with React, Shadcn UI, and Supabase. This template is specifically configured for an enhanced development experience with Cursor AI.

## ✨ Features

- **⚡ React + Vite** - Fast development with Hot Module Replacement (HMR)
- **🎨 Shadcn UI** - Beautiful, accessible UI components built on Radix UI and Tailwind CSS
- **🔐 Supabase** - Backend-as-a-Service with PostgreSQL database, authentication, and real-time subscriptions
- **📘 TypeScript** - Full type safety across the entire stack
- **🎯 Cursor Optimized** - Pre-configured for the best AI-assisted development experience
- **🔧 React Compiler** - Automatic optimization of React components

## 🚀 Supabase Features Showcase

This template showcases three key Supabase features:

### 🔐 Authentication (OTP)
- Email-based OTP authentication
- User avatar display when authenticated
- Secure session management

### 📁 File Upload
- Drag-and-drop file upload interface
- Real-time upload progress
- Supabase Storage integration
- Public file URLs

### 💬 Realtime Chat
- Real-time messaging using Supabase Realtime
- Broadcast pattern for message delivery
- User identification and message timestamps

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
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Supabase Setup

### Storage Bucket
Create a storage bucket for file uploads:
1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `uploads`
3. Set bucket to public (or configure RLS policies as needed)

### Realtime
Realtime is enabled by default for broadcast channels. No additional setup required.

## 🤖 Cursor AI 

This template is optimized for use with Cursor, featuring:
- Pre-configured cursor rules
- Tested and ready for local development with Supabase Local MCP

