import { useContext } from 'react'
import { SupabaseContext } from '../providers/supabase-provider'

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

