import { useState } from 'react'
import { Button } from './shared/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='h-screen flex items-center justify-center text-3xl'>
        Hello World
        <Button variant="default">Click me</Button>
      </div>
      <div className="bg-blue-600 p-6 rounded-xl">
        Работает ли Tailwind v4?
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
