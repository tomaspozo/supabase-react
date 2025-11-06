import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useSupabase } from '@/hooks/use-supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  text: string
  user_id: string
  user_email: string
  created_at: string
}

const CHAT_CHANNEL = 'demo:chat'
const CHAT_EVENT = 'message_created'

export function Chat() {
  const { user } = useSupabase()
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return

    const channel = supabase.channel(CHAT_CHANNEL, {
      config: {
        broadcast: { self: true },
      },
    })

    channel
      .on<Message>(
        'broadcast',
        { event: CHAT_EVENT },
        (payload) => {
          setMessages((prev) => [...prev, payload.payload])
          // Scroll to bottom when new message arrives
          setTimeout(() => {
            scrollAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
          }, 100)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to chat channel')
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !user || loading) return

    setLoading(true)
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      text: message.trim(),
      user_id: user.id,
      user_email: user.email || 'Anonymous',
      created_at: new Date().toISOString(),
    }

    try {
      const channel = supabase.channel(CHAT_CHANNEL)
      const status = await channel.send({
        type: 'broadcast',
        event: CHAT_EVENT,
        payload: newMessage,
      })

      if (status === 'error') {
        throw new Error('Failed to send message')
      }

      setMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Realtime Chat</CardTitle>
          <CardDescription>Sign in to join the chat</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle>Realtime Chat</CardTitle>
        <CardDescription>
          Messages are broadcast in real-time using Supabase Realtime
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="space-y-3" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((msg) => {
                const isOwnMessage = msg.user_id === user.id
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex flex-col gap-1',
                      isOwnMessage ? 'items-end' : 'items-start'
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2 max-w-[80%]',
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground px-2">
                      {isOwnMessage ? 'You' : msg.user_email.split('@')[0]} •{' '}
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !message.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

