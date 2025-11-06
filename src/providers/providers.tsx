import { ThemeProvider } from './theme-provider'
import { SupabaseProvider } from './supabase-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SupabaseProvider>
        {children}
      </SupabaseProvider>
    </ThemeProvider>
  )
}

