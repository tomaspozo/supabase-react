import { ThemeProvider } from './theme-provider'
import { SupabaseProvider } from './supabase-provider'
import { ProfileProvider } from './profile-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SupabaseProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </SupabaseProvider>
    </ThemeProvider>
  )
}
