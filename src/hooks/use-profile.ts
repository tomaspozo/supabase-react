import { useContext } from 'react'
import { ProfileContext } from '@/providers/profile-provider'

export type Profile = {
  user_id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type ProfileInput = {
  first_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
}

export type UseProfileState = {
  profile: Profile | null
  loading: boolean
  saving: boolean
  error: string | null
  refresh: () => Promise<void>
  saveProfile: (input: ProfileInput) => Promise<{ data: Profile | null; error: string | null }>
}

export const useProfile = (): UseProfileState => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

