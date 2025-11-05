import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center items-center gap-8 mb-6 mt-8">
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
      <h1 className="text-4xl font-extrabold text-center mb-4 text-teal-600">
        Vite + React
      </h1>
      <div className="card mx-auto bg-white/90 rounded-xl shadow-md px-8 py-6 flex flex-col items-center max-w-md">
        <button
          className="px-6 py-2 mb-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 font-semibold text-lg"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="text-gray-600 text-sm">
          Edit{' '}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-teal-700">
            src/App.tsx
          </code>{' '}
          and save to test HMR
        </p>
      </div>
      <p className="read-the-docs mt-8 text-center text-gray-500 text-base">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
