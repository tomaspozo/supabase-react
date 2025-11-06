import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Loader2, Mail } from 'lucide-react'

type OtpAuthProps = {
  onAuthSuccess?: () => void
}

export function OtpAuth({ onAuthSuccess }: OtpAuthProps) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) throw error

      setStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })

      if (error) throw error

      setOpen(false)
      setStep('email')
      setEmail('')
      setOtp('')
      onAuthSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('email')
    setOtp('')
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Sign In with OTP</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'email' ? 'Sign in with Email' : 'Enter Verification Code'}
          </DialogTitle>
          <DialogDescription>
            {step === 'email'
              ? "Enter your email address and we'll send you a one-time password."
              : 'We sent a 6-digit code to your email. Enter it below to verify.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send OTP
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                disabled={loading}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || otp.length !== 6}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

