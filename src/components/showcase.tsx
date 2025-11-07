import { CurrentUserAvatar } from '@/components/auth/current-user-avatar'
import { OtpAuth } from '@/components/auth/otp-auth'
import { useSupabase } from '@/hooks/use-supabase'
import { Sparkles, Upload, MessageSquare, Shield } from 'lucide-react'
import { RealtimeChat } from '@/components/realtime-chat'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/dropzone'
import { ModeToggle } from '@/components/mode-toggle'
import { ProfileForm } from '@/components/profile/profile-form'

export function Showcase() {
  const { user } = useSupabase()

  const uploadProps = useSupabaseUpload({
    bucketName: 'showcase',
    path: user?.id || '',
    allowedMimeTypes: ['image/*'],
    maxFiles: 2,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Avatar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Supabase + React</h1>
            </div>
            <div className="flex items-center gap-4">
              {user && <CurrentUserAvatar />}
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Supabase + React
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Starter template for building with React and Supabase.
            <br />
            Includes: Auth, Storage, and Realtime.
          </p>
        </div>

        {/* Features Tabs */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="authentication" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger
                value="authentication"
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Authentication</span>
                <span className="sm:hidden">Auth</span>
              </TabsTrigger>
              <TabsTrigger value="storage" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">File Upload</span>
                <span className="sm:hidden">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="realtime" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Realtime Chat</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
            </TabsList>

            {/* Authentication Tab */}
            <TabsContent value="authentication">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Authentication
                  </CardTitle>
                  <CardDescription>
                    Secure email-based OTP authentication with Supabase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <div className="space-y-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Sign in with OTP to access all features. We'll send a
                          verification code to your email.
                        </AlertDescription>
                      </Alert>
                      <div className="flex justify-center">
                        <OtpAuth />
                      </div>
                    </div>
                  ) : (
                    <ProfileForm />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* File Upload Tab */}
            <TabsContent value="storage">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    File Upload
                  </CardTitle>
                  <CardDescription>
                    Upload and manage files with Supabase Storage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Please sign in with Authentication to use the File
                        Upload feature.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="flex justify-center">
                      <Dropzone {...uploadProps} className="w-full">
                        <DropzoneEmptyState />
                        <DropzoneContent />
                      </Dropzone>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Realtime Chat Tab */}
            <TabsContent value="realtime">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Realtime Chat
                  </CardTitle>
                  <CardDescription>
                    Real-time messaging powered by Supabase Realtime
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {!user ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Please sign in with Authentication to use the Realtime
                        Chat feature.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="flex-1 border rounded-lg overflow-hidden">
                      <RealtimeChat
                        roomName="showcase"
                        username={user.email?.split('@')[0] || user.id.slice(0, 8)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
