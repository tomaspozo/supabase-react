import { CurrentUserAvatar } from '@/components/auth/current-user-avatar'
import { OtpAuth } from '@/components/auth/otp-auth'
import { Dropzone } from '@/components/storage/dropzone'
import { Chat } from '@/components/realtime/chat'
import { useSupabase } from '@/hooks/use-supabase'
import { Sparkles, Upload, MessageSquare, Shield } from 'lucide-react'

export function Hero() {
  const { user } = useSupabase()

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Avatar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Supabase Showcase</h1>
            </div>
            <div className="flex items-center gap-4">
              {user && <CurrentUserAvatar />}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Supabase Features Showcase
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore Supabase's powerful features: Authentication, Storage, and
            Realtime
          </p>
        </div>

        {/* Auth Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-semibold">Authentication</h3>
          </div>
          <div className="max-w-md mx-auto">
            {!user ? (
              <div className="text-center p-8 border rounded-lg bg-muted/50">
                <p className="mb-4 text-muted-foreground">
                  Sign in with OTP to get started
                </p>
                <OtpAuth />
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  ✓ Signed in as {user.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* File Upload */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Upload className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">File Upload</h3>
            </div>
            <Dropzone />
          </div>

          {/* Realtime Chat */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">Realtime Chat</h3>
            </div>
            <Chat />
          </div>
        </div>
      </section>
    </div>
  )
}

