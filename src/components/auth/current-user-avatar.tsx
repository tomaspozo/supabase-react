import { useSupabase } from '@/hooks/use-supabase'
import { useProfile } from '@/hooks/use-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export function CurrentUserAvatar() {
  const { user, signOut } = useSupabase()
  const { profile } = useProfile()

  if (!user) {
    return null
  }

  const getInitials = () => {
    const first = profile?.first_name?.[0]
    const last = profile?.last_name?.[0]

    if (first || last) {
      return `${first ?? ''}${last ?? ''}`.toUpperCase()
    }

    if (user.email) {
      return user.email.slice(0, 2).toUpperCase()
    }

    return undefined
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={profile?.avatar_url ?? user.user_metadata?.avatar_url}
              alt={profile?.first_name ?? user.email ?? 'User'}
            />
            <AvatarFallback>
              {getInitials() ?? <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.first_name || profile?.last_name
                ? [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')
                : user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
