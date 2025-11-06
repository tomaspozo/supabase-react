import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme-provider'
import { SupabaseProvider } from '@/lib/supabase-context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SupabaseProvider>
        <App />
      </SupabaseProvider>
    </ThemeProvider>
  </StrictMode>
)
