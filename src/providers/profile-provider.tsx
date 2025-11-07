import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import { supabase } from '@/lib/supabase/client'
import type { Profile, ProfileInput, UseProfileState } from '@/hooks/use-profile'

export const ProfileContext = createContext<UseProfileState | undefined>(undefined)

const useProvideProfile = (): UseProfileState => {
  const { user } = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = user?.id

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      setError(error.message)
    } else if (data) {
      setProfile(data as Profile)
    } else {
      setProfile({
        user_id: userId,
        first_name: null,
        last_name: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    setLoading(false)
  }, [userId])

  useEffect(() => {
    void fetchProfile()
  }, [fetchProfile])

  const saveProfile = useCallback(
    async (input: ProfileInput) => {
      if (!userId) {
        return { data: null, error: 'User not authenticated' }
      }

      setSaving(true)
      setError(null)

      const payload = {
        user_id: userId,
        ...input,
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single()

      if (error) {
        setError(error.message)
        setSaving(false)
        return { data: null, error: error.message }
      }

      if (data) {
        setProfile(data as Profile)
      }

      setSaving(false)
      return { data: (data as Profile) ?? null, error: null }
    },
    [userId]
  )

  return useMemo(
    () => ({
      profile,
      loading,
      saving,
      error,
      refresh: fetchProfile,
      saveProfile,
    }),
    [profile, loading, saving, error, fetchProfile, saveProfile]
  )
}

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const value = useProvideProfile()
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

