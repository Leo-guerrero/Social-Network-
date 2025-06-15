
import './App.css'

import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('https://social-network-backend-fb0u.onrender.com')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => {
        console.error(err)
        setMessage('Failed to connect to backend.')
      })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-xl">
      <h1 className="text-3xl font-bold mb-4">Frontend is Live</h1>
      <p>{message}</p>
    </div>
  )
}

export default App


