import { useEffect, useMemo, useState } from "react"
import { useProfile } from "@/hooks/use-profile"
import { useSupabase } from "@/hooks/use-supabase"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SupabaseUploadTrigger } from "@/components/upload"
import { Loader2, Pencil, User as UserIcon } from "lucide-react"

const formatDate = (iso?: string | null) => {
  if (!iso) return 'Unknown'
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso))
  } catch (error) {
    return iso
  }
}

export const ProfileForm = () => {
  const { user } = useSupabase()
  const { profile, loading, saving, error, saveProfile } = useProfile()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) {
      return
    }

    setFirstName(profile.first_name ?? "")
    setLastName(profile.last_name ?? "")
    setAvatarUrl(profile.avatar_url ?? "")
  }, [profile])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSuccessMessage("")
    setUploadError(null)
    const { error } = await saveProfile({
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      avatar_url: avatarUrl.trim() || null,
    })

    if (!error) {
      setSuccessMessage("Profile updated successfully.")
    }
  }

  const resetChanges = () => {
    if (!profile) return
    setFirstName(profile.first_name ?? "")
    setLastName(profile.last_name ?? "")
    setAvatarUrl(profile.avatar_url ?? "")
    setSuccessMessage("")
  }

  const isDirty = useMemo(() => {
    if (!profile) return false
    return (
      (profile.first_name ?? "") !== firstName ||
      (profile.last_name ?? "") !== lastName ||
      (profile.avatar_url ?? "") !== avatarUrl
    )
  }, [profile, firstName, lastName, avatarUrl])

  if (!user) {
    return null
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <SupabaseUploadTrigger
        autoUpload
        options={{
          bucketName: "avatars",
          path: user.id,
          allowedMimeTypes: ["image/*"],
          maxFiles: 1,
          maxFileSize: 5 * 1000 * 1000,
          upsert: true,
        }}
        onUploadStart={() => {
          setSuccessMessage("")
          setUploadError(null)
        }}
        onUploadComplete={({ successes, errors }) => {
          const latestSuccess = successes.at(-1)
          if (errors.length > 0) {
            setUploadError(errors.map((error) => error.message).join(", "))
          }
          if (latestSuccess) {
            const filePath = `${user.id}/${latestSuccess}`
            const { data } = supabase.storage
              .from("avatars")
              .getPublicUrl(filePath)
            if (data?.publicUrl) {
              setAvatarUrl(data.publicUrl)
              setSuccessMessage(
                "Avatar uploaded. Remember to save your profile to persist the new URL."
              )
            }
          }
        }}
      >
        {({ open, loading }) => (
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={avatarUrl || undefined}
                  alt={user.email || "User avatar"}
                />
                <AvatarFallback className="uppercase">
                  {user.email ? (
                    user.email.slice(0, 2)
                  ) : (
                    <UserIcon className="h-6 w-6" />
                  )}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute cursor-pointer size-6 -bottom-2 -right-2 rounded-full shadow-sm"
                onClick={open}
                aria-label="Change avatar"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Pencil className="size-3" />
                )}
              </Button>
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{profile?.first_name} {profile?.last_name}</p>
              <p className="text-xs">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Joined {formatDate(user.created_at)}
              </p>
            </div>
          </div>
        )}
      </SupabaseUploadTrigger>

      {uploadError && (
        <Alert variant="destructive">
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first-name">First name</Label>
          <Input
            id="first-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Jane"
            disabled={loading || saving}
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            id="last-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Doe"
            disabled={loading || saving}
            autoComplete="family-name"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && !error && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={!isDirty || saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save changes'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={resetChanges} disabled={!isDirty || saving}>
          Reset
        </Button>
      </div>
    </form>
  )
}

