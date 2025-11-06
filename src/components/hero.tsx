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

export function Hero() {
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
              <h1 className="text-xl font-bold">Supabase Showcase</h1>
            </div>
            <div className="flex items-center gap-4">
              {user && <CurrentUserAvatar />}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Supabase Features Showcase
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore Supabase's powerful features: Authentication, Storage, and
            Realtime
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
                    <div className="text-center space-y-4">
                      <div className="p-6 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <p className="text-green-700 dark:text-green-400 font-medium text-lg">
                          ✓ Successfully authenticated
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500 mt-2">
                          {user.email}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You can now access File Upload and Realtime Chat
                        features
                      </p>
                    </div>
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
                        username={user.email || user.id.slice(0, 8)}
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
