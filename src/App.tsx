import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-8">
      <div className="flex justify-center items-center gap-8">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={viteLogo}
            className="h-24 w-24 transition-transform duration-200 hover:scale-110"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={reactLogo}
            className="h-24 w-24 transition-transform duration-200 hover:scale-110"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-4xl font-extrabold text-center">
        Vite + React
      </h1>
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center pt-6">
          <Button
            size="lg"
            onClick={() => setCount((count) => count + 1)}
            className="mb-4"
          >
            count is {count}
          </Button>
          <p className="text-muted-foreground text-sm text-center">
            Edit{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
              src/App.tsx
            </code>{' '}
            and save to test HMR
          </p>
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-center text-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
