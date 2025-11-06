import { Hero } from '@/components/hero'
import { ModeToggle } from '@/components/mode-toggle'

function App() {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <Hero />
    </div>
  )
}

export default App
